import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FileText, Database, CheckCircle, GitCompareArrows, Cpu } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const STAGES = [
  {
    id: "parsing",
    label: "Parsing Documents",
    sublabel: "Extracting text from uploaded PDFs",
    icon: FileText,
    duration: 4300,
    tasks: [
      "Reading PDF files",
      "Running OCR on scanned pages",
      "Extracting sections and fields",
    ],
  },
  {
    id: "gathering",
    label: "Gathering Data",
    sublabel: "Pulling statistics from parsed documents",
    icon: Database,
    duration: 3600,
    tasks: [
      "Identifying document types",
      "Locating key data fields",
      "Confirming ownership details",
      "Checking tax documents",
      "Verifying lien status",
    ],
  },
  {
    id: "computing",
    label: "Cross Referencing",
    sublabel: "Validating data across documents",
    icon: GitCompareArrows,
    duration: 1800,
    tasks: [
      "Matching shared entities between documents",
      "Computing semantic similarity between claims",
      "Flagging conflicting data",
      "Calculating risk score",
    ],
  },
  {
    id: "ai",
    label: "Loading AI Summary",
    sublabel: "Generating underwriting narrative and action recommendations",
    icon: Cpu,
    duration: 1300,
    tasks: [
      "Synthesizing risk findings",
      "Drafting underwriter recommendations",
      "Generating curative requirements",
      "Building dashboard report",
    ],
  },
];

const TOTAL_DURATION = STAGES.reduce((s, st) => s + st.duration, 0);

export default function LoadingPage() {
  const navigate                    = useNavigate();
  const [stageIndex, setStageIndex]     = useState(0);
  const [taskIndex, setTaskIndex]       = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [completedStages, setCompleted] = useState([]);
  const [globalProgress, setGlobal]     = useState(0);
  const [finished, setFinished]         = useState(false);
  const [elapsed, setElapsed]           = useState(0);
  const [isVisible, setIsVisible]       = useState(false);
  const [isExiting, setIsExiting]       = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Global elapsed timer
  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setElapsed(e => e + 100), 100);
    return () => clearInterval(t);
  }, [finished]);

  // Global progress derived from elapsed
  useEffect(() => {
    const pct = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
    setGlobal(pct);
    if (elapsed >= TOTAL_DURATION) setFinished(true);
  }, [elapsed]);

  // Stage progression
  useEffect(() => {
    if (finished) return;
    let acc = 0;
    for (let i = 0; i < STAGES.length; i++) {
      if (elapsed < acc + STAGES[i].duration) {
        setStageIndex(i);
        const stageElapsed = elapsed - acc;
        const pct = Math.min((stageElapsed / STAGES[i].duration) * 100, 100);
        setStageProgress(pct);
        const taskStep = Math.floor((stageElapsed / STAGES[i].duration) * STAGES[i].tasks.length);
        setTaskIndex(Math.min(taskStep, STAGES[i].tasks.length - 1));
        break;
      }
      acc += STAGES[i].duration;
    }
  }, [elapsed, finished]);

  // Track completed stages
  useEffect(() => {
    let acc = 0;
    const done = [];
    for (let i = 0; i < STAGES.length; i++) {
      if (elapsed >= acc + STAGES[i].duration) done.push(STAGES[i].id);
      acc += STAGES[i].duration;
    }
    setCompleted(done);
  }, [elapsed]);

  const stage = STAGES[stageIndex];
  const StageIcon = stage.icon;

  const handleViewDashboard = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => navigate("/dashboard"), 100);
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        minHeight: "100vh", background: "#fff",
        color: "#1E293B", display: "flex", flexDirection: "column",
      }}
    >
      <Header includeReturn={false}/>

      <div
        style={{
          flex: 1,
          opacity: isExiting ? 0 : isVisible ? 1 : 0,
          transition: "opacity 100ms ease-out",
        }}
      >

      {/* ── PROPERTY CONTEXT BAR ── */}
      <div style={{
        borderBottom: "1px solid #E2E8F0", background: "#FAFAFA",
        padding: "8px 32px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
      }}>
        <FileText style={{ width: 13, height: 13, color: "#94A3B8" }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#1E293B" }}>3 documents uploaded</span>
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#CBD5E1" }} />
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#94A3B8" }}>Title_Commitment_4471.pdf</span>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#94A3B8" }}>· LienSearch_Record_2024.pdf</span>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#94A3B8" }}>· HOA_Statement_Final.pdf</span>
        {!finished && (
          <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: 10, color: "#94A3B8" }}>
            est. {Math.max(0, Math.ceil((TOTAL_DURATION - elapsed) / 1000))}s remaining
          </span>
        )}
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>

        {!finished ? (
          <>
            {/* ── ANIMATION CENTER ── */}
            <div style={{ position: "relative", width: 120, height: 120, marginBottom: 40 }}>
              {/* Outer ring */}
              <svg width="120" height="120" style={{ position: "absolute", top: 0, left: 0 }}>
                <circle cx="60" cy="60" r="54" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                <circle
                  cx="60" cy="60" r="54"
                  fill="none"
                  stroke="#0F172A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - globalProgress / 100)}`}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px", transition: "stroke-dashoffset 0.15s linear" }}
                />
              </svg>

              {/* Inner stage ring */}
              <svg width="120" height="120" style={{ position: "absolute", top: 0, left: 0 }}>
                <circle cx="60" cy="60" r="44" fill="none" stroke="#F1F5F9" strokeWidth="2" />
                <circle
                  cx="60" cy="60" r="44"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${2 * Math.PI * 44 * (1 - stageProgress / 100)}`}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px", transition: "stroke-dashoffset 0.12s linear" }}
                />
              </svg>

              {/* Center icon */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 40, height: 40, borderRadius: 10,
                background: "#F8FAFC", border: "1px solid #E2E8F0",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <StageIcon style={{ width: 18, height: 18, color: "#0F172A" }} />
              </div>

              {/* Orbiting dot */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                width: 8, height: 8,
                animation: "orbit 2s linear infinite",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB", marginLeft: -4, marginTop: -4 }} />
              </div>
            </div>

            {/* Stage label */}
            <div style={{ textAlign: "center", marginBottom: 36, maxWidth: 440 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.03em", marginBottom: 6 }}>
                {stage.label}
              </h2>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>
                {stage.sublabel}
              </p>
            </div>

            {/* Current task ticker */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 6,
              background: "#F8FAFC", border: "1px solid #E2E8F0",
              marginBottom: 40, maxWidth: 360,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563EB", flexShrink: 0, animation: "taskPulse 1s ease infinite" }} />
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "#1E293B", fontWeight: 500 }}>
                {stage.tasks[taskIndex]}
              </span>
            </div>

            {/* Global progress bar */}
            <div style={{ width: "100%", maxWidth: 440, marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8" }}>
                  Overall Progress
                </span>
                <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 700, color: "#0F172A" }}>
                  {Math.round(globalProgress)}%
                </span>
              </div>
              <div style={{ height: 4, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%", background: "#0F172A", borderRadius: 99,
                  width: `${globalProgress}%`,
                  transition: "width 0.15s linear",
                }} />
              </div>
            </div>

            {/* Stage pipeline */}
            <div style={{ display: "flex", alignItems: "center", gap: 0, maxWidth: 560, width: "100%" }}>
              {STAGES.map((s, i) => {
                const isCompleted = completedStages.includes(s.id);
                const isActive    = stageIndex === i && !isCompleted;
                const isPending   = !isCompleted && !isActive;
                const SIcon       = s.icon;
                return (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < STAGES.length - 1 ? 1 : 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 8,
                        border: isCompleted ? "none" : isActive ? "1.5px solid #0F172A" : "1.5px solid #E2E8F0",
                        background: isCompleted ? "#0F172A" : isActive ? "#fff" : "#FAFAFA",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.3s",
                      }}>
                        {isCompleted
                          ? <CheckCircle style={{ width: 15, height: 15, color: "#fff" }} />
                          : <SIcon style={{ width: 14, height: 14, color: isActive ? "#0F172A" : "#CBD5E1" }} />
                        }
                      </div>
                      <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                        textTransform: "uppercase", textAlign: "center",
                        color: isCompleted ? "#0F172A" : isActive ? "#0F172A" : "#CBD5E1",
                        maxWidth: 72, lineHeight: 1.3,
                        transition: "color 0.3s",
                      }}>{s.label}</span>
                    </div>

                    {/* Connector line */}
                    {i < STAGES.length - 1 && (
                      <div style={{ flex: 1, height: 1, margin: "0 6px", marginBottom: 22, background: isCompleted ? "#0F172A" : "#E2E8F0", transition: "background 0.3s" }} />
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* ── FINISHED STATE ── */
          <div style={{ textAlign: "center", maxWidth: 440 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16,
              background: "#ECFDF5", border: "1px solid #BBF7D0",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <CheckCircle style={{ width: 34, height: 34, color: "#059669" }} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.03em", marginBottom: 8 }}>
              Analysis Complete
            </h2>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, marginBottom: 28 }}>
              All 4 stages completed. Dashboard is ready for underwriter review.
            </p>
            <button style={{
              height: 44, padding: "0 28px", borderRadius: 8,
              border: "none", background: "#0F172A", color: "#fff",
              fontSize: 13, fontWeight: 700, cursor: isExiting ? "wait" : "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "inherit", boxShadow: "0 2px 8px rgba(15,23,42,0.18)",
            }}
            onClick={handleViewDashboard}
            disabled={isExiting}
            >
              View Dashboard
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        )}
      </main>

      </div>

      {/* ── FOOTER ── */}
      <Footer />

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(54px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(54px) rotate(-360deg); }
        }
        @keyframes taskPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
