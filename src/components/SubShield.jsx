import React, { useMemo, useState } from "react";
import {
  Shield,
  ShieldCheck,
  HardHat,
  Truck,
  ScrollText,
  Umbrella,
  Building2,
  Bell,
  User,
  Camera,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  Folder,
  X,
  Plus,
  TrendingDown,
  Zap,
} from "lucide-react";

const GREEN = "#10976a";
const AMBER = "#d6890c";
const RED = "#e0524d";
const GOLD = "#c07d0c";

const starterPolicies = [
  {
    id: "gl",
    type: "gl",
    name: "General Liability",
    carrier: "Acme Mutual",
    policy: "GL-44827193",
    days: 45,
    premium: 1840,
    docs: ["GL_Acme_GL-44827193.pdf", "CG 20 10 Additional Insured.pdf", "CG 24 04 Waiver.pdf"],
  },
  {
    id: "wc",
    type: "wc",
    name: "Workers' Compensation",
    carrier: "StateFund West",
    policy: "WC-90183321",
    days: 4,
    premium: 3210,
    docs: ["WC_StateFund_WC-90183321.pdf", "WC Waiver of Subrogation.pdf"],
  },
  {
    id: "auto",
    type: "auto",
    name: "Commercial Auto",
    carrier: "Progressive Commercial",
    policy: "CA-55120984",
    days: 120,
    premium: 2460,
    docs: ["Auto_Progressive_CA-55120984.pdf", "CA 20 48 Additional Insured.pdf"],
  },
  {
    id: "lic",
    type: "lic",
    name: "Trade License",
    carrier: "TX Dept. of Licensing",
    policy: "TL-TILE-0099821",
    days: 60,
    premium: 295,
    docs: ["Trade_License_TL-TILE-0099821.pdf"],
  },
];

const starterGcs = [
  {
    id: "turner",
    name: "Turner Construction",
    color: "#2f6fed",
    initial: "T",
    email: "bids@turner.com",
    pm: "Sarah Chen",
    holder: "Turner Construction Company\n375 Hudson Street\nNew York, NY 10014",
    note: "Requires $2M umbrella and primary non-contributory wording.",
    projects: ["Downtown Marriott Remodel", "Westside School District"],
  },
  {
    id: "suffolk",
    name: "Suffolk",
    color: "#d4582f",
    initial: "S",
    email: "compliance@suffolk.com",
    pm: "Marcus Patel",
    holder: "Suffolk Construction Company, Inc.\n65 Allerton Street\nBoston, MA 02119",
    note: "30-day cancellation notice required.",
    projects: ["Seaport Tower Phase II"],
  },
  {
    id: "dpr",
    name: "DPR Construction",
    color: "#10976a",
    initial: "D",
    email: "coi@dpr.com",
    pm: "Lena Okafor",
    holder: "DPR Construction, A General Partnership\n1450 Veterans Blvd\nRedwood City, CA 94063",
    note: "Standard verified COI package accepted.",
    projects: ["Genentech Lab Buildout"],
  },
];

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage may be disabled; do not crash the app.
  }
}

function status(days) {
  if (days <= 10) return { label: "Critical", color: RED };
  if (days <= 30) return { label: "Expiring", color: AMBER };
  return { label: "Active", color: GREEN };
}

function iconFor(type) {
  return { gl: ShieldCheck, wc: HardHat, auto: Truck, lic: ScrollText, umb: Umbrella }[type] || FileText;
}

function policyScore(days) {
  if (days >= 90) return 100;
  if (days >= 30) return 70;
  if (days >= 10) return 45;
  return 20;
}

function money(value) {
  return `$${value.toLocaleString()}`;
}

export default function SubShield() {
  const [tab, setTab] = useState("home");
  const [policies, setPolicies] = useState(() => load("subshield.policies", starterPolicies));
  const [gcs, setGcs] = useState(() => load("subshield.gcs", starterGcs));
  const [activity, setActivity] = useState(() =>
    load("subshield.activity", [
      "Workers' Comp expires in 4 days.",
      "COI package routed to Turner Construction.",
      "General Liability entered the renewal window.",
    ])
  );
  const [expanded, setExpanded] = useState("wc");
  const [modal, setModal] = useState(null);
  const [selectedGc, setSelectedGc] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState("");

  const score = useMemo(() => {
    const total = policies.reduce((sum, p) => sum + policyScore(p.days), 0);
    return Math.round(total / policies.length);
  }, [policies]);

  const docsCount = policies.reduce((sum, p) => sum + p.docs.length, 0);
  const criticalCount = policies.filter((p) => p.days <= 10).length;

  function updatePolicies(next) {
    setPolicies(next);
    save("subshield.policies", next);
  }

  function updateGcs(next) {
    setGcs(next);
    save("subshield.gcs", next);
  }

  function pushActivity(text) {
    const next = [text, ...activity].slice(0, 12);
    setActivity(next);
    save("subshield.activity", next);
  }

  function renew(policy) {
    const next = policies.map((p) => (p.id === policy.id ? { ...p, days: 365 } : p));
    updatePolicies(next);
    pushActivity(`${policy.name} renewed for 365 days.`);
  }

  function lowerBill(policy) {
    const next = policies.map((p) =>
      p.id === policy.id ? { ...p, carrier: "NEXT Insurance", premium: Math.max(400, p.premium - 520), days: 365 } : p
    );
    updatePolicies(next);
    pushActivity(`${policy.name} switched to NEXT Insurance and saved ${money(520)} per year.`);
  }

  function vaultUmbrella() {
    const exists = policies.some((p) => p.type === "umb");
    if (exists) {
      setModal(null);
      return;
    }
    const next = [
      ...policies,
      {
        id: `umb-${Date.now()}`,
        type: "umb",
        name: "Umbrella / Excess Liability",
        carrier: "Hiscox Insurance Co.",
        policy: "UM-7740921",
        days: 318,
        premium: 980,
        docs: ["Umbrella_Hiscox_UM-7740921.pdf"],
      },
    ];
    updatePolicies(next);
    pushActivity("Umbrella / Excess Liability vaulted from original carrier PDF.");
    setModal(null);
  }

  function beginSend(gc) {
    setSelectedGc(gc);
    setSelectedProject(gc.projects[0] || "New Project");
    setModal("send");
  }

  function sendPackage() {
    const project = newProject.trim() || selectedProject;
    const nextGcs = gcs.map((gc) => {
      if (gc.id !== selectedGc.id || gc.projects.includes(project)) return gc;
      return { ...gc, projects: [project, ...gc.projects] };
    });
    updateGcs(nextGcs);
    pushActivity(`COI package sent to ${selectedGc.name} for ${project}.`);
    setNewProject("");
    setModal("sent");
  }

  return (
    <main style={styles.shell}>
      <section style={styles.phone}>
        <div style={styles.statusBar}>7:04 <span>●●● 100%</span></div>
        <div style={styles.header}>
          <div style={styles.brand}><span style={styles.logo}><Shield size={20} /></span><b>SubShield</b></div>
          <button style={styles.iconButton} onClick={() => setTab("activity")}><Bell size={18} /></button>
        </div>

        {tab === "home" && (
          <div style={styles.content}>
            <div style={styles.hero}>
              <div>
                <div style={styles.kicker}>{criticalCount ? "Action needed" : "Job-site ready"}</div>
                <h1 style={styles.title}>{score}% compliant</h1>
                <p style={styles.text}>{criticalCount ? "Renew the critical policy before it blocks bids or site access." : "All major credentials are active and ready to send."}</p>
              </div>
              <div style={{ ...styles.score, color: score >= 85 ? GREEN : score >= 65 ? AMBER : RED }}>{score}</div>
            </div>

            <div style={styles.sectionRow}><b>Insurance vault</b><span>{docsCount} verified files</span></div>
            {policies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                open={expanded === policy.id}
                onToggle={() => setExpanded(expanded === policy.id ? null : policy.id)}
                onRenew={() => renew(policy)}
                onLowerBill={() => lowerBill(policy)}
                onSend={() => setTab("directory")}
              />
            ))}
          </div>
        )}

        {tab === "directory" && (
          <div style={styles.content}>
            <div style={styles.heroSmall}>
              <Building2 size={28} color={GOLD} />
              <div>
                <h2 style={styles.h2}>GC Directory</h2>
                <p style={styles.text}>Save certificate holder data once and send verified COI packages faster.</p>
              </div>
            </div>
            {gcs.map((gc) => (
              <button key={gc.id} style={styles.gcCard} onClick={() => beginSend(gc)}>
                <span style={{ ...styles.avatar, background: `${gc.color}22`, color: gc.color }}>{gc.initial}</span>
                <span style={{ flex: 1, textAlign: "left" }}><b>{gc.name}</b><small>{gc.projects.length} projects · {gc.email}</small></span>
                <Send size={16} />
              </button>
            ))}
          </div>
        )}

        {tab === "activity" && (
          <div style={styles.content}>
            <div style={styles.sectionRow}><b>Activity</b><span>{activity.length} events</span></div>
            {activity.map((item, index) => (
              <div key={`${item}-${index}`} style={styles.activityItem}>
                <CheckCircle2 size={18} color={GREEN} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "profile" && (
          <div style={styles.content}>
            <div style={styles.profileCard}>
              <div style={styles.profileInitial}>ST</div>
              <h2 style={styles.h2}>SubShield Tile Co.</h2>
              <p style={styles.text}>Tile subcontractor · Austin, TX</p>
              <div style={styles.badge}><Lock size={13} /> Original document vault enabled</div>
            </div>
            <div style={styles.setting}><span>Push renewal alerts</span><b>On</b></div>
            <div style={styles.setting}><span>Auto-shop better rates</span><b>On</b></div>
            <div style={styles.setting}><span>Verified COI routing</span><b>On</b></div>
          </div>
        )}

        <button style={styles.camera} onClick={() => setModal("scan")}><Camera size={24} /></button>
        <nav style={styles.nav}>
          <Tab active={tab === "home"} onClick={() => setTab("home")} icon={Shield} label="Vault" />
          <Tab active={tab === "directory"} onClick={() => setTab("directory")} icon={Building2} label="GCs" />
          <span />
          <Tab active={tab === "activity"} onClick={() => setTab("activity")} icon={Bell} label="Activity" />
          <Tab active={tab === "profile"} onClick={() => setTab("profile")} icon={User} label="Profile" />
        </nav>
      </section>

      {modal === "scan" && (
        <Modal onClose={() => setModal(null)} title="Vault a document">
          <div style={styles.scanBox}><ScanLines /></div>
          <p style={styles.text}>Simulated scan complete. SubShield stores original carrier-issued documents and extracts metadata for tracking.</p>
          <button style={styles.primaryButton} onClick={vaultUmbrella}><Lock size={16} /> Vault Umbrella Policy</button>
        </Modal>
      )}

      {modal === "send" && selectedGc && (
        <Modal onClose={() => setModal(null)} title={`Send package to ${selectedGc.name}`}>
          <div style={styles.infoBox}><b>Certificate holder</b><pre>{selectedGc.holder}</pre></div>
          <div style={styles.infoBox}><b>Requirement note</b><p>{selectedGc.note}</p></div>
          <label style={styles.label}>Project</label>
          <select style={styles.input} value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            {selectedGc.projects.map((p) => <option key={p}>{p}</option>)}
          </select>
          <input style={styles.input} value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder="Or type a new project name" />
          <div style={styles.packageList}>
            {policies.filter((p) => p.type !== "lic").map((p) => <span key={p.id}><FileText size={14} /> {p.name}</span>)}
          </div>
          <button style={styles.primaryButton} onClick={sendPackage}><Send size={16} /> Send verified COI package</button>
        </Modal>
      )}

      {modal === "sent" && (
        <Modal onClose={() => setModal(null)} title="Package delivered">
          <div style={styles.success}><CheckCircle2 size={54} color={GREEN} /></div>
          <p style={styles.text}>The COI package was routed and saved in the activity feed.</p>
          <button style={styles.primaryButton} onClick={() => setModal(null)}>Done</button>
        </Modal>
      )}
    </main>
  );
}

function PolicyCard({ policy, open, onToggle, onRenew, onLowerBill, onSend }) {
  const Icon = iconFor(policy.type);
  const st = status(policy.days);
  return (
    <article style={styles.card}>
      <button style={styles.cardTop} onClick={onToggle}>
        <span style={styles.policyIcon}><Icon size={22} /></span>
        <span style={{ flex: 1, textAlign: "left" }}>
          <b>{policy.name}</b>
          <small>{policy.carrier} · {policy.policy}</small>
        </span>
        <span style={{ ...styles.status, color: st.color, background: `${st.color}18` }}>{st.label}</span>
      </button>
      {open && (
        <div style={styles.cardBody}>
          <div style={styles.timeline}><span style={{ width: `${Math.min(100, Math.max(5, policy.days / 1.2))}%`, background: st.color }} /></div>
          <div style={styles.metaRow}><span>{policy.days} days left</span><span>{money(policy.premium)}/yr</span></div>
          <div style={styles.docs}>
            {policy.docs.map((doc) => <div key={doc}><FileText size={15} /> {doc}</div>)}
          </div>
          <div style={styles.actions}>
            {policy.days <= 10 ? <button style={styles.primaryButton} onClick={onRenew}><Zap size={15} /> Renew now</button> : <button style={styles.secondaryButton} onClick={onLowerBill}><TrendingDown size={15} /> Lower bill</button>}
            <button style={styles.secondaryButton} onClick={onSend}><Send size={15} /> Send</button>
          </div>
        </div>
      )}
    </article>
  );
}

function Tab({ active, onClick, icon: Icon, label }) {
  return <button style={{ ...styles.tab, color: active ? "#181a1f" : "#9a9da3" }} onClick={onClick}><Icon size={20} /><small>{label}</small></button>;
}

function Modal({ title, children, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.close} onClick={onClose}><X size={17} /></button>
        <h2 style={styles.h2}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

function ScanLines() {
  return <>{["70%", "92%", "54%", "88%", "64%"].map((w) => <i key={w} style={{ width: w }} />)}</>;
}

const styles = {
  shell: { minHeight: "100vh", background: "radial-gradient(circle at top, #faf8f0, #deddd8)", display: "grid", placeItems: "center", fontFamily: "Inter, ui-sans-serif, system-ui, Arial", color: "#181a1f", padding: 18 },
  phone: { width: "min(420px, 100%)", height: "min(860px, 94vh)", background: "#f6f5f2", border: "10px solid #1c1e23", borderRadius: 44, overflow: "hidden", position: "relative", boxShadow: "0 36px 90px rgba(0,0,0,.28)" },
  statusBar: { height: 36, padding: "12px 24px 0", display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700 },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" },
  brand: { display: "flex", alignItems: "center", gap: 10, fontSize: 22 },
  logo: { width: 38, height: 38, borderRadius: 13, display: "grid", placeItems: "center", background: "linear-gradient(145deg, #f0ab1f, #c07d0c)", color: "#1a1408" },
  iconButton: { width: 42, height: 42, borderRadius: 14, border: "1px solid #e6e3da", background: "white", display: "grid", placeItems: "center" },
  content: { height: "calc(100% - 178px)", overflowY: "auto", padding: "0 20px 110px" },
  hero: { background: "white", border: "1px solid #e7e3d8", borderRadius: 26, padding: 22, display: "flex", justifyContent: "space-between", gap: 18, boxShadow: "0 16px 35px rgba(20,22,28,.08)" },
  heroSmall: { background: "white", border: "1px solid #e7e3d8", borderRadius: 22, padding: 18, display: "flex", gap: 14, marginBottom: 16 },
  kicker: { color: GOLD, textTransform: "uppercase", letterSpacing: 1.4, fontSize: 11, fontWeight: 800 },
  title: { fontSize: 34, lineHeight: 1, margin: "8px 0", letterSpacing: -1.5 },
  h2: { margin: "0 0 8px", fontSize: 22, letterSpacing: -0.5 },
  text: { color: "#73767c", fontSize: 13, lineHeight: 1.5, margin: 0 },
  score: { width: 84, height: 84, borderRadius: "50%", border: "8px solid #ece9df", display: "grid", placeItems: "center", fontSize: 30, fontWeight: 900 },
  sectionRow: { margin: "24px 4px 12px", display: "flex", justifyContent: "space-between", color: "#73767c" },
  card: { background: "white", border: "1px solid #e7e3d8", borderRadius: 20, marginBottom: 12, overflow: "hidden" },
  cardTop: { width: "100%", border: 0, background: "transparent", padding: 15, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" },
  policyIcon: { width: 46, height: 46, borderRadius: 14, display: "grid", placeItems: "center", background: "#f4f3ef", border: "1px solid #e9e7e0" },
  status: { borderRadius: 10, padding: "6px 9px", fontSize: 11, fontWeight: 900, textTransform: "uppercase" },
  cardBody: { borderTop: "1px solid #f0eee7", padding: 15 },
  timeline: { height: 8, background: "#ece9df", borderRadius: 20, overflow: "hidden" },
  metaRow: { display: "flex", justifyContent: "space-between", marginTop: 10, color: "#73767c", fontSize: 12 },
  docs: { marginTop: 14, display: "grid", gap: 7, color: "#444850", fontSize: 12 },
  actions: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginTop: 16 },
  primaryButton: { border: 0, borderRadius: 13, background: "#181a1f", color: "white", padding: "12px 14px", fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, cursor: "pointer" },
  secondaryButton: { border: "1px solid #e7e3d8", borderRadius: 13, background: "white", color: "#181a1f", padding: "12px 14px", fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, cursor: "pointer" },
  gcCard: { width: "100%", display: "flex", alignItems: "center", gap: 12, border: "1px solid #e7e3d8", background: "white", borderRadius: 18, padding: 14, marginBottom: 10, cursor: "pointer" },
  avatar: { width: 44, height: 44, borderRadius: 14, display: "grid", placeItems: "center", fontWeight: 900 },
  activityItem: { background: "white", border: "1px solid #e7e3d8", borderRadius: 16, padding: 14, marginBottom: 9, display: "flex", gap: 10, alignItems: "center", fontSize: 13 },
  profileCard: { background: "white", border: "1px solid #e7e3d8", borderRadius: 24, padding: 24, textAlign: "center", marginTop: 12 },
  profileInitial: { width: 68, height: 68, borderRadius: 22, margin: "0 auto 12px", display: "grid", placeItems: "center", background: "#f4f3ef", color: GOLD, fontWeight: 900, fontSize: 24 },
  badge: { marginTop: 14, background: "#eaf7f1", color: GREEN, borderRadius: 999, padding: "8px 12px", display: "inline-flex", gap: 6, alignItems: "center", fontWeight: 800, fontSize: 12 },
  setting: { background: "white", border: "1px solid #e7e3d8", borderRadius: 16, padding: 15, marginTop: 10, display: "flex", justifyContent: "space-between" },
  camera: { position: "absolute", left: "50%", bottom: 54, transform: "translateX(-50%)", width: 62, height: 62, borderRadius: 22, border: "5px solid #f6f5f2", background: "linear-gradient(145deg, #f0ab1f, #c07d0c)", display: "grid", placeItems: "center", zIndex: 3 },
  nav: { position: "absolute", left: 16, right: 16, bottom: 16, height: 64, borderRadius: 24, background: "rgba(255,255,255,.9)", border: "1px solid #e7e3d8", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", alignItems: "center", boxShadow: "0 18px 40px rgba(0,0,0,.14)" },
  tab: { border: 0, background: "transparent", display: "grid", placeItems: "center", gap: 2, cursor: "pointer" },
  overlay: { position: "fixed", inset: 0, background: "rgba(24,26,31,.42)", display: "grid", placeItems: "end center", padding: 18, zIndex: 20 },
  modal: { width: "min(420px, 100%)", maxHeight: "88vh", overflowY: "auto", background: "white", borderRadius: "28px 28px 18px 18px", padding: 22, position: "relative", boxShadow: "0 -20px 70px rgba(0,0,0,.24)" },
  close: { position: "absolute", right: 16, top: 16, width: 34, height: 34, borderRadius: 999, border: "1px solid #e7e3d8", background: "#f4f3ef", display: "grid", placeItems: "center" },
  scanBox: { height: 260, borderRadius: 22, background: "linear-gradient(145deg, #f4f3ef, #e8e5da)", border: "1px dashed #cfcabe", display: "grid", placeContent: "center", gap: 11, marginBottom: 16 },
  infoBox: { background: "#f7f6f2", border: "1px solid #e7e3d8", borderRadius: 16, padding: 13, marginBottom: 10, fontSize: 13 },
  label: { display: "block", fontWeight: 800, fontSize: 12, margin: "12px 0 6px" },
  input: { width: "100%", border: "1px solid #e7e3d8", borderRadius: 13, padding: 12, marginBottom: 9 },
  packageList: { display: "grid", gap: 6, margin: "12px 0", fontSize: 13 },
  success: { display: "grid", placeItems: "center", padding: 20 },
};
