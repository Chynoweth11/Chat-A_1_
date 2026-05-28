import SubShield from "./components/SubShield.jsx";

const polish = `
.subshield-app b,.subshield-app small{display:block}
.subshield-app small{margin-top:4px;line-height:1.35;color:#73767c}
.subshield-app article{border-radius:22px!important}
.subshield-app article button{min-height:76px!important}
.subshield-app article button>span:nth-child(2){min-width:0!important}
.subshield-app [style*="padding: 15px"]{padding:17px!important}
.subshield-app [style*="padding: 14px"]{padding:16px!important}
.subshield-app [style*="padding: 0 20px 110px"]{padding-bottom:140px!important}
.subshield-app [style*="height: 260px"]{background:#faf9f6!important}
.subshield-app [style*="height: 260px"]:before{content:"PDF";width:82px;height:108px;border-radius:10px;background:white;border:1px solid #d8d0c1;color:#e0524d;font-weight:900;display:grid;place-items:center;box-shadow:0 12px 24px rgba(24,26,31,.10)}
.subshield-app input,.subshield-app select{font:inherit;outline:none!important;background:#fff!important}
.subshield-app input:focus,.subshield-app select:focus{border-color:#181a1f!important;box-shadow:0 0 0 3px rgba(24,26,31,.08)!important}
.subshield-app pre{white-space:pre-wrap!important;font-family:inherit!important;line-height:1.45!important;margin:8px 0 0!important;color:#3c4047!important}
.subshield-app [style*="fontSize: 13"]{line-height:1.45!important}
`;

export default function App() {
  return (
    <div className="subshield-app">
      <style>{polish}</style>
      <SubShield />
    </div>
  );
}
