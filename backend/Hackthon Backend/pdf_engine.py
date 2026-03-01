"""
extract_pdf_text(file_input, ocr_fallback=True)

Purpose:
    Extract all readable text from a PDF file uploaded by a user.
    This function is designed for backend use in a hackathon / prototype
    underwriting pipeline.

Input:
    - file_input: 
        * file path (str), OR
        * raw bytes (bytes), OR
        * file-like object (e.g. Flask request.files['file'])
    - ocr_fallback (bool):
        If True, run OCR when normal text extraction fails.

Output:
    dict:
    {
        "text":   Full extracted text (string),
        "method": Extraction method used,
        "pages":  Estimated number of pages,
        "notes":  Debug / diagnostic notes
    }
"""

import io
from typing import Union, Dict


# -----------------------------
# Helper: normalize input to bytes
# -----------------------------
def _to_bytes(file_input: Union[str, bytes, io.IOBase]) -> bytes:
    """
    Convert input (path / bytes / file-like) into raw PDF bytes.
    """
    if isinstance(file_input, bytes):
        return file_input

    if isinstance(file_input, str):
        # Treat string input as file path
        with open(file_input, "rb") as f:
            return f.read()

    # Assume file-like object
    data = file_input.read()
    if isinstance(data, str):
        data = data.encode("utf-8")
    return data


# -----------------------------
# Try extracting text using PyPDF2
# -----------------------------
def _try_pypdf2(pdf_bytes: bytes):
    try:
        from PyPDF2 import PdfReader
    except Exception as e:
        return None, f"pypdf2-missing: {e}"

    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        texts = []

        for page in reader.pages:
            try:
                text = page.extract_text() or ""
            except Exception:
                text = ""
            texts.append(text)

        full_text = "\n".join(texts).strip()
        return full_text, "pypdf2"

    except Exception as e:
        return None, f"pypdf2-error: {e}"


# -----------------------------
# Try extracting text using pdfminer
# -----------------------------
def _try_pdfminer(pdf_bytes: bytes):
    try:
        from pdfminer.high_level import extract_text_to_fp
    except Exception as e:
        return None, f"pdfminer-missing: {e}"

    try:
        output = io.StringIO()
        extract_text_to_fp(io.BytesIO(pdf_bytes), output)
        text = output.getvalue().strip()
        return text, "pdfminer"

    except Exception as e:
        return None, f"pdfminer-error: {e}"


# -----------------------------
# Try extracting text using PyMuPDF
# -----------------------------
def _try_pymupdf(pdf_bytes: bytes):
    try:
        import fitz  # PyMuPDF
    except Exception as e:
        return None, f"pymupdf-missing: {e}"

    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        texts = []

        for page in doc:
            try:
                texts.append(page.get_text("text") or "")
            except Exception:
                texts.append("")

        full_text = "\n".join(texts).strip()
        return full_text, "pymupdf"

    except Exception as e:
        return None, f"pymupdf-error: {e}"


# -----------------------------
# Try extracting text using pdfplumber
# -----------------------------
def _try_pdfplumber(pdf_bytes: bytes):
    try:
        import pdfplumber
    except Exception as e:
        return None, f"pdfplumber-missing: {e}"

    try:
        texts = []
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                try:
                    texts.append(page.extract_text() or "")
                except Exception:
                    texts.append("")

        full_text = "\n".join(texts).strip()
        return full_text, "pdfplumber"

    except Exception as e:
        return None, f"pdfplumber-error: {e}"


# -----------------------------
# OCR fallback (for scanned PDFs)
# -----------------------------
def _ocr_pdf(pdf_bytes: bytes, dpi: int = 300):
    """
    OCR fallback using Tesseract.
    Requires:
        - pytesseract
        - pdf2image
        - Pillow
        - System binaries: tesseract, poppler
    """
    try:
        from pdf2image import convert_from_bytes
        import pytesseract
    except Exception as e:
        return None, f"ocr-missing-python-libs: {e}"

    try:
        images = convert_from_bytes(pdf_bytes, dpi=dpi)
    except Exception as e:
        return None, f"ocr-pdf2image-error: {e}"

    texts = []
    for img in images:
        try:
            texts.append(pytesseract.image_to_string(img))
        except Exception as e:
            texts.append(f"[ocr-page-error: {e}]")

    full_text = "\n".join(texts).strip()
    return full_text, "ocr"


# -----------------------------
# Main public function
# -----------------------------
def extract_pdf_text(
    file_input: Union[str, bytes, io.IOBase],
    ocr_fallback: bool = True,
    min_len_for_success: int = 20
) -> Dict:
    """
    Robust PDF → text extraction function.

    Strategy:
        1. Try multiple text-based PDF extractors
        2. Accept the first result with sufficient text
        3. Fall back to OCR if enabled

    Returns:
        {
            "text":   extracted text or empty string,
            "method": extraction method used,
            "pages":  estimated page count,
            "notes":  debug notes
        }
    """
    pdf_bytes = _to_bytes(file_input)
    notes = []

    # Attempt standard text extractors
    for extractor in (_try_pypdf2, _try_pdfminer, _try_pymupdf, _try_pdfplumber):
        text, method = extractor(pdf_bytes)
        if text and len(text) >= min_len_for_success:
            return {
                "text": text,
                "method": method,
                "pages": text.count("\f") + 1,
                "notes": notes
            }
        else:
            notes.append(method or "empty")

    # OCR fallback for scanned PDFs
    if ocr_fallback:
        text, method = _ocr_pdf(pdf_bytes)
        if text and len(text) >= 5:
            notes.append("ocr-used")
            return {
                "text": text,
                "method": method,
                "pages": text.count("\f") + 1,
                "notes": notes
            }
        else:
            notes.append(method or "ocr-empty")

    # Nothing worked
    return {
        "text": "",
        "method": "none",
        "pages": 0,
        "notes": notes
    }


# -----------------------------
# Local test
# -----------------------------
if __name__ == "__main__":
    # Replace with a local PDF path for testing
    result = extract_pdf_text("sample.pdf", ocr_fallback=False)
    print("Method:", result["method"])
    print("Notes:", result["notes"])
    print("Text preview:", result["text"][:1000])