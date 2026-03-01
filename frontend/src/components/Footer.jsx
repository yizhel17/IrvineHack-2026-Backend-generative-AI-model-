import { Shield } from "lucide-react";

export default function Footer() {
    return (
        <footer
        style={{
          borderTop: "1px solid #F1F5F9",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#FAFAFA",
        }}
      >
        <div className="flex items-center gap-2">
          <Shield style={{ width: 12, height: 12, color: "#CBD5E1" }} />
          <span style={{ fontSize: 11, color: "#CBD5E1", fontWeight: 600 }}>AI-Assisted Underwriting Intelligence</span>
        </div>
        <div className="flex items-center gap-5">
          {["For professional use", "California Residential Focus", "v1.0.0"].map((t, i) => (
            <span key={i} style={{ fontSize: 10, color: "#CBD5E1", fontWeight: 600, fontFamily: i === 2 ? "monospace" : "inherit" }}>
              {t}
            </span>
          ))}
        </div>
      </footer>
    )
}