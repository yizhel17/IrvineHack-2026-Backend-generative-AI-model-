import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router";

export default function Header({ includeReturn = false }) {
    const navigate = useNavigate();

    function handleReturn() {
        navigate("/");
    }
    return (
        <header
            className="h-13 flex items-center justify-between px-8 shrink-0"
            style={{ borderBottom: "1px solid #E5E7EB", background: "#fff", padding: 0 }}
        >
            {/* Left: Logo + Name */}
            <div className="flex items-center gap-3">
                <div
                    className="w-7 h-7 rounded flex items-center justify-center"
                    style={{ background: "#0F172A", marginLeft: 12 }}
                >
                    <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-[13px] text-black tracking-tight">Property Risk Intelligence</span>
                    
                    {includeReturn && (
                        <>
                        <span style={{ width: 1, height: 18, background: "#E5E7EB", margin: "0 4px" }} />
                        <button style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748B", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }} onClick={handleReturn}>
                            <ArrowLeft className="w-3.5 h-3.5" /> New Search
                        </button>
                        </>
                    )}
                    
                </div>
            </div>
        </header>
  );
}