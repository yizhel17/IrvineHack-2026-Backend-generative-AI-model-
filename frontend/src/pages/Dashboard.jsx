import { useState } from "react";
import {
  Shield, AlertTriangle, ChevronRight, User, BookOpen,
  LayoutDashboard, BarChart2, FileText, Home, Building2,
  Scale, Brain, Database, AlertCircle, CheckCircle,
  XCircle, Clock, Hash, DollarSign, MapPin, Info,
  TrendingDown, Gavel, ArrowLeft
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// ─── DESIGN TOKENS ───────────────────────────────────────────
const T = {
  navy:    "#0F172A",
  slate:   "#1E293B",
  muted:   "#64748B",
  light:   "#94A3B8",
  border:  "#E2E8F0",
  surface: "#F8FAFC",
  bg:      "#FAFAFA",
  white:   "#FFFFFF",
  pass:    "#059669",
  passBg:  "#ECFDF5",
  risk:    "#DC2626",
  riskBg:  "#FEF2F2",
  warn:    "#D97706",
  warnBg:  "#FFFBEB",
  info:    "#2563EB",
  infoBg:  "#EFF6FF",
  accent:  "#6366F1",
};

// ─── STATUS BADGE ─────────────────────────────────────────────
const Badge = ({ label, type = "neutral" }) => {
  const map = {
    pass:    { bg: T.passBg,  color: T.pass,  dot: T.pass },
    risk:    { bg: T.riskBg,  color: T.risk,  dot: T.risk },
    warn:    { bg: T.warnBg,  color: T.warn,  dot: T.warn },
    info:    { bg: T.infoBg,  color: T.info,  dot: T.info },
    neutral: { bg: "#F1F5F9", color: T.muted, dot: T.light },
  };
  const s = map[type];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 8px", borderRadius: 4,
      background: s.bg, color: s.color,
      fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
      textTransform: "uppercase", fontFamily: "monospace",
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {label}
    </span>
  );
};

// ─── DATA ROW ─────────────────────────────────────────────────
const Row = ({ label, value, mono, badge, badgeType, indent }) => (
  <div style={{
    display: "flex", alignItems: "flex-start",
    justifyContent: "space-between", gap: 16,
    padding: "9px 0",
    borderBottom: `1px solid ${T.border}`,
    paddingLeft: indent ? 16 : 0,
  }}>
    <span style={{ fontSize: 12, color: T.muted, fontWeight: 500, minWidth: 200, flexShrink: 0 }}>
      {label}
    </span>
    <span style={{
      fontSize: 12, color: T.slate, fontWeight: 600,
      textAlign: "right", fontFamily: mono ? "monospace" : "inherit",
    }}>
      {badge ? <Badge label={badge} type={badgeType || "neutral"} /> : value}
    </span>
  </div>
);

// ─── SECTION HEADER ───────────────────────────────────────────
const SectionHeader = ({ icon, title, count }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, marginTop: 28 }}>
    <div style={{
      width: 30, height: 30, borderRadius: 6,
      background: T.surface, border: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", justifyContent: "center", color: T.muted,
      flexShrink: 0,
    }}>{icon}</div>
    <span style={{ fontSize: 12, fontWeight: 700, color: T.slate, letterSpacing: "0.01em" }}>{title}</span>
    {count !== undefined && (
      <span style={{
        marginLeft: 4, fontSize: 10, fontWeight: 700,
        background: T.riskBg, color: T.risk,
        borderRadius: 4, padding: "1px 6px", fontFamily: "monospace",
      }}>{count}</span>
    )}
  </div>
);

// ─── LIEN CARD ────────────────────────────────────────────────
const LienCard = ({ type, amount, status, instNo, recorded, priority, badgeType }) => (
  <div style={{
    border: `1px solid ${T.border}`, borderRadius: 6,
    overflow: "hidden", marginBottom: 8,
    borderLeft: `3px solid ${badgeType === "risk" ? T.risk : badgeType === "warn" ? T.warn : T.pass}`,
  }}>
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 14px", background: T.surface,
      borderBottom: `1px solid ${T.border}`,
    }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: T.slate }}>{type}</span>
      <Badge label={status} type={badgeType} />
    </div>
    <div style={{ padding: "10px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px" }}>
      {amount   && <Row label="Amount"          value={amount}   mono />}
      {instNo   && <Row label="Instrument No."  value={instNo}   mono />}
      {recorded && <Row label="Recorded"        value={recorded} mono />}
      {priority && <Row label="Priority"        value={priority}       />}
    </div>
  </div>
);

// ─── PANEL (card container) ────────────────────────────────────
const Panel = ({ children, style }) => (
  <div style={{
    background: T.white,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    padding: "20px 24px",
    marginBottom: 16,
    ...style,
  }}>{children}</div>
);

// ─── RISK METER ───────────────────────────────────────────────
const RiskMeter = ({ score, label }) => {
  const color = score >= 70 ? T.risk : score >= 40 ? T.warn : T.pass;
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "monospace" }}>{score}</span>
      </div>
      <div style={{ height: 5, background: T.border, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 99 }} />
      </div>
    </div>
  );
};

// ─── GRADE BADGE ──────────────────────────────────────────────
const GradeBadge = ({ grade }) => {
  const map = { A: [T.pass, T.passBg], B: [T.info, T.infoBg], C: [T.warn, T.warnBg], D: [T.risk, T.riskBg], F: ["#7F1D1D", "#FEE2E2"] };
  const [c, bg] = map[grade] || [T.muted, T.surface];
  return (
    <div style={{
      width: 64, height: 64, borderRadius: 10,
      background: bg, color: c,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 28, fontWeight: 900, flexShrink: 0,
    }}>{grade}</div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TAB CONTENT COMPONENTS
// ═══════════════════════════════════════════════════════════════

const TabTitleLiens = () => (
  <div>
    <SectionHeader icon={<AlertTriangle className="w-4 h-4" />} title="Active Liens" count={5} />
    <LienCard type="Federal Tax Lien (IRS)"         amount="$61,400.00"  status="ACTIVE"    instNo="2023-0094471"  recorded="2023-03-14"  priority="Superior"  badgeType="risk" />
    <LienCard type="Mechanic's Lien — Empire Roofing LLC" amount="$18,000.00"  status="ACTIVE"    instNo="2024-0081200"  recorded="2024-11-02"  priority="Junior"    badgeType="risk" />
    <LienCard type="Deed of Trust (Primary Mortgage)"  amount="$388,000.00" status="ACTIVE"    instNo="2019-0218900"  recorded="2019-07-22"  priority="1st"       badgeType="warn" />
    <LienCard type="HOA Assessment Lien"               amount="$4,850.00"   status="ACTIVE"    instNo="2024-0091002"  recorded="2024-09-18"  priority="Superpriority" badgeType="risk" />
    <LienCard type="State Tax Lien (FTB)"              amount="$8,200.00"   status="RELEASED"  instNo="2021-0044312"  recorded="2021-06-05"  priority="N/A"       badgeType="pass" />

    <SectionHeader icon={<FileText className="w-4 h-4" />} title="Foreclosure & Litigation Status" />
    <Panel>
      <Row label="Notice of Default (NOD)"        badge="NOT FILED"      badgeType="pass" />
      <Row label="Notice of Trustee Sale"          badge="NOT FILED"      badgeType="pass" />
      <Row label="Lis Pendens"                     badge="ACTIVE"         badgeType="risk" />
      <Row label="Lis Pendens — Case No."          value="BC-2024-882941" mono />
      <Row label="Lis Pendens — Recorded"          value="2024-10-14"     mono />
      <Row label="Judgment Liens (see Tab 6)"      badge="2 ACTIVE"       badgeType="risk" />
    </Panel>

    <SectionHeader icon={<CheckCircle className="w-4 h-4" />} title="Lien Release Summary" />
    <Panel>
      <Row label="State Tax Lien (FTB) 2021-0044312" badge="RELEASED"   badgeType="pass" />
      <Row label="Release Instrument No."            value="2022-0031100" mono />
      <Row label="Release Recorded"                  value="2022-04-11"   mono />
    </Panel>
  </div>
);

const TabPropertyTax = () => (
  <div>
    <SectionHeader icon={<DollarSign className="w-4 h-4" />} title="Current Tax Status" />
    <Panel>
      <Row label="Tax Status"                 badge="DELINQUENT"      badgeType="risk" />
      <Row label="Unpaid Tax Amount"           value="$14,320.00"      mono />
      <Row label="Number of Delinquent Years"  value="2"               mono />
      <Row label="Tax Years Delinquent"        value="2023, 2024"      mono />
      <Row label="Tax Sale Status"             badge="NOT IN TAX SALE" badgeType="warn" />
      <Row label="Tax Lien Recorded"           badge="YES"             badgeType="risk" />
      <Row label="Tax Lien Recording Date"     value="2024-08-03"      mono />
      <Row label="Tax Lien Instrument No."     value="2024-0076210"    mono />
      <Row label="Next Tax Sale Date"          value="Not Scheduled"   />
    </Panel>

    <SectionHeader icon={<Hash className="w-4 h-4" />} title="Tax Parcel Details" />
    <Panel>
      <Row label="APN"              value="4471-082-033" mono />
      <Row label="County"           value="Riverside County" />
      <Row label="Tax Rate Area"    value="TRA 08-001"   mono />
      <Row label="Assessed Value"   value="$412,000"     mono />
      <Row label="Last Assessment"  value="FY 2024–2025" />
    </Panel>
  </div>
);

const TabProperty = () => (
  <div>
    <SectionHeader icon={<Home className="w-4 h-4" />} title="Property Identification" />
    <Panel>
      <Row label="Full Address"        value="4471 Maple Grove Ln, Riverside, CA 92503" />
      <Row label="APN"                 value="4471-082-033"              mono />
      <Row label="County"              value="Riverside County" />
      <Row label="Legal Description"   value="LOT 14, TRACT 28841, BK 312/44-45, RIVERSIDE CO." mono />
      <Row label="Property Type"       badge="SFR"                       badgeType="info" />
      <Row label="Lot Size"            value="7,200 sq ft"               mono />
      <Row label="Year Built"          value="1988"                      mono />
    </Panel>

    <SectionHeader icon={<User className="w-4 h-4" />} title="Ownership" />
    <Panel>
      <Row label="Current Owner(s)"    value="Hartwell, John D. & Sarah M." />
      <Row label="Vesting Type"        badge="COMMUNITY PROPERTY"        badgeType="info" />
      <Row label="Vesting Instrument"  value="2019-0218774"              mono />
      <Row label="Date Acquired"       value="2019-07-22"                mono />
      <Row label="Last Sale Price"     value="$342,000"                  mono />
      <Row label="Assessed Value"      value="$412,000"                  mono />
    </Panel>
  </div>
);

const TabTitleExceptions = () => (
  <div>
    <SectionHeader icon={<FileText className="w-4 h-4" />} title="Schedule B-II Exceptions" />

    {[
      { ex: "Exception 1", desc: "General and special taxes for fiscal year 2024–2025, a lien not yet due.", type: "warn" },
      { ex: "Exception 2", desc: "Covenants, conditions, and restrictions recorded Book 5201, Page 442.", type: "neutral" },
      { ex: "Exception 3", desc: "Easement for public utilities recorded 1972, Inst. No. 1972-0014312.", type: "neutral" },
      { ex: "Exception 4", desc: "Deed of Trust in favor of Pacific National Bank, Inst. No. 2019-0218900.", type: "warn" },
      { ex: "Exception 5", desc: "Mechanic's Lien in favor of Empire Roofing LLC, Inst. No. 2024-0081200.", type: "risk" },
      { ex: "Exception 6", desc: "Federal Tax Lien, IRS, Inst. No. 2023-0094471.", type: "risk" },
      { ex: "Exception 7", desc: "Boundary dispute / survey exception — eastern parcel edge. Survey not provided.", type: "risk" },
    ].map(({ ex, desc, type }) => (
      <div key={ex} style={{
        border: `1px solid ${T.border}`, borderRadius: 6, padding: "12px 16px",
        marginBottom: 8,
        borderLeft: `3px solid ${type === "risk" ? T.risk : type === "warn" ? T.warn : T.border}`,
        background: type === "risk" ? "#FFFAFA" : T.white,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: T.light, flexShrink: 0, paddingTop: 1 }}>{ex}</span>
          <span style={{ fontSize: 12, color: T.slate, lineHeight: 1.55, flex: 1 }}>{desc}</span>
          <Badge label={type === "risk" ? "HIGH" : type === "warn" ? "NOTE" : "STD"} type={type === "neutral" ? "neutral" : type} />
        </div>
      </div>
    ))}

    <SectionHeader icon={<Building2 className="w-4 h-4" />} title="Easements & Encumbrances" />
    <Panel>
      <Row label="Utility Easement"       badge="RECORDED"  badgeType="neutral" />
      <Row label="Easement Width"         value="20 ft — Northern edge" />
      <Row label="Easement Holder"        value="Southern California Edison" />
      <Row label="Drainage Easement"      badge="NONE"      badgeType="pass" />
      <Row label="Access Easement"        badge="NONE"      badgeType="pass" />
      <Row label="Encroachment"           badge="SUSPECTED" badgeType="warn" />
      <Row label="CC&Rs"                  badge="RECORDED"  badgeType="neutral" />
      <Row label="CC&R Instrument No."    value="5201-0442" mono />
      <Row label="Use Restrictions"       value="Residential only — no ADU per current CC&Rs" />
    </Panel>
  </div>
);

const TabHOA = () => (
  <div>
    <SectionHeader icon={<Building2 className="w-4 h-4" />} title="HOA Status" />
    <Panel>
      <Row label="HOA Exists"             badge="YES"              badgeType="info" />
      <Row label="HOA Name"               value="Maple Grove Villas HOA" />
      <Row label="Monthly Assessment"     value="$385.00"          mono />
      <Row label="Unpaid Assessments"     value="$4,850.00"        mono />
      <Row label="Months Delinquent"      value="14 months"        mono />
      <Row label="Late Fees Included"     value="Yes"              />
      <Row label="HOA Lien Recorded"      badge="YES — ACTIVE"     badgeType="risk" />
      <Row label="HOA Lien Instrument"    value="2024-0091002"     mono />
      <Row label="HOA Lien Date"          value="2024-09-18"       mono />
      <Row label="Superpriority Eligible" badge="YES"              badgeType="risk" />
    </Panel>

    <SectionHeader icon={<Scale className="w-4 h-4" />} title="HOA Litigation" />
    <Panel>
      <Row label="Pending HOA Litigation"  badge="NOT DETECTED"   badgeType="pass" />
      <Row label="Special Assessments"     badge="NONE"           badgeType="pass" />
      <Row label="Estoppel Certificate"    badge="NOT PROVIDED"   badgeType="warn" />
      <Row label="HOA Financial Health"    badge="UNVERIFIED"     badgeType="neutral" />
    </Panel>
  </div>
);

const TabLitigation = () => (
  <div>
    <SectionHeader icon={<Gavel className="w-4 h-4" />} title="Judgment Liens" count={2} />
    <LienCard type="Abstract of Judgment — Hartwell v. Crestline LLC" amount="$22,500.00" status="ACTIVE" instNo="2022-0492001" recorded="2022-12-10" priority="Junior" badgeType="risk" />
    <LienCard type="Abstract of Judgment — Riverside Contractors Inc." amount="$9,100.00"  status="ACTIVE" instNo="2023-0041881" recorded="2023-06-27" priority="Junior" badgeType="risk" />

    <SectionHeader icon={<FileText className="w-4 h-4" />} title="Legal Actions" />
    <Panel>
      <Row label="Lis Pendens Filed"          badge="YES — ACTIVE"     badgeType="risk" />
      <Row label="Case Number"                value="BC-2024-882941"   mono />
      <Row label="Lis Pendens Recorded"       value="2024-10-14"       mono />
      <Row label="Nature of Action"           value="Breach of Contract / Title Dispute" />
      <Row label="Bankruptcy Filing"          badge="NOT DETECTED"     badgeType="pass" />
      <Row label="Pending Foreclosure"        badge="NOT DETECTED"     badgeType="pass" />
      <Row label="Court Actions vs. Title"    badge="1 ACTIVE"         badgeType="risk" />
      <Row label="Recorded Settlements"       badge="NONE"             badgeType="pass" />
    </Panel>
  </div>
);

const TabAI = () => (
  <div>
    {/* Score header */}
    <Panel style={{ background: T.navy, border: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <GradeBadge grade="D" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
            AI Risk Assessment · Feb 27, 2026
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
            Overall Risk Score: <span style={{ color: T.risk }}>74</span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", fontWeight: 400 }}> / 100</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
            Confidence: <span style={{ color: "#A5B4FC", fontFamily: "monospace", fontWeight: 700 }}>87%</span>
            &nbsp;·&nbsp; High Risk — Manual review required
          </div>
        </div>
        <Badge label="HIGH RISK" type="risk" />
      </div>
    </Panel>

    <SectionHeader icon={<BarChart2 className="w-4 h-4" />} title="Risk Breakdown by Category" />
    <Panel>
      <RiskMeter score={91} label="Title & Recorded Liens" />
      <div style={{ marginBottom: 10 }} />
      <RiskMeter score={78} label="Property Tax Status" />
      <div style={{ marginBottom: 10 }} />
      <RiskMeter score={82} label="HOA Risk" />
      <div style={{ marginBottom: 10 }} />
      <RiskMeter score={71} label="Litigation & Legal" />
      <div style={{ marginBottom: 10 }} />
      <RiskMeter score={44} label="Title Exceptions" />
      <div style={{ marginBottom: 10 }} />
      <RiskMeter score={20} label="Property & Ownership" />
    </Panel>

    <SectionHeader icon={<Brain className="w-4 h-4" />} title="AI Risk Summary" />
    <Panel>
      <div style={{
        fontSize: 13, color: T.slate, lineHeight: 1.75,
        borderLeft: `3px solid ${T.risk}`,
        paddingLeft: 16, fontStyle: "italic",
      }}>
        "This file presents a high-risk profile driven by the simultaneous presence of an active IRS federal tax lien ($61,400), an unresolved mechanic's lien ($18,000), an HOA superpriority lien ($4,850), and a recorded lis pendens. Two active abstract of judgment liens further encumber title. Property tax delinquency spans two fiscal years. The combination of a contested cloud on title and unresolved recorded encumbrances creates significant insurability risk. This file should not proceed to commitment without curative resolution of Items 1, 3, 5, and 6."
      </div>
    </Panel>

    <SectionHeader icon={<AlertCircle className="w-4 h-4" />} title="Suggested Underwriting Actions" />
    <Panel>
      {[
        { priority: "1", action: "Obtain IRS Certificate of Release (Form 668-Z) or payoff confirmation for NFTL 2023-0094471.", severity: "CRITICAL" },
        { priority: "2", action: "Require release, waiver, or discharge of mechanic's lien (Empire Roofing, 2024-0081200) prior to commitment.", severity: "CRITICAL" },
        { priority: "3", action: "Obtain HOA estoppel certificate and confirm full payoff or repayment plan for $4,850 delinquency.", severity: "HIGH" },
        { priority: "4", action: "Request litigation status update and legal opinion on lis pendens (BC-2024-882941) prior to issuing policy.", severity: "HIGH" },
        { priority: "5", action: "Require 2-year property tax payoff as condition of commitment. Confirm release of tax lien 2024-0076210.", severity: "HIGH" },
        { priority: "6", action: "Require satisfaction or release of both abstract of judgment liens.", severity: "MEDIUM" },
        { priority: "7", action: "Obtain current survey to confirm or eliminate boundary encroachment noted in Schedule B-II Exception 7.", severity: "MEDIUM" },
      ].map(({ priority, action, severity }) => (
        <div key={priority} style={{
          display: "flex", gap: 12, alignItems: "flex-start",
          padding: "10px 0", borderBottom: `1px solid ${T.border}`,
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: 4,
            background: severity === "CRITICAL" ? T.riskBg : severity === "HIGH" ? T.warnBg : T.surface,
            color: severity === "CRITICAL" ? T.risk : severity === "HIGH" ? T.warn : T.muted,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 800, flexShrink: 0, fontFamily: "monospace",
          }}>{priority}</span>
          <span style={{ fontSize: 12, color: T.slate, lineHeight: 1.55, flex: 1 }}>{action}</span>
          <Badge label={severity} type={severity === "CRITICAL" ? "risk" : severity === "HIGH" ? "warn" : "neutral"} />
        </div>
      ))}
    </Panel>
  </div>
);

const TabMetadata = () => (
  <div>
    <SectionHeader icon={<Database className="w-4 h-4" />} title="Data Sources Aggregated" />
    <Panel>
      {[
        ["Riverside County Recorder", "ACTIVE",  "2026-02-27 08:44 AM"],
        ["California FTB Lien Database", "ACTIVE", "2026-02-27 08:44 AM"],
        ["IRS NFTL Public Index",       "ACTIVE",  "2026-02-27 08:45 AM"],
        ["Riverside County Tax Collector", "ACTIVE", "2026-02-27 08:44 AM"],
        ["CA Secretary of State (UCC)",  "ACTIVE",  "2026-02-27 08:46 AM"],
        ["HOA Records (Direct Query)",   "PARTIAL", "2026-02-26 11:00 AM"],
        ["Court Records (PACER / CA Courts)", "ACTIVE", "2026-02-27 08:47 AM"],
        ["Preliminary Title Report",     "UPLOADED", "2026-02-27 09:01 AM"],
      ].map(([source, status, ts]) => (
        <div key={source} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "9px 0", borderBottom: `1px solid ${T.border}`, gap: 12,
        }}>
          <span style={{ fontSize: 12, color: T.slate, fontWeight: 500, flex: 1 }}>{source}</span>
          <Badge label={status} type={status === "ACTIVE" || status === "UPLOADED" ? "pass" : "warn"} />
          <span style={{ fontSize: 10, color: T.light, fontFamily: "monospace", flexShrink: 0 }}>{ts}</span>
        </div>
      ))}
    </Panel>

    <SectionHeader icon={<Clock className="w-4 h-4" />} title="Analysis Timestamps" />
    <Panel>
      <Row label="Analysis Initiated"        value="2026-02-27 09:00:04 AM PST"  mono />
      <Row label="Document Analysis Complete" value="2026-02-27 09:04:16 AM PST" mono />
      <Row label="Last Data Refresh"         value="2026-02-27 08:47:00 AM PST"  mono />
      <Row label="Report Generated"          value="2026-02-27 09:04:22 AM PST"  mono />
      <Row label="Documents Processed"       value="3 of 3 (100%)"               mono />
      <Row label="Pages Scanned"             value="47 pages"                    mono />
      <Row label="Completeness Score"        badge="91% — 1 GAP NOTED"           badgeType="warn" />
      <Row label="Data Gap"                  value="HOA estoppel not provided" />
    </Panel>

    <SectionHeader icon={<Info className="w-4 h-4" />} title="System & Compliance" />
    <Panel>
      <Row label="Platform Version"      value="v2.4.1"                        mono />
      <Row label="Logic Engine"          value="LienScope Logic Engine v2.4"   />
      <Row label="AI Model Version"      value="LS-Underwrite-3.1-CA"          mono />
      <Row label="Jurisdiction"          value="California Residential"         />
      <Row label="Policy Applicability"  value="CLTA / ALTA Owner & Lender"    />
    </Panel>

    <div style={{
      marginTop: 16, padding: "12px 16px", borderRadius: 6,
      background: T.surface, border: `1px solid ${T.border}`,
      fontSize: 11, color: T.light, lineHeight: 1.65,
    }}>
      <span style={{ fontWeight: 700, color: T.muted }}>⚠ Disclaimer: </span>
      This report is generated by an AI-assisted underwriting intelligence system and is intended for use by licensed insurance underwriters only. It does not constitute legal advice, a title commitment, or a guarantee of insurability. All findings must be independently verified by a qualified underwriter prior to policy issuance. For professional use only — California Residential operations.
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// TAB DEFINITIONS
// ═══════════════════════════════════════════════════════════════
const TABS = [
  { id: "ai",         label: "AI Summary",          icon: <Brain         className="w-3.5 h-3.5" />, alert: 0,  component: TabAI },
  { id: "liens",      label: "Title & Liens",        icon: <AlertTriangle className="w-3.5 h-3.5" />, alert: 5,  component: TabTitleLiens },
  { id: "tax",        label: "Property Tax",          icon: <DollarSign    className="w-3.5 h-3.5" />, alert: 1,  component: TabPropertyTax },
  { id: "property",   label: "Property & Ownership",  icon: <Home          className="w-3.5 h-3.5" />, alert: 0,  component: TabProperty },
  { id: "exceptions", label: "Title Exceptions",      icon: <FileText      className="w-3.5 h-3.5" />, alert: 3,  component: TabTitleExceptions },
  { id: "hoa",        label: "HOA Risk",              icon: <Building2     className="w-3.5 h-3.5" />, alert: 2,  component: TabHOA },
  { id: "litigation", label: "Litigation",            icon: <Scale         className="w-3.5 h-3.5" />, alert: 3,  component: TabLitigation },
  { id: "meta",       label: "Metadata & Audit",      icon: <Database      className="w-3.5 h-3.5" />, alert: 0,  component: TabMetadata },
];

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("ai");
  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component || TabAI;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: T.bg, color: T.slate, height: "100vh", display: "flex", flexDirection: "column" }}>

      <Header includeReturn={true} />

      {/* ── PROPERTY IDENTITY BAR ── */}
      <div style={{
        background: T.white, borderBottom: `1px solid ${T.border}`,
        padding: "10px 20px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <MapPin className="w-3.5 h-3.5" style={{ color: T.light }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: T.navy, letterSpacing: "-0.02em" }}>
              4471 Maple Grove Ln, Riverside, CA 92503
            </span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", paddingLeft: 22 }}>
            {["APN: 4471-082-033", "Riverside County", "SFR · Fee Simple", "Analyzed: Feb 27, 2026 · 9:04 AM"].map((t, i) => (
              <>
                {i > 0 && <span key={`d${i}`} style={{ width: 3, height: 3, borderRadius: "50%", background: T.border, flexShrink: 0 }} />}
                <span key={t} style={{ fontFamily: "monospace", fontSize: 10, color: T.light }}>{t}</span>
              </>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: 7, background: T.riskBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900, color: T.risk }}>D</div>
          <div>
            <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Risk Score</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: T.risk, lineHeight: 1, fontFamily: "monospace" }}>
              74<span style={{ fontSize: 10, color: T.light, fontWeight: 400 }}>/100</span>
            </div>
          </div>
          <div style={{ width: 1, height: 30, background: T.border, margin: "0 2px" }} />
          <Badge label="HIGH RISK — MANUAL REVIEW" type="risk" />
        </div>
      </div>

      {/* ── BODY: LEFT NAV + CONTENT ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* LEFT SIDEBAR NAV */}
        <aside style={{
          width: 200, flexShrink: 0,
          borderRight: `1px solid ${T.border}`,
          background: T.white,
          display: "flex", flexDirection: "column",
          overflowY: "auto",
        }}>
          <div style={{ padding: "12px 12px 6px" }}>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", color: T.light,
              fontFamily: "monospace", display: "block", paddingLeft: 8,
            }}>Sections</span>
          </div>

          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: "100%", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "9px 12px", margin: "1px 0",
                  border: "none", borderRadius: 6,
                  background: isActive ? T.surface : "transparent",
                  borderLeft: isActive ? `2px solid ${T.navy}` : "2px solid transparent",
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.12s",
                }}
              >
                <span style={{ color: isActive ? T.navy : T.light, flexShrink: 0 }}>{tab.icon}</span>
                <span style={{
                  fontSize: 12, fontWeight: isActive ? 700 : 500,
                  color: isActive ? T.navy : T.muted, flex: 1,
                }}>{tab.label}</span>
                {tab.alert > 0 && (
                  <span style={{
                    fontSize: 9, fontWeight: 800, fontFamily: "monospace",
                    background: isActive ? T.risk : T.riskBg,
                    color: isActive ? "#fff" : T.risk,
                    borderRadius: 3, padding: "1px 5px", flexShrink: 0,
                  }}>{tab.alert}</span>
                )}
              </button>
            );
          })}

          {/* Sidebar footer */}
          <div style={{ marginTop: "auto", borderTop: `1px solid ${T.border}`, padding: 12 }}>
            <div style={{ fontSize: 9, color: T.light, fontFamily: "monospace", lineHeight: 1.6 }}>
              <div>v2.4.1 · CA Residential</div>
              <div style={{ color: T.risk, fontWeight: 700 }}>14 issues found</div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, overflowY: "auto", padding: 24, background: T.bg }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <ActiveComponent />
          </div>
        </main>
      </div>

      <Footer />

      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
    </div>
  );
}
