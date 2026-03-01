import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { Upload, X, CheckCircle, AlertCircle, FileText, ChevronRight, Cpu, GitCompareArrows, ChartColumnIncreasing } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ACCEPTED_TYPES = ["application/pdf"];
const MAX_FILES = 6;
const MAX_SIZE_MB = 50;

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const capabilities = [
  {
    icon: <GitCompareArrows className="w-5 h-5" />,
    title: "File Cross Referencing",
    desc: "Consolidates information across multiple documents to surface hidden risks.",
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "AI Powered Analysis",
    desc: "Applies AI models to analyze property data and generate insights.",
  },
  {
    icon: <ChartColumnIncreasing className="w-5 h-5" />,
    title: "Centralized Document View",
    desc: "View title, lien, tax, and HOA information in an organized dashboard.",
  },
];

export default function LandingPage() {
  const navigate                = useNavigate();
  const [files, setFiles]       = useState([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const fileInputRef            = useRef();

  const addFiles = useCallback((incoming) => {
      setError("");
      const valid = [];
      const errs  = [];
      Array.from(incoming).forEach(f => {
        if (!ACCEPTED_TYPES.includes(f.type)) { errs.push(`${f.name}: only PDF files accepted`); return; }
        if (f.size > MAX_SIZE_MB * 1024 * 1024) { errs.push(`${f.name}: exceeds ${MAX_SIZE_MB} MB limit`); return; }
        valid.push({ file: f, id: `${f.name}-${f.size}-${Date.now()}` });
      });
      if (errs.length) setError(errs[0]);
      setFiles(prev => {
        const combined = [...prev, ...valid];
        return combined.slice(0, MAX_FILES);
      });
      setDone(false);
    }, []);
  
    const removeFile = (id) => {
      setFiles(prev => prev.filter(f => f.id !== id));
      setDone(false);
      setError("");
    };
  
    const onDrop = (e) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    };
  
    const handleAnalyze = () => {
      if (!files.length) { setError("Please upload at least one PDF document."); return; }
      setError("");
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setDone(true);
        setTimeout(() => {
          setFadingOut(true);
          setTimeout(() => navigate("/loading"), 100);
        }, 1000);
      }, 2400);
    };

  return (
    <div
      className="min-h-screen bg-white text-black antialiased flex flex-col"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >

      <Header includeReturn={false}/>

      <div
        className="flex-1"
        style={{
          opacity: fadingOut ? 0 : 1,
          transition: "opacity 100ms ease-out",
        }}
      >

      {/* ══ MAIN ══ */}
      <main className="flex-1 flex flex-col items-center" style={{ paddingTop: 54, paddingBottom: 80 }}>

        {/* ── TITLE CARD ── */}
        <div className="text-center mb-10" style={{ maxWidth: 680 }}>
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-sm"
            style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "3px 6px", marginBottom: 20 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" style={{ animation: "pulse 2s infinite" }} />
            <span
              className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest"
              style={{ fontFamily: "monospace" }}
            >
              California Residential · Underwriting Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-bold tracking-tight text-black leading-tight mb-4"
            style={{ fontSize: 38, letterSpacing: "-0.03em", marginBottom: 16 }}
          >
            Unified Risk Intelligence for<br />
            <span style={{ color: "#1E3A8A" }}>California Residential Properties</span>
          </h1>

          {/* Subheading */}
          <p
            className="leading-relaxed font-medium"
            style={{ fontSize: 15, color: "#64748B", maxWidth: 520, margin: "0 auto", marginBottom: 32 }}
          >
            Instantly aggregate title, lien, tax, and HOA risk signals
            into a single underwriting view.
          </p>
        </div>

        <div className="w-full" style={{ maxWidth: 680, marginBottom: 40 }}>
        
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    multiple
                    style={{ display: "none" }}
                    onChange={e => { addFiles(e.target.files); e.target.value = ""; }}
                  />
        
                  {/* Drop zone */}
                  <div
                    onClick={() => !done && fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    style={{
                      border: dragging
                        ? "2px solid #1E3A8A"
                        : done
                        ? "2px solid #059669"
                        : files.length
                        ? "1.5px solid #CBD5E1"
                        : "2px dashed #CBD5E1",
                      borderRadius: 10,
                      background: dragging
                        ? "rgba(30,58,138,0.03)"
                        : done
                        ? "#F0FDF9"
                        : "#fff",
                      cursor: done ? "default" : "pointer",
                      transition: "all 0.18s",
                      boxShadow: dragging
                        ? "0 0 0 4px rgba(30,58,138,0.08)"
                        : "0 2px 8px rgba(0,0,0,0.05)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Empty state */}
                    {files.length === 0 && !done && (
                      <div style={{ padding: "48px 32px", textAlign: "center" }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 10,
                          background: dragging ? "#EFF6FF" : "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          margin: "0 auto 16px",
                          transition: "all 0.18s",
                        }}>
                          <Upload style={{ width: 22, height: 22, color: dragging ? "#1E3A8A" : "#94A3B8" }} />
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 6 }}>
                          {dragging ? "Drop PDFs here" : "Drag & drop documents here"}
                        </p>
                        <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16, lineHeight: 1.6 }}>
                          Title commitments, lien searches, HOA statements, tax certificates
                        </p>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748B", fontWeight: 600 }}>PDF only</span>
                          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#CBD5E1" }} />
                          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748B", fontWeight: 600 }}>up to {MAX_FILES} files</span>
                          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#CBD5E1" }} />
                          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748B", fontWeight: 600 }}>{MAX_SIZE_MB} MB max</span>
                        </div>
                        <div style={{ marginTop: 12 }}>
                          <span style={{ fontSize: 11, color: "#CBD5E1" }}>or</span>{" "}
                          <span style={{ fontSize: 11, color: "#1E3A8A", fontWeight: 700, textDecoration: "underline" }}>browse files</span>
                        </div>
                      </div>
                    )}
        
                    {/* File list */}
                    {files.length > 0 && !done && (
                      <div style={{ padding: "16px" }}>
                        {/* Column headers */}
                        <div style={{
                          display: "grid", gridTemplateColumns: "1fr auto auto",
                          gap: 12, padding: "0 4px 8px",
                          borderBottom: "1px solid #F1F5F9", marginBottom: 4,
                        }}>
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8" }}>Document</span>
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", textAlign: "right" }}>Size</span>
                          <span style={{ width: 20 }} />
                        </div>
        
                        {files.map(({ file, id }) => (
                          <div key={id} style={{
                            display: "grid", gridTemplateColumns: "1fr auto auto",
                            alignItems: "center", gap: 12, padding: "9px 4px",
                            borderBottom: "1px solid #F8FAFC",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                              <div style={{
                                width: 30, height: 30, borderRadius: 6, flexShrink: 0,
                                background: "#FEF2F2", border: "1px solid #FECACA",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <FileText style={{ width: 14, height: 14, color: "#EF4444" }} />
                              </div>
                              <span style={{
                                fontSize: 12, fontWeight: 500, color: "#1E293B",
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                              }}>{file.name}</span>
                            </div>
                            <span style={{ fontSize: 11, fontFamily: "monospace", color: "#94A3B8", flexShrink: 0 }}>
                              {formatBytes(file.size)}
                            </span>
                            <button
                              onClick={e => { e.stopPropagation(); removeFile(id); }}
                              style={{
                                width: 20, height: 20, borderRadius: 4,
                                border: "none", background: "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", color: "#CBD5E1", padding: 0,
                              }}
                              className="hover:text-gray-500"
                            >
                              <X style={{ width: 13, height: 13 }} />
                            </button>
                          </div>
                        ))}
        
                        {/* Add more / count row */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12 }}>
                          {files.length < MAX_FILES ? (
                            <button
                              onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                              style={{
                                fontSize: 11, color: "#1E3A8A", fontWeight: 700,
                                border: "none", background: "none", cursor: "pointer",
                                display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit",
                                padding: 0,
                              }}
                            >
                              + Add more documents
                            </button>
                          ) : (
                            <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>Max {MAX_FILES} files reached</span>
                          )}
                          <span style={{ fontSize: 10, fontFamily: "monospace", color: "#94A3B8" }}>
                            {files.length} / {MAX_FILES} files
                          </span>
                        </div>
                      </div>
                    )}
        
                    {/* Success state */}
                    {done && (
                      <div style={{ padding: "32px", textAlign: "center" }}>
                        <CheckCircle style={{ width: 36, height: 36, color: "#059669", margin: "0 auto 12px" }} />
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#059669", marginBottom: 4 }}>
                          {files.length} file{files.length > 1 ? "s" : ""} uploaded successfully

                        </p>
                      </div>
                    )}
                  </div>
        
                  {/* Error message */}
                  {error && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                      <AlertCircle style={{ width: 13, height: 13, color: "#EF4444", flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600 }}>{error}</span>
                    </div>
                  )}
        
                  {/* Analyze button */}
                  {!done && (
                    <button
                      onClick={handleAnalyze}
                      disabled={loading || files.length === 0}
                      style={{
                        width: "100%", marginTop: 12, height: 46,
                        borderRadius: 8, border: "none",
                        background: files.length === 0 ? "#F1F5F9" : "#0F172A",
                        color: files.length === 0 ? "#94A3B8" : "#fff",
                        fontSize: 13, fontWeight: 700,
                        cursor: files.length === 0 ? "default" : loading ? "wait" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        transition: "background 0.2s",
                        fontFamily: "inherit", letterSpacing: "0.01em",
                        boxShadow: files.length > 0 ? "0 2px 8px rgba(15,23,42,0.15)" : "none",
                      }}
                    >
                      {loading ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                          Uploading {files.length} document{files.length > 1 ? "s" : ""}…
                        </>
                      ) : (
                        <>
                          Run Risk Analysis
                          <ChevronRight style={{ width: 15, height: 15 }} />
                        </>
                      )}
                    </button>
                  )}
        
                  {/* Accepted doc types hint */}
                  {!done && files.length === 0 && (
                    <p style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#CBD5E1" }}>
                      Accepted: Title Commitments · Lien Searches · HOA Statements · Tax Certificates
                    </p>
                  )}
                </div>


        {/* ── CAPABILITY DESCRIPTION ── */}
        <div className="w-full" style={{ maxWidth: 680 }}>
          {/* Divider */}
          <div style={{ height: 1, background: "linear-gradient(to right, transparent, #E2E8F0, transparent)", marginBottom: 40 }} />

          <div
            className="grid"
            style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: "0" }}
          >
            {capabilities.map((c, i) => (
              <div
                key={i}
                style={{
                  padding: "24px 28px",
                  borderRight: i < 2 ? "1px solid #F1F5F9" : "none",
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 36, height: 36, borderRadius: 6,
                    background: "#F8FAFC", border: "1px solid #E2E8F0",
                    marginBottom: 12, color: "#475569",
                  }}
                >
                  {c.icon}
                </div>
                <h3
                  style={{ fontSize: 12, fontWeight: 700, color: "#1E293B", marginBottom: 6, lineHeight: 1.3 }}
                >
                  {c.title}
                </h3>
                <p style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.65, fontWeight: 500 }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </main>

      </div>

      <Footer />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        input::placeholder { color: #94A3B8; }
      `}</style>
    </div>
  );
}
