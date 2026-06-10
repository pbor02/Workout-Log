import { useState, useEffect, useRef, useMemo } from "react";

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DEFAULT_WORKOUTS = {
  Monday: { label:"PUSH", sub:"Chest · Front & Side Delts · Triceps", exercises:[
    {name:"Cable Single-Arm Front Raise",sets:3,reps:"12-15"},{name:"Cable Single-Arm Lateral Raise",sets:4,reps:"13-15"},
    {name:"Machine Chest Press",sets:3,reps:"10-14"},{name:"Machine Shoulder Press",sets:3,reps:"10-14"},
    {name:"Cable Crossover low-to-high",sets:3,reps:"12-15"},{name:"Cable Tricep Pushdown — rope",sets:3,reps:"12-15"},
    {name:"EZ Bar Pushdown",sets:3,reps:"10-14"},{name:"Pec Deck — Rear Delt",sets:3,reps:"13-15"},
    {name:"Lateral Raise Machine (HOME)",sets:3,reps:"15-20"},
  ]},
  Tuesday: { label:"PULL", sub:"Back · Rear Delts · Biceps", exercises:[
    {name:"Cable Single-Arm Rear Delt Pull",sets:3,reps:"13-15"},{name:"Lat Pulldown",sets:4,reps:"8-12"},
    {name:"Seated Cable Row",sets:3,reps:"10-12"},{name:"Single-Arm Cable Row",sets:3,reps:"10-12"},
    {name:"Pec Deck — Rear Delt",sets:4,reps:"12-15"},{name:"Preacher Curl Machine",sets:3,reps:"10-13"},
    {name:"Cable Curl — single arm",sets:3,reps:"11-14"},{name:"Cable Hammer Curl (rope)",sets:3,reps:"12-15"},
  ]},
  Wednesday: { label:"REST", sub:"Active recovery · walk · stretch", exercises:[] },
  Thursday: { label:"ARMS & SHOULDERS", sub:"Biceps · Triceps · All 3 Delt Heads", exercises:[
    {name:"Cable Lateral Raise — single arm",sets:4,reps:"13-15"},{name:"Preacher Curl Machine",sets:4,reps:"9-12"},
    {name:"Cable Curl — single arm (supinated)",sets:3,reps:"12-14"},{name:"Incline Neutral-Grip DB Curl",sets:3,reps:"10-13"},
    {name:"Overhead Cable Tricep Extension",sets:4,reps:"10-13"},{name:"Cable Tricep Pushdown — rope",sets:3,reps:"12-15"},
    {name:"Overhead Cable Extension — single arm",sets:3,reps:"10-13"},{name:"Pec Deck — Rear Delt",sets:3,reps:"12-15"},
    {name:"Cable Front Raise — single arm",sets:3,reps:"12-15"},{name:"Lateral Raise Machine (HOME)",sets:3,reps:"15-20"},
  ]},
  Friday: { label:"LEGS", sub:"Quads · Hamstrings · Glutes · Calves", exercises:[
    {name:"Leg Press",sets:4,reps:"10-15"},{name:"Leg Press — close feet high reps",sets:2,reps:"20-25"},
    {name:"Leg Extension",sets:4,reps:"12-15"},{name:"Seated Leg Curl",sets:4,reps:"10-14"},
    {name:"Seated Leg Curl — drop set",sets:1,reps:"10+10"},{name:"Seated Calf Raise",sets:4,reps:"15-20"},
    {name:"Standing Calf Raise",sets:3,reps:"15-18"},
  ]},
  Saturday: { label:"REST", sub:"Full recovery", exercises:[] },
  Sunday: { label:"FULL UPPER", sub:"Chest · Back · Shoulders · Arms", exercises:[
    {name:"Cable Single-Arm Lateral Raise",sets:3,reps:"14-16"},{name:"Machine Chest Press",sets:3,reps:"12-15"},
    {name:"Lat Pulldown",sets:3,reps:"10-13"},{name:"Pec Deck — Chest Fly",sets:3,reps:"12-15"},
    {name:"Seated Cable Row",sets:3,reps:"11-14"},{name:"Cable Curl — single arm",sets:3,reps:"12-15"},
    {name:"Cable Tricep Pushdown — rope",sets:3,reps:"13-15"},{name:"Pec Deck — Rear Delt",sets:3,reps:"13-15"},
    {name:"Lateral Raise Machine (HOME)",sets:2,reps:"18-20"},
  ]},
};

const EXERCISE_CATALOG_DEFAULT = [
  // Chest
  {name:"Machine Chest Press",category:"Chest"},
  {name:"Pec Deck — Chest Fly",category:"Chest"},
  {name:"Cable Crossover low-to-high",category:"Chest"},
  {name:"Flat Dumbbell Press",category:"Chest"},
  {name:"Incline Dumbbell Press",category:"Chest"},
  {name:"Smith Machine Bench Press",category:"Chest"},
  {name:"Barbell Bench Press",category:"Chest"},
  {name:"Incline Barbell Press",category:"Chest"},
  {name:"Decline Barbell Press",category:"Chest"},
  {name:"Decline Dumbbell Press",category:"Chest"},
  {name:"Dumbbell Fly",category:"Chest"},
  {name:"Incline Dumbbell Fly",category:"Chest"},
  {name:"Cable Fly — high to low",category:"Chest"},
  {name:"Cable Fly — mid",category:"Chest"},
  {name:"Push-Up",category:"Chest"},
  {name:"Weighted Push-Up",category:"Chest"},
  {name:"Chest Dip",category:"Chest"},
  {name:"Close-Grip Bench Press",category:"Chest"},
  // Back
  {name:"Lat Pulldown",category:"Back"},
  {name:"Seated Cable Row",category:"Back"},
  {name:"Single-Arm Cable Row",category:"Back"},
  {name:"Cable Single-Arm Rear Delt Pull",category:"Back"},
  {name:"T-Bar Row",category:"Back"},
  {name:"Assisted Pull-Up",category:"Back"},
  {name:"Pull-Up",category:"Back"},
  {name:"Chin-Up",category:"Back"},
  {name:"Deadlift",category:"Back"},
  {name:"Conventional Deadlift",category:"Back"},
  {name:"Rack Pull",category:"Back"},
  {name:"Barbell Row",category:"Back"},
  {name:"Dumbbell Row",category:"Back"},
  {name:"Chest Supported Row",category:"Back"},
  {name:"Wide Grip Lat Pulldown",category:"Back"},
  {name:"Close Grip Lat Pulldown",category:"Back"},
  {name:"Straight Arm Pulldown",category:"Back"},
  {name:"Low Row Machine",category:"Back"},
  {name:"Hyperextension",category:"Back"},
  {name:"Reverse Hyperextension",category:"Back"},
  // Shoulders
  {name:"Machine Shoulder Press",category:"Shoulders"},
  {name:"Cable Single-Arm Front Raise",category:"Shoulders"},
  {name:"Cable Single-Arm Lateral Raise",category:"Shoulders"},
  {name:"Cable Lateral Raise — single arm",category:"Shoulders"},
  {name:"Cable Front Raise — single arm",category:"Shoulders"},
  {name:"Lateral Raise Machine (HOME)",category:"Shoulders"},
  {name:"Pec Deck — Rear Delt",category:"Shoulders"},
  {name:"Face Pull",category:"Shoulders"},
  {name:"Dumbbell Lateral Raise",category:"Shoulders"},
  {name:"Dumbbell Shoulder Press",category:"Shoulders"},
  {name:"Barbell Overhead Press",category:"Shoulders"},
  {name:"Arnold Press",category:"Shoulders"},
  {name:"Seated Dumbbell Press",category:"Shoulders"},
  {name:"Dumbbell Front Raise",category:"Shoulders"},
  {name:"Barbell Upright Row",category:"Shoulders"},
  {name:"Cable Upright Row",category:"Shoulders"},
  {name:"Rear Delt Fly",category:"Shoulders"},
  {name:"Bent Over Rear Delt Raise",category:"Shoulders"},
  // Biceps
  {name:"Preacher Curl Machine",category:"Biceps"},
  {name:"Cable Curl — single arm",category:"Biceps"},
  {name:"Cable Curl — single arm (supinated)",category:"Biceps"},
  {name:"Cable Hammer Curl (rope)",category:"Biceps"},
  {name:"Incline Neutral-Grip DB Curl",category:"Biceps"},
  {name:"EZ Bar Curl",category:"Biceps"},
  {name:"Dumbbell Hammer Curl",category:"Biceps"},
  {name:"Barbell Curl",category:"Biceps"},
  {name:"Concentration Curl",category:"Biceps"},
  {name:"Preacher Curl",category:"Biceps"},
  {name:"Spider Curl",category:"Biceps"},
  {name:"Reverse Curl",category:"Biceps"},
  {name:"Zottman Curl",category:"Biceps"},
  {name:"Cable Preacher Curl",category:"Biceps"},
  // Triceps
  {name:"Cable Tricep Pushdown — rope",category:"Triceps"},
  {name:"EZ Bar Pushdown",category:"Triceps"},
  {name:"Overhead Cable Tricep Extension",category:"Triceps"},
  {name:"Overhead Cable Extension — single arm",category:"Triceps"},
  {name:"Tricep Dip Machine",category:"Triceps"},
  {name:"Skull Crushers",category:"Triceps"},
  {name:"Tricep Dip",category:"Triceps"},
  {name:"Diamond Push-Up",category:"Triceps"},
  {name:"Dumbbell Overhead Extension",category:"Triceps"},
  {name:"Tricep Kickback",category:"Triceps"},
  {name:"Cable Kickback",category:"Triceps"},
  {name:"JM Press",category:"Triceps"},
  // Legs
  {name:"Leg Press",category:"Legs"},
  {name:"Leg Press — close feet high reps",category:"Legs"},
  {name:"Leg Extension",category:"Legs"},
  {name:"Seated Leg Curl",category:"Legs"},
  {name:"Seated Leg Curl — drop set",category:"Legs"},
  {name:"Hack Squat",category:"Legs"},
  {name:"Bulgarian Split Squat",category:"Legs"},
  {name:"Romanian Deadlift",category:"Legs"},
  {name:"Barbell Back Squat",category:"Legs"},
  {name:"Front Squat",category:"Legs"},
  {name:"Goblet Squat",category:"Legs"},
  {name:"Sumo Deadlift",category:"Legs"},
  {name:"Lying Leg Curl",category:"Legs"},
  {name:"Hip Thrust",category:"Legs"},
  {name:"Barbell Hip Thrust",category:"Legs"},
  {name:"Walking Lunges",category:"Legs"},
  {name:"Reverse Lunges",category:"Legs"},
  {name:"Split Squat",category:"Legs"},
  {name:"Step-Up",category:"Legs"},
  {name:"Single-Leg Press",category:"Legs"},
  {name:"Smith Machine Squat",category:"Legs"},
  {name:"Leg Adduction Machine",category:"Legs"},
  {name:"Leg Abduction Machine",category:"Legs"},
  {name:"Glute Ham Raise",category:"Legs"},
  {name:"Stiff-Leg Deadlift",category:"Legs"},
  {name:"Calf Press on Leg Press",category:"Legs"},
  // Calves
  {name:"Seated Calf Raise",category:"Calves"},
  {name:"Standing Calf Raise",category:"Calves"},
  {name:"Donkey Calf Raise",category:"Calves"},
  {name:"Smith Machine Calf Raise",category:"Calves"},
  {name:"Single-Leg Calf Raise",category:"Calves"},
  {name:"Leg Press Calf Raise",category:"Calves"},
  // Core
  {name:"Plank",category:"Core"},
  {name:"Hanging Leg Raise",category:"Core"},
  {name:"Cable Crunch",category:"Core"},
  {name:"Ab Wheel Rollout",category:"Core"},
  {name:"Decline Sit-Up",category:"Core"},
  {name:"Crunch",category:"Core"},
  {name:"Russian Twist",category:"Core"},
  {name:"Bicycle Crunch",category:"Core"},
  {name:"Knee Raise",category:"Core"},
  {name:"Dragon Flag",category:"Core"},
  {name:"Landmine Rotation",category:"Core"},
  {name:"Side Plank",category:"Core"},
  {name:"Dead Bug",category:"Core"},
  {name:"Hollow Body Hold",category:"Core"},
  // Cardio
  {name:"Treadmill",category:"Cardio"},
  {name:"Stationary Bike",category:"Cardio"},
  {name:"Rowing Machine",category:"Cardio"},
  {name:"Elliptical",category:"Cardio"},
  {name:"Jump Rope",category:"Cardio"},
  {name:"Stair Climber",category:"Cardio"},
  {name:"Sled Push",category:"Cardio"},
];

const autoDay = () => DAYS[new Date().getDay()];
// FIX: date keys are now LOCAL time. toISOString() is UTC — any workout finished after
// 7/8pm Eastern was stamped with the NEXT day's date (confirmed in real history:
// 2026-04-22-Tuesday, 2026-06-06-Friday).
const localDateKey = (d) => { const x = d ? new Date(d) : new Date(); return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`; };
const todayKey = () => localDateKey();
const dateLabel = () => new Date().toLocaleDateString("en-US", { month:"short", day:"numeric" });
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbz5Zm1-YRLwAG2kYxQqiVVcjfWCHGRBQLwBrTUCMP311w__ZZWLotNYotFWEr7oldw3Qg/exec";

let activeProfileId = null;

const store = {
  async get(k) { try { var v = localStorage.getItem("wl_" + activeProfileId + "_" + k); return v ? JSON.parse(v) : null; } catch(e) { return null; } },
  async set(k, v) { try { localStorage.setItem("wl_" + activeProfileId + "_" + k, JSON.stringify(v)); } catch(e) { console.error(e); } },
};
function getShared(k) { try { var v = localStorage.getItem("wl_" + k); return v ? JSON.parse(v) : null; } catch(e) { return null; } }
function setShared(k, v) { try { localStorage.setItem("wl_" + k, JSON.stringify(v)); } catch(e) {} }

// FIX: one shared AudioContext, created/resumed inside a user gesture. iOS Safari
// suspends contexts created outside a tap, which silently killed the rest-done beep.
let _audioCtx = null;
function ensureAudioCtx() {
  try {
    if(!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(_audioCtx.state === "suspended") _audioCtx.resume();
    return _audioCtx;
  } catch(e) { return null; }
}

// FIX: normalize history entries whose date is a locale string
// ("Mon Mar 16 2026 00:00:00 GMT-0400 ...") instead of YYYY-MM-DD. Those entries were
// silently dropped from Analytics weekly stats / streak.
function normalizeHistory(hist) {
  let changed = false;
  const norm = {};
  Object.entries(hist).forEach(([k, v]) => {
    let nk = k, nv = v;
    // Repair entries whose sets/checkIn were stored as JSON strings (old restore bug / Sheets sync)
    if(nv && typeof nv.sets === "string") { try { nv = {...nv, sets: JSON.parse(nv.sets)}; changed = true; } catch(e) { nv = {...nv, sets: {}}; changed = true; } }
    if(nv && typeof nv.checkIn === "string") { try { nv = {...nv, checkIn: JSON.parse(nv.checkIn)}; changed = true; } catch(e) { nv = {...nv, checkIn: {}}; changed = true; } }
    if(v && v.date && !/^\d{4}-\d{2}-\d{2}$/.test(v.date)) {
      const d = new Date(v.date);
      if(!isNaN(d)) {
        const iso = localDateKey(d);
        nv = {...v, date: iso, dateLabel: d.toLocaleDateString("en-US",{month:"short",day:"numeric"})};
        nk = `${iso}-${v.day}`;
        changed = true;
      }
    }
    let safe = nk, n = 1;
    while(norm[safe]) { safe = `${nk}-${n++}`; }
    norm[safe] = nv;
  });
  return { hist: changed ? norm : hist, changed };
}

const T = {
  bg:"#000000", surface:"#1C1C1E", surface2:"#2C2C2E", surface3:"#3A3A3C",
  border:"#38383A", border2:"#48484A",
  text:"#FFFFFF", sub:"rgba(235,235,245,0.62)", dim:"rgba(235,235,245,0.35)",
  accent:"#FF9F0A",
  accentDim:"rgba(255,159,10,0.15)",
  accentLight:"rgba(255,159,10,0.08)",
  accentGlow:"rgba(255,159,10,0.30)",
  accentGradient:"#FF9F0A",
  spaceBg:"#000000",
  green:"#30D158", greenBg:"rgba(48,209,88,0.12)",
  yellow:"#FFD60A", yellowBg:"rgba(255,214,10,0.12)",
  warning:"#FFD60A",
  red:"#FF453A", redBg:"rgba(255,69,58,0.12)",
  teal:"#64D2FF", tealBg:"rgba(100,210,255,0.12)",
  font:"-apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif",
  display:"-apple-system,BlinkMacSystemFont,system-ui,sans-serif",
  mono:"ui-monospace,'SF Mono',SFMono-Regular,Menlo,monospace",
  timerBg:"#000000",
};

const DIFF = {
  easy:       { label:"Easy",       color:"#30D158", bg:"rgba(48,209,88,0.12)", btnBg:"rgba(48,209,88,0.20)", icon:"\u2191" },
  just_right: { label:"Just Right", color:"#FFD60A", bg:"rgba(255,214,10,0.12)",  btnBg:"rgba(255,214,10,0.20)",  icon:"\u2022" },
  hard:       { label:"Hard",       color:"#FF453A", bg:"rgba(255,69,58,0.12)",  btnBg:"rgba(255,69,58,0.20)",  icon:"\u2193" },
};
const CATEGORIES = ["Chest","Back","Shoulders","Biceps","Triceps","Legs","Calves","Core","Cardio","Other"];

const css = `
  html,body{background:#000}
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased;-webkit-touch-callout:none}
  body{overscroll-behavior:none;-webkit-user-select:none;user-select:none}
  input,textarea{-webkit-user-select:text;user-select:text}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.border2};border-radius:2px}
  input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
  input[type=number]{-moz-appearance:textfield}
  textarea{font-family:${T.font}}
  @keyframes slideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes timerPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
  @keyframes cosmicPulse{0%,100%{box-shadow:0 0 0 0 #FF9F0A00}50%{box-shadow:0 0 18px 4px #FF9F0A28}}
  @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes digitAppear{0%{opacity:0;filter:blur(8px)}100%{opacity:1;filter:blur(0)}}
  @keyframes urgentPulse{0%,100%{opacity:1;filter:drop-shadow(0 0 20px #FF9F0A80)}50%{opacity:0.85;filter:drop-shadow(0 0 55px #FF9F0A90)}}
  @media screen and (orientation:landscape){
    .app-wrap{position:absolute!important;top:100%!important;left:0!important;width:100vh!important;height:100vw!important;max-width:100vh!important;margin:0!important;transform:rotate(-90deg);transform-origin:top left;}
  }
  .bottom-nav{height:calc(56px + max(env(safe-area-inset-bottom,0px),12px))}
  input:focus{border-color:#FF9F0A!important;box-shadow:none!important}
  button{font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif}
  button:active{opacity:.55}
  .cta-btn{}
`;

function migrateIfNeeded() {
  const profiles = getShared("profiles");
  if(profiles && profiles.length > 0) return;
  const legacyHistory = localStorage.getItem("wl_iron-history");
  if(legacyHistory) {
    const profile = { id: "peter", name: "Peter", createdAt: "2026-03-17", restTime: 90 };
    setShared("profiles", [profile]);
    setShared("active-profile", "peter");
    const keysToMigrate = [];
    for(let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if(key && key.startsWith("wl_") && key !== "wl_profiles" && key !== "wl_active-profile") keysToMigrate.push(key);
    }
    keysToMigrate.forEach(key => {
      const newKey = key.replace("wl_", "wl_peter_");
      localStorage.setItem(newKey, localStorage.getItem(key));
      localStorage.removeItem(key);
    });
  }
}

export default function App() {
  const [profileReady, setProfileReady] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);
  const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  useEffect(() => {
    migrateIfNeeded();
    const active = getShared("active-profile");
    const profiles = getShared("profiles") || [];
    const profile = profiles.find(p => p.id === active);
    if(profile) { activeProfileId = profile.id; setActiveProfile(profile); }
    setProfileReady(true);
    if(!isStandalone && profiles.length > 0 && !getShared("install-guide-dismissed")) {
      setShared("install-guide-dismissed", true);
    }
  }, []);
  function onProfileSelected(profile) { activeProfileId = profile.id; setShared("active-profile", profile.id); setActiveProfile(profile); const ps=getShared("profiles")||[]; if(!isStandalone && !getShared("install-guide-dismissed") && ps.length<=1) setShowInstallGuide(true); }
  function onLogout() { activeProfileId = null; setShared("active-profile", null); setActiveProfile(null); }
  function onProfileUpdated(updatedProfile) {
    const profiles = getShared("profiles") || [];
    const idx = profiles.findIndex(p => p.id === updatedProfile.id);
    if(idx >= 0) profiles[idx] = updatedProfile;
    setShared("profiles", profiles);
    setActiveProfile(updatedProfile);
  }
  function dismissInstallGuide(permanent) { setShowInstallGuide(false); if(permanent) setShared("install-guide-dismissed", true); }
  if(!profileReady) return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.font}}><style>{css}</style><div style={{color:T.dim,fontSize:13,animation:"pulse 1.5s infinite"}}>Loading...</div></div>;
  return (<>
    <style>{css}</style>
    {showInstallGuide && (
      <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>dismissInstallGuide(false)}>
        <div onClick={e=>e.stopPropagation()} style={{background:T.surface,borderRadius:"20px 20px 0 0",padding:"28px 24px 40px",width:"100%",maxWidth:480}}>
          <div style={{width:40,height:4,background:T.border,borderRadius:2,margin:"0 auto 24px"}} />
          <div style={{fontSize:22,fontWeight:800,marginBottom:6}}>Add to Home Screen</div>
          <div style={{fontSize:13,color:T.sub,marginBottom:24,lineHeight:1.6}}>For the best experience, install this app on your device — it'll work offline and feel like a native app.</div>
          <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:28}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
              <div style={{width:32,height:32,borderRadius:8,background:T.accentDim,border:`1.5px solid ${T.accent}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>1</div>
              <div><div style={{fontSize:14,fontWeight:600,marginBottom:2}}>Open in Safari</div><div style={{fontSize:12,color:T.sub}}>This only works in Safari — not Chrome or Firefox.</div></div>
            </div>
            <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
              <div style={{width:32,height:32,borderRadius:8,background:T.accentDim,border:`1.5px solid ${T.accent}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>2</div>
              <div><div style={{fontSize:14,fontWeight:600,marginBottom:2}}>Tap the Share button</div><div style={{fontSize:12,color:T.sub}}>The <span style={{fontWeight:700}}>⬆ Share</span> icon at the bottom of the screen.</div></div>
            </div>
            <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
              <div style={{width:32,height:32,borderRadius:8,background:T.accentDim,border:`1.5px solid ${T.accent}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>3</div>
              <div><div style={{fontSize:14,fontWeight:600,marginBottom:2}}>Tap "Add to Home Screen"</div><div style={{fontSize:12,color:T.sub}}>Scroll down in the share sheet and tap <span style={{fontWeight:700}}>Add to Home Screen</span>.</div></div>
            </div>
            <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
              <div style={{width:32,height:32,borderRadius:8,background:T.accentDim,border:`1.5px solid ${T.accent}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>4</div>
              <div><div style={{fontSize:14,fontWeight:600,marginBottom:2}}>Tap Add</div><div style={{fontSize:12,color:T.sub}}>Confirm and the app icon will appear on your Home Screen.</div></div>
            </div>
          </div>
          <button onClick={()=>dismissInstallGuide(true)} style={{width:"100%",padding:"15px",background:T.accentGradient,color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:T.font,marginBottom:10}}>Got it</button>
          <button onClick={()=>dismissInstallGuide(false)} style={{width:"100%",padding:"12px",background:"none",border:"none",color:T.dim,fontSize:13,cursor:"pointer",fontFamily:T.font}}>Remind me later</button>
        </div>
      </div>
    )}
    {!activeProfile ? <ProfileScreen onSelect={onProfileSelected} /> : <WorkoutLog profile={activeProfile} onLogout={onLogout} onProfileUpdated={onProfileUpdated} />}
  </>);
}

function ProfileScreen({onSelect}) {
  const [profiles, setProfiles] = useState(() => getShared("profiles") || []);
  const [showWizard, setShowWizard] = useState(() => (getShared("profiles") || []).length === 0);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [restTime, setRestTime] = useState(90);
  const [customRest, setCustomRest] = useState("");
  const [split, setSplit] = useState(() => {
    const s = {};
    DAYS.forEach(d => { const def = DEFAULT_WORKOUTS[d]; s[d] = { training: (def?.exercises||[]).length > 0, label: def?.label||"REST", sub: def?.sub||"" }; });
    return s;
  });
  const [wizardExercises, setWizardExercises] = useState(() => { const e={}; DAYS.forEach(d=>{e[d]=[];}); return e; });
  const [addingExForDay, setAddingExForDay] = useState(null);
  const [newExName, setNewExName] = useState("");
  const [newExSets, setNewExSets] = useState("3");
  const [newExReps, setNewExReps] = useState("10-12");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const trainingDays = DAYS.filter(d => split[d]?.training);

  function deleteProfile(id) {
    const keysToRemove = [];
    for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key&&key.startsWith(`wl_${id}_`))keysToRemove.push(key);}
    keysToRemove.forEach(k=>localStorage.removeItem(k));
    const updated = profiles.filter(p=>p.id!==id);
    setShared("profiles", updated); setProfiles(updated); setConfirmDeleteId(null);
    if(updated.length===0) setShowWizard(true);
  }
  function addWizardExercise(day) {
    if(!newExName.trim()) return;
    setWizardExercises(prev => ({...prev, [day]: [...(prev[day]||[]), {name:newExName.trim(), sets:newExSets||"3", reps:newExReps||"10-12"}]}));
    setNewExName(""); setNewExSets("3"); setNewExReps("10-12"); setAddingExForDay(null);
  }
  function removeWizardExercise(day, idx) { setWizardExercises(prev => ({...prev, [day]: prev[day].filter((_,i)=>i!==idx)})); }

  async function finishWizard() {
    const id = Math.random().toString(36).substring(2, 10);
    const rt = customRest ? (parseInt(customRest)||90) : restTime;
    const profile = { id, name: name.trim(), createdAt: todayKey(), restTime: rt };
    activeProfileId = id;
    const cw = {};
    DAYS.forEach(d => {
      const cfg = split[d];
      cw[d] = { label: cfg.label||"REST", sub: cfg.sub||"", exercises: cfg.training ? (wizardExercises[d]||[]).map(e=>({name:e.name,sets:parseInt(e.sets)||3,reps:e.reps||"10-12"})) : [] };
    });
    await store.set("custom-workouts", cw);
    await store.set("exercise-catalog", EXERCISE_CATALOG_DEFAULT);
    const allProfiles = [...profiles, profile];
    setShared("profiles", allProfiles);
    setShared("active-profile", id);
    onSelect(profile);
  }

  const inp = (extra) => ({width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"14px 16px",borderRadius:10,fontSize:16,fontFamily:T.font,outline:"none",...extra});
  const btnPrimary = (disabled) => ({width:"100%",padding:"16px",background:disabled?T.surface3:T.accentGradient,color:disabled?T.dim:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:disabled?"default":"pointer",fontFamily:T.font,boxShadow:disabled?"none":"0 4px 24px #FF9F0A40",marginTop:28});
  const wrap = {minHeight:"100vh",background:T.bg,fontFamily:T.font,color:T.text,display:"flex",flexDirection:"column",alignItems:"center",padding:"48px 24px 48px"};
  const inner = {width:"100%",maxWidth:420};

  if(!showWizard) return (
    <div style={wrap}>
      <style>{css}</style>
      <div style={inner}>
        <div style={{fontFamily:T.font,fontSize:34,fontWeight:800,letterSpacing:-0.6,lineHeight:1.05,marginBottom:4,color:T.text}}>Workout Log</div>
        <div style={{fontSize:13,color:T.dim,marginBottom:40}}>Choose your profile</div>
        {profiles.map(p=>(
          <div key={p.id} style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:14,padding:"20px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div onClick={()=>{setShared("active-profile",p.id);onSelect(p);}} style={{flex:1,cursor:"pointer"}}>
              <div style={{fontSize:20,fontWeight:700,marginBottom:4}}>{p.name}</div>
              <div style={{fontSize:12,color:T.dim}}>{p.restTime}s rest · {p.createdAt}</div>
            </div>
            {confirmDeleteId===p.id ? (
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:12,color:T.red,fontWeight:500}}>Delete?</span>
                <button onClick={()=>deleteProfile(p.id)} style={{padding:"6px 14px",background:T.red,color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Yes</button>
                <button onClick={()=>setConfirmDeleteId(null)} style={{padding:"6px 14px",background:T.surface2,border:`1px solid ${T.border}`,color:T.sub,borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:T.font}}>No</button>
              </div>
            ) : (
              <button onClick={()=>setConfirmDeleteId(p.id)} style={{background:"none",border:`1.5px solid ${T.red}33`,color:T.red,padding:"6px 12px",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:T.font,opacity:0.7}}>Delete</button>
            )}
          </div>
        ))}
        <button onClick={()=>{setShowWizard(true);setStep(1);setName("");setRestTime(90);setCustomRest("");}} style={{width:"100%",padding:"16px",background:"transparent",border:`1.5px dashed ${T.border2}`,color:T.sub,borderRadius:12,fontSize:14,cursor:"pointer",fontFamily:T.font,marginTop:8}}>+ Create New Profile</button>
      </div>
    </div>
  );

  return (
    <div style={wrap}>
      <style>{css}</style>
      <div style={inner}>
        <div style={{display:"flex",gap:6,marginBottom:40}}>
          {[1,2,3].map(s=><div key={s} style={{height:3,flex:1,background:s<=step?T.accentGradient:T.surface2,borderRadius:2,transition:"background .3s"}} />)}
        </div>

        {step===1&&(<>
          <div style={{fontSize:11,color:T.accent,fontWeight:600,letterSpacing:2,marginBottom:16}}>STEP 1 OF 3</div>
          <div style={{fontSize:34,fontWeight:800,letterSpacing:-1,lineHeight:1.1,marginBottom:8}}>What's your name?</div>
          <div style={{fontSize:14,color:T.dim,marginBottom:32}}>Used to switch between profiles</div>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoFocus style={inp()} />
          <div style={{marginTop:28}}>
            <div style={{fontSize:11,color:T.sub,fontWeight:600,letterSpacing:1,marginBottom:14}}>REST BETWEEN SETS</div>
            <div style={{display:"flex",gap:8}}>
              {[60,90,120].map(t=>(
                <button key={t} onClick={()=>{setRestTime(t);setCustomRest("");}} style={{flex:1,padding:"14px 0",background:restTime===t&&!customRest?T.accentDim:"transparent",border:`1.5px solid ${restTime===t&&!customRest?T.accent:T.border}`,color:restTime===t&&!customRest?T.accent:T.sub,borderRadius:10,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>{t}s</button>
              ))}
              <input type="number" inputMode="numeric" value={customRest} onChange={e=>{setCustomRest(e.target.value);if(e.target.value)setRestTime(parseInt(e.target.value)||90);}} placeholder="Own" style={{width:72,background:customRest?T.accentDim:T.surface,border:`1.5px solid ${customRest?T.accent:T.border}`,color:customRest?T.accent:T.sub,padding:"14px 8px",borderRadius:10,fontSize:14,fontFamily:T.font,outline:"none",textAlign:"center"}} />
            </div>
          </div>
          <button onClick={()=>setStep(2)} disabled={!name.trim()} style={btnPrimary(!name.trim())}>Next →</button>
          {profiles.length>0&&<button onClick={()=>setShowWizard(false)} style={{width:"100%",padding:"12px",background:"transparent",border:"none",color:T.dim,fontSize:13,cursor:"pointer",fontFamily:T.font,marginTop:8}}>← Back to profiles</button>}
        </>)}

        {step===2&&(<>
          <div style={{fontSize:11,color:T.accent,fontWeight:600,letterSpacing:2,marginBottom:16}}>STEP 2 OF 3</div>
          <div style={{fontSize:34,fontWeight:800,letterSpacing:-1,lineHeight:1.1,marginBottom:8}}>Your workout split</div>
          <div style={{fontSize:14,color:T.dim,marginBottom:28}}>Edit or keep the suggestion</div>
          {DAYS.map(d=>{
            const cfg=split[d];
            return (
              <div key={d} style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"14px 16px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:cfg.training?10:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:T.sub}}>{d}</div>
                  <button onClick={()=>setSplit(p=>({...p,[d]:{...p[d],training:!p[d].training}}))} style={{padding:"5px 14px",background:cfg.training?T.accentDim:T.surface2,border:`1.5px solid ${cfg.training?T.accent:T.border}`,color:cfg.training?T.accent:T.dim,borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>{cfg.training?"Training":"Rest"}</button>
                </div>
                {cfg.training&&(
                  <div style={{display:"flex",gap:8}}>
                    <input type="text" value={cfg.label} onChange={e=>setSplit(p=>({...p,[d]:{...p[d],label:e.target.value}}))} placeholder="Label" style={{flex:"0 0 100px",background:T.surface2,border:`1.5px solid ${T.border}`,color:T.text,padding:"8px 10px",borderRadius:8,fontSize:12,fontFamily:T.font,outline:"none",fontWeight:600}} />
                    <input type="text" value={cfg.sub} onChange={e=>setSplit(p=>({...p,[d]:{...p[d],sub:e.target.value}}))} placeholder="Description" style={{flex:1,background:T.surface2,border:`1.5px solid ${T.border}`,color:T.text,padding:"8px 10px",borderRadius:8,fontSize:12,fontFamily:T.font,outline:"none"}} />
                  </div>
                )}
              </div>
            );
          })}
          <div style={{display:"flex",gap:10,marginTop:24}}>
            <button onClick={()=>setStep(1)} style={{flex:1,padding:"14px",background:"transparent",border:`1.5px solid ${T.border}`,color:T.sub,borderRadius:12,fontSize:14,cursor:"pointer",fontFamily:T.font}}>← Back</button>
            <button onClick={()=>setStep(3)} style={{flex:2,padding:"14px",background:T.accentGradient,color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:T.font,boxShadow:"0 4px 24px #FF9F0A40"}}>Next →</button>
          </div>
        </>)}

        {step===3&&(<>
          <div style={{fontSize:11,color:T.accent,fontWeight:600,letterSpacing:2,marginBottom:16}}>STEP 3 OF 3</div>
          <div style={{fontSize:34,fontWeight:800,letterSpacing:-1,lineHeight:1.1,marginBottom:8}}>Add your exercises</div>
          <div style={{fontSize:14,color:T.dim,marginBottom:28}}>Optional — add more anytime in edit mode</div>
          {trainingDays.length===0&&<div style={{color:T.dim,fontSize:13,textAlign:"center",padding:"40px 0"}}>No training days configured</div>}
          {trainingDays.map(d=>{
            const cfg=split[d];
            const exList=wizardExercises[d]||[];
            return (
              <div key={d} style={{marginBottom:24}}>
                <div style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:10,letterSpacing:0.5}}>{d} — {cfg.label}</div>
                {exList.map((e,i)=>(
                  <div key={i} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:13,fontWeight:500}}>{e.name}</span>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:11,color:T.dim}}>{e.sets}×{e.reps}</span>
                      <button onClick={()=>removeWizardExercise(d,i)} style={{background:"none",border:"none",color:T.dim,cursor:"pointer",fontSize:14,padding:0}}>✕</button>
                    </div>
                  </div>
                ))}
                {addingExForDay===d ? (
                  <div style={{background:T.accentLight,border:`1.5px solid ${T.accent}`,borderRadius:10,padding:"12px",marginTop:4}}>
                    <div style={{marginBottom:8}}><ExercisePicker value={newExName} onChange={setNewExName} onSelect={n=>setNewExName(n)} catalog={EXERCISE_CATALOG_DEFAULT} placeholder="Search exercises..." /></div>
                    <div style={{display:"flex",gap:8,marginBottom:8}}>
                      <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,marginBottom:3}}>Sets</div><input type="number" inputMode="numeric" value={newExSets} onChange={e=>setNewExSets(e.target.value)} style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"7px",borderRadius:8,fontSize:13,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                      <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,marginBottom:3}}>Reps</div><input type="text" value={newExReps} onChange={e=>setNewExReps(e.target.value)} style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"7px",borderRadius:8,fontSize:13,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>addWizardExercise(d)} disabled={!newExName.trim()} style={{flex:1,padding:"9px",background:!newExName.trim()?T.surface3:T.accentGradient,color:!newExName.trim()?T.dim:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:!newExName.trim()?"default":"pointer",fontFamily:T.font}}>Add</button>
                      <button onClick={()=>{setAddingExForDay(null);setNewExName("");setNewExSets("3");setNewExReps("10-12");}} style={{flex:1,padding:"9px",background:T.surface,border:`1.5px solid ${T.border}`,color:T.dim,borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={()=>{setAddingExForDay(d);setNewExName("");setNewExSets("3");setNewExReps("10-12");}} style={{width:"100%",padding:"10px",background:"transparent",border:`1.5px dashed ${T.border2}`,color:T.sub,borderRadius:10,fontSize:12,cursor:"pointer",fontFamily:T.font,marginTop:4}}>+ Add exercise</button>
                )}
              </div>
            );
          })}
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button onClick={()=>setStep(2)} style={{flex:1,padding:"14px",background:"transparent",border:`1.5px solid ${T.border}`,color:T.sub,borderRadius:12,fontSize:14,cursor:"pointer",fontFamily:T.font}}>← Back</button>
            <button onClick={finishWizard} style={{flex:2,padding:"14px",background:T.accentGradient,color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:T.font,boxShadow:"0 4px 24px #FF9F0A40"}}>Finish ✓</button>
          </div>
        </>)}
      </div>
    </div>
  );
}

function ProfileRestEdit({profile, onSave, T}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(profile.restTime||90));
  if(!editing) return (
    <button onClick={()=>setEditing(true)} style={{background:"none",border:"1.5px solid "+T.border,color:T.sub,padding:"12px 0",borderRadius:10,fontSize:15,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Edit Rest Timer ({profile.restTime||90}s)</button>
  );
  return (
    <div style={{display:"flex",gap:8}}>
      <input type="number" value={val} onChange={e=>setVal(e.target.value)} style={{flex:1,background:T.surface2,border:"1.5px solid "+T.accent,color:T.text,padding:"10px 14px",borderRadius:10,fontSize:15,fontFamily:T.font,outline:"none"}} />
      <button onClick={()=>{const t=Math.max(10,parseInt(val)||90);const updated={...profile,restTime:t};const profiles=(getShared("profiles")||[]).map(p=>p.id===profile.id?updated:p);setShared("profiles",profiles);onSave(updated);setEditing(false);}} style={{background:T.accentGradient,border:"none",color:"#fff",padding:"10px 18px",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Save</button>
    </div>
  );
}

function WorkoutLog({profile, onLogout, onProfileUpdated}) {
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState(autoDay());
  const [view, setView] = useState("log");
  const [sets, setSets] = useState({});
  const [done, setDone] = useState({});
  const [exerciseOrder, setExerciseOrder] = useState(null);
  const [activeEx, setActiveEx] = useState(null);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [tempoSlow, setTempoSlow] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [selectedDiff, setSelectedDiff] = useState("just_right");
  const [history, setHistory] = useState({});
  const [customExercises, setCustomExercises] = useState([]);
  const [showAddEx, setShowAddEx] = useState(false);
  const [newExName, setNewExName] = useState("");
  const [newExSets, setNewExSets] = useState("3");
  const [newExReps, setNewExReps] = useState("10-12");
  const [newExCategory, setNewExCategory] = useState("Other");
  const [newTemplateCategory, setNewTemplateCategory] = useState("Other");
  const [reordering, setReordering] = useState(false);
  const [toast, setToast] = useState(null);
  const [timerStart, setTimerStart] = useState(null);
  const [timerDuration, setTimerDuration] = useState(0);
  const [timerMinimized, setTimerMinimized] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [dayPickerOpen, setDayPickerOpen] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showStaleDraftModal, setShowStaleDraftModal] = useState(false);
  const [finishEnergy, setFinishEnergy] = useState(0);
  const [finishSleep, setFinishSleep] = useState(0);
  const [finishWeight, setFinishWeight] = useState("");
  const [finishNotes, setFinishNotes] = useState("");
  const [sheetsUrl] = useState(SHEETS_URL);
  const [sheetsSyncStatus, setSheetsSyncStatus] = useState(null);
  const [wakeLockOn, setWakeLockOn] = useState(false);
  const wakeLockRef = useRef(null);
  const [customWorkouts, setCustomWorkouts] = useState(null);
  const [editExIdx, setEditExIdx] = useState(null);
  const [editExName, setEditExName] = useState("");
  const [editExSets, setEditExSets] = useState("");
  const [editExReps, setEditExReps] = useState("");
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateSets, setNewTemplateSets] = useState("3");
  const [newTemplateReps, setNewTemplateReps] = useState("10-12");
  const [editLabel, setEditLabel] = useState("");
  const [editSub, setEditSub] = useState("");
  const [editingMeta, setEditingMeta] = useState(false);
  const [renames, setRenames] = useState({});
  const [renamingEx, setRenamingEx] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [editingTarget, setEditingTarget] = useState(null);
  const [editTargetSets, setEditTargetSets] = useState("");
  const [editTargetReps, setEditTargetReps] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [exerciseCatalog, setExerciseCatalog] = useState([]);
  const [ignoreTodayCompletion, setIgnoreTodayCompletion] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [activeSessionProgram, setActiveSessionProgram] = useState(null); // {programId, workoutIdx} | null
  const [showProgramManager, setShowProgramManager] = useState(false);
  const [exerciseNotes, setExerciseNotes] = useState({});
  // note-overrides: persists per-profile across sessions, takes precedence over program ex.note
  const [noteOverrides, setNoteOverrides] = useState({});
  const [controlFocus, setControlFocus] = useState({});
  const [editingNote, setEditingNote] = useState(null); // exercise name currently being edited
  const [noteEditValue, setNoteEditValue] = useState("");
  const [otherDayDrafts, setOtherDayDrafts] = useState([]); // [{day, dateLabel}] unsaved drafts on other days
  const [dismissedDrafts, setDismissedDrafts] = useState(false);
  const [draftsRefresh, setDraftsRefresh] = useState(0);
  const [discardConfirmDay, setDiscardConfirmDay] = useState(null);
  const [todaySupersets, setTodaySupersets] = useState([]);
  const [showSupersetCreator, setShowSupersetCreator] = useState(false);
  const [ssSelection, setSsSelection] = useState([]);
  // FIX: only reset default reps when the name crosses the cardio/strength boundary.
  // The old effect ran on every keystroke and clobbered a rep range you'd already typed.
  const wasCardioRef = useRef(false);
  useEffect(() => { const c = isCardio(newExName.trim()); if(c !== wasCardioRef.current) { wasCardioRef.current = c; setNewExReps(c ? "30" : "10-12"); } }, [newExName, exerciseCatalog]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [confirmDeleteProfile, setConfirmDeleteProfile] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(0);
  const [showPlanEditor, setShowPlanEditor] = useState(false);
  const [planEditorText, setPlanEditorText] = useState("");
  const repsRef = useRef(null);
  const weightRef = useRef(null);
  const timerHiddenRef = useRef(false);
  const newExRef = useRef(null);
  const renameRef = useRef(null);
  const addExFormRef = useRef(null);
  const exRefs = useRef({});
  const dayCache = useRef({});
  const aiImportRef = useRef(null);

  useEffect(() => { (async () => {
    const [histRaw,s,d,cex,order,rn,cw,cat,wst,progs,enotes,nover,cfoc] = await Promise.all([store.get("iron-history"),store.get(`sets-${day}-draft`),store.get(`done-${day}-draft`),store.get(`custom-ex-${day}-draft`),store.get(`order-${day}`),store.get(`renames-${day}-draft`),store.get('custom-workouts'),store.get('exercise-catalog'),store.get(`workout-start-${day}-draft`),store.get('custom-programs'),store.get(`notes-${day}-draft`),store.get('note-overrides'),store.get('control-focus')]);
    // FIX: normalize legacy locale-string dates in history before anything reads it
    let hist = histRaw;
    if(hist) {
      const normRes = normalizeHistory(hist);
      hist = normRes.hist;
      if(normRes.changed) await store.set("iron-history", hist);
    }
    let _s=s,_d=d,_cex=cex,_rn=rn,_wst=wst,_enotes=enotes;
    // Migrate old date-suffixed draft keys if no current draft exists
    if(!_s||!Object.keys(_s).length){
      for(let i=1;i<=7;i++){const pd=localDateKey(Date.now()-i*86400000);if(hist&&hist[`${pd}-${day}`])continue;const [ps,pd2,pcex,prn,pwst,pen]=await Promise.all([store.get(`sets-${day}-${pd}`),store.get(`done-${day}-${pd}`),store.get(`custom-ex-${day}-${pd}`),store.get(`renames-${day}-${pd}`),store.get(`workout-start-${day}-${pd}`),store.get(`notes-${day}-${pd}`)]);if(ps&&Object.keys(ps).length){_s=ps;_d=pd2;_cex=pcex;_rn=prn;_wst=pwst||new Date(pd+"T10:00:00").getTime();_enotes=pen;await Promise.all([store.set(`sets-${day}-draft`,ps),store.set(`done-${day}-draft`,pd2||{}),store.set(`custom-ex-${day}-draft`,pcex||[]),store.set(`renames-${day}-draft`,prn||{}),store.set(`workout-start-${day}-draft`,_wst),store.set(`notes-${day}-draft`,pen||{})]);break;}}
    }
    if(hist)setHistory(hist); if(_s)setSets(_s); if(_d)setDone(_d); if(_cex)setCustomExercises(_cex); if(order)setExerciseOrder(order); if(_rn)setRenames(_rn); if(cw)setCustomWorkouts(cw); if(_wst)setWorkoutStartTime(_wst); if(progs)setPrograms(progs); if(_enotes)setExerciseNotes(_enotes); if(nover)setNoteOverrides(nover); if(cfoc)setControlFocus(cfoc);
    // Show blocking modal if current day has a stale draft
    if(_wst && _s && Object.keys(_s).length > 0 && localDateKey(_wst) !== todayKey()) {
      setShowStaleDraftModal(true);
    }
    if(cat){const stored=new Set(cat.map(e=>e.name.toLowerCase()));const merged=[...cat,...EXERCISE_CATALOG_DEFAULT.filter(e=>!stored.has(e.name.toLowerCase()))];setExerciseCatalog(merged);if(merged.length>cat.length)await store.set('exercise-catalog',merged);}else{setExerciseCatalog(EXERCISE_CATALOG_DEFAULT);await store.set('exercise-catalog',EXERCISE_CATALOG_DEFAULT);}
    // Scan other days for unsaved drafts; also migrate old date-suffixed keys for those days
    const otherDays=DAYS.filter(d=>d!==day);
    const draftChecks=await Promise.all(otherDays.map(async d=>{
      let ds=await store.get(`sets-${d}-draft`);
      let dwst=await store.get(`workout-start-${d}-draft`);
      // Fall back to old date-suffixed keys if draft slot is empty
      if(!ds||!Object.keys(ds).length){
        for(let i=1;i<=7;i++){const pd=localDateKey(Date.now()-i*86400000);if(hist&&hist[`${pd}-${d}`])continue;const pds=await store.get(`sets-${d}-${pd}`);if(pds&&Object.keys(pds).length){ds=pds;dwst=await store.get(`workout-start-${d}-${pd}`)||new Date(pd+"T10:00:00").getTime();await Promise.all([store.set(`sets-${d}-draft`,pds),store.set(`workout-start-${d}-draft`,dwst)]);break;}}
      }
      if(!ds||!Object.keys(ds).length)return null;
      const draftDate=dwst?localDateKey(dwst):null;
      if(draftDate&&hist&&hist[`${draftDate}-${d}`])return null;
      const dl=dwst?new Date(dwst).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}):d;
      return {day:d,dateLabel:dl};
    }));
    const found=draftChecks.filter(Boolean);
    if(found.length)setOtherDayDrafts(found);
    // FIX: prune legacy date-suffixed draft keys older than 10 days. These piled up
    // forever (400+ dead keys observed). Set-drafts holding data NOT in history are kept.
    try {
      const prefix = "wl_" + activeProfileId + "_";
      const patt = /^(sets|done|custom-ex|renames|notes|workout-start)-(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)-(\d{4}-\d{2}-\d{2})$/;
      const cutoff = localDateKey(Date.now() - 10*86400000);
      const kill = [];
      for(let i=0;i<localStorage.length;i++){
        const key = localStorage.key(i);
        if(!key || !key.startsWith(prefix)) continue;
        const m = patt.exec(key.slice(prefix.length));
        if(!m || m[3] >= cutoff) continue;
        if(m[1] === "sets") {
          let v = null; try { v = JSON.parse(localStorage.getItem(key)); } catch(e) {}
          if(v && Object.keys(v).length > 0 && !(hist && hist[`${m[3]}-${m[2]}`])) continue; // unsaved data — keep
        }
        kill.push(key);
      }
      kill.forEach(k => localStorage.removeItem(k));
    } catch(e) {}
    setLoading(false);
  })(); }, []);

  useEffect(() => {
    async function acquireWakeLock() {
      try {
        if('wakeLock' in navigator) wakeLockRef.current = await navigator.wakeLock.request('screen');
      } catch(e) {}
    }
    function releaseWakeLock() {
      if(wakeLockRef.current) { wakeLockRef.current.release().catch(()=>{}); wakeLockRef.current = null; }
    }
    if(wakeLockOn) {
      acquireWakeLock();
      const onVis = () => { if(document.visibilityState === 'visible') acquireWakeLock(); };
      document.addEventListener('visibilitychange', onVis);
      return () => { document.removeEventListener('visibilitychange', onVis); releaseWakeLock(); };
    } else {
      releaseWakeLock();
    }
  }, [wakeLockOn]);

  useEffect(() => {
    try { screen.orientation.lock('portrait').catch(()=>{}); } catch(e) {}
  }, []);

  useEffect(() => {
    if(activeEx && exRefs.current[activeEx]) exRefs.current[activeEx].scrollIntoView({behavior:"smooth",block:"center"});
    if(activeEx && editIdx===null) setTimeout(() => { repsRef.current?.focus(); repsRef.current?.select(); }, 100);
  }, [activeEx]);

  function getDisplayName(ex) { return renames[ex.name] || ex.name; }

  function getWeightBump(exName) {
    var n = exName.toLowerCase();
    if (["leg press","machine chest","machine shoulder","lat pulldown","seated cable row"].some(function(c) { return n.includes(c); })) return 10;
    if (["pushdown","extension","curl machine","pec deck","leg ext","leg curl","calf"].some(function(c) { return n.includes(c); })) return 5;
    return 2.5;
  }

  function suggestWeight(exName, lastWeight, lastDiff) {
    if (controlFocus[exName]) return null;
    var w = parseFloat(lastWeight) || 0;
    if (!w) return null;
    var bump = getWeightBump(exName);
    if (lastDiff === "easy") return {weight: w + bump, reason: "Had more — add a rep or slow it down first; bump only if form held"};
    var allHistSets = [];
    Object.values(history).forEach(function(e) { var s = e.sets ? e.sets[exName] : null; if (s) s.forEach(function(x) { allHistSets.push(x); }); });
    var justRight = allHistSets.filter(function(s) { return s.diff === "just_right"; });
    if (justRight.length >= 3) {
      var avgW = justRight.reduce(function(a, s) { return a + (parseFloat(s.weight) || 0); }, 0) / justRight.length;
      if (Math.abs(avgW - w) > bump) return {weight: Math.round(avgW / bump) * bump, reason: Math.round(avgW) + "lb is your usual here"};
    }
    return null;
  }

  function getSessionTarget(exName) {
    var sameDayHist = Object.values(history).filter(function(e) { return e.day === day; }).sort(function(a,b) { return new Date(b.date) - new Date(a.date); });
    if (!sameDayHist.length) return null;
    var lastSets = sameDayHist[0].sets ? sameDayHist[0].sets[exName] : null;
    if (!lastSets || !lastSets.length) return null;
    var exData = getAllExercises().find(function(e) { return e.name === exName; });
    if (!exData) return null;
    var repRange = exData.reps.split("-");
    var repMin = parseInt(repRange[0]) || 8;
    var repMax = parseInt(repRange[1] || repRange[0]) || 15;
    var diffs = lastSets.map(function(s) { return s.diff || "just_right"; });
    var lastW = parseFloat(lastSets[0].weight) || 0;
    var lastAvgReps = Math.round(lastSets.reduce(function(a,s) { return a + (parseInt(s.reps)||0); }, 0) / lastSets.length);
    var bump = getWeightBump(exName);
    var allEasy = diffs.every(function(d) { return d === "easy"; });
    var allJR = diffs.every(function(d) { return d === "just_right"; });
    var anyHard = diffs.some(function(d) { return d === "hard"; });
    if (controlFocus[exName]) {
      if (allEasy) return {weight: lastW, reps: Math.min(lastAvgReps + 1, repMax), note: "Hold weight — +1 rep, full depth, 3s eccentric"};
      return {weight: lastW, reps: lastAvgReps, note: "Hold weight — same reps, slower & deeper"};
    }
    if (allEasy) return {weight: lastW + bump, reps: lastAvgReps, note: "Felt easy — earn +" + bump + "lb with clean reps"};
    if (allJR && lastAvgReps >= repMax) return {weight: lastW + bump, reps: repMin, note: "Owned the top of the range — small bump"};
    if (allJR) return {weight: lastW, reps: Math.min(lastAvgReps + 1, repMax), note: "Hold weight — +1 rep, tighten the tempo"};
    if (anyHard) return {weight: lastW, reps: lastAvgReps, note: "Stay here — clean up all reps before adding"};
    return {weight: lastW, reps: lastAvgReps, note: "Repeat — focus on execution"};
  }

  useEffect(() => {
    if (timerStart || workoutStartTime) {
      var id = setInterval(function() { setNow(Date.now()); }, 1000);
      return function() { clearInterval(id); };
    }
  }, [timerStart, workoutStartTime]);

  useEffect(() => {
    function onVis() {
      if (document.visibilityState === 'hidden') timerHiddenRef.current = true;
    }
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  var timerElapsed = timerStart ? Math.floor((now - timerStart) / 1000) : 0;
  var timerRemaining = timerStart ? Math.max(0, timerDuration - timerElapsed) : 0;
  var timerPct = timerDuration > 0 ? Math.min(100, (timerElapsed / timerDuration) * 100) : 0;
  var timerActive = timerStart !== null && timerRemaining > 0;
  var timerDone = timerStart !== null && timerRemaining <= 0;

  useEffect(() => {
    if (timerDone && timerStart) {
      playRestBeep();
      showToast("REST DONE — GO");
      setTimerStart(null);
      setTimerMinimized(false);
      if (!timerHiddenRef.current) {
        setTimeout(() => { repsRef.current?.focus(); repsRef.current?.select(); }, 200);
      }
    }
  }, [timerDone]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2400); }

  function playRestBeep() {
    try {
      const ctx = ensureAudioCtx();
      if(!ctx) return;
      const beep = (freq, start, dur) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g); g.connect(ctx.destination);
        osc.type = "sine"; osc.frequency.value = freq;
        g.gain.setValueAtTime(0, ctx.currentTime + start);
        g.gain.linearRampToValueAtTime(0.35, ctx.currentTime + start + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur + 0.05);
      };
      beep(880, 0, 0.12);
      beep(1046, 0.16, 0.20);
    } catch(e) {}
  }
  function getWorkout(d) { if(!d&&activeSessionProgram){const prog=programs.find(p=>p.id===activeSessionProgram.programId);if(prog&&prog.workouts[activeSessionProgram.workoutIdx])return prog.workouts[activeSessionProgram.workoutIdx];} var dd=d||day; var cw=customWorkouts||{}; return cw[dd]||DEFAULT_WORKOUTS[dd]||{label:'REST',sub:'',exercises:[]}; }
  async function savePrograms(updated){setPrograms(updated);await store.set('custom-programs',updated);}
  function getSupersets(){const base=(getWorkout().supersets)||[];const merged=[...base];todaySupersets.forEach(g=>{if(!merged.some(b=>b.length===g.length&&b.every((n,i)=>n===g[i])))merged.push(g);});return merged;}
  function getSupersetFor(exName){return getSupersets().find(g=>g.includes(exName))||null;}
  async function saveSupersets(dayName,ss){const cw=Object.assign({},customWorkouts||{});const base=cw[dayName]||DEFAULT_WORKOUTS[dayName]||{label:'REST',sub:'',exercises:[]};cw[dayName]={...base,supersets:ss};setCustomWorkouts(cw);await store.set('custom-workouts',cw);}
  function getBaseExercises() { return getWorkout().exercises || []; }
  function getAllExercises() { const all=[...getBaseExercises(),...customExercises]; if(exerciseOrder?.length){const map={};all.forEach(e=>{map[e.name]=e;});const ord=[];exerciseOrder.forEach(n=>{if(map[n]){ord.push(map[n]);delete map[n];}});Object.values(map).forEach(e=>ord.push(e));return ord;} return all; }
  async function saveOrder(list) { const n=list.map(e=>e.name); setExerciseOrder(n); await store.set(`order-${day}`,n); }
  async function moveExercise(idx,dir) { const all=getAllExercises(); const ni=idx+dir; if(ni<0||ni>=all.length)return; const a=[...all]; [a[idx],a[ni]]=[a[ni],a[idx]]; await saveOrder(a); }

  async function switchDay(d) {
    setDayPickerOpen(false);
    if(d===day) return;
    dayCache.current[day] = {sets:sets,done:done,customExercises:customExercises,exerciseOrder:exerciseOrder,renames:renames,exerciseNotes:exerciseNotes};
    store.set(`sets-${day}-draft`,sets);store.set(`done-${day}-draft`,done);store.set(`custom-ex-${day}-draft`,customExercises);store.set(`renames-${day}-draft`,renames);store.set(`notes-${day}-draft`,exerciseNotes);
    setDay(d);setActiveEx(null);setWeight("");setReps("");setEditIdx(null);if(view!=="edit")setView("log");setReordering(false);setRenamingEx(null);setSuggestion(null);setIgnoreTodayCompletion(false);setEditExIdx(null);setEditingMeta(false);setShowAddTemplate(false);setExerciseNotes({});
    var cached = dayCache.current[d];
    if(cached){setSets(cached.sets||{});setDone(cached.done||{});setCustomExercises(cached.customExercises||[]);setExerciseOrder(cached.exerciseOrder);setRenames(cached.renames||{});setExerciseNotes(cached.exerciseNotes||{});}
    else{const[s,dn,cex,order,rn,en]=await Promise.all([store.get(`sets-${d}-draft`),store.get(`done-${d}-draft`),store.get(`custom-ex-${d}-draft`),store.get(`order-${d}`),store.get(`renames-${d}-draft`),store.get(`notes-${d}-draft`)]);setSets(s||{});setDone(dn||{});setCustomExercises(cex||[]);setExerciseOrder(order);setRenames(rn||{});setExerciseNotes(en||{});}
  }

  function findLastExercise(n) { for(const e of Object.values(history).sort((a,b)=>new Date(b.date)-new Date(a.date))){const s=e.sets?.[n];if(s?.length)return s[s.length-1];} return null; }
  function findPR(n) { var best=null; for(const e of Object.values(history)){const sts=e.sets?.[n];if(!sts?.length)continue;for(const s of sts){const w=parseFloat(s.weight);if(!w)continue;if(!best||w>best.weight||(w===best.weight&&parseInt(s.reps)>parseInt(best.reps))){best={weight:w,reps:s.reps,date:e.dateLabel||e.date};}}} return best; }
  function findRecentSessions(exName, limit=3) {
    return Object.values(history)
      .filter(e=>e.sets?.[exName]?.length)
      .sort((a,b)=>new Date(b.date)-new Date(a.date))
      .slice(0,limit)
      .map(e=>({date:e.date,dateLabel:e.dateLabel,sets:e.sets[exName]}));
  }
  function detectPlateau(exName) {
    const sameDayHist=Object.values(history).filter(e=>e.day===day&&e.sets?.[exName]?.length).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3);
    if(sameDayHist.length<3)return null;
    const maxWeights=sameDayHist.map(e=>Math.max(...e.sets[exName].map(s=>parseFloat(s.weight)||0)));
    const totalReps=sameDayHist.map(e=>e.sets[exName].reduce((sum,s)=>sum+(parseInt(s.reps)||0),0));
    if(Math.max(...maxWeights)-Math.min(...maxWeights)>2.5)return null;
    if(totalReps[0]>totalReps[2])return null;
    const allDiffs=sameDayHist.flatMap(e=>e.sets[exName].map(s=>s.diff).filter(Boolean));
    if(!allDiffs.length)return null;
    if(allDiffs.every(d=>d==="easy"))return null;
    return {sessions:sameDayHist.length,weight:maxWeights[0]};
  }

  function openExercise(ex) { if(activeEx===ex){setActiveEx(null);setWeight("");setReps("");setEditIdx(null);setSuggestion(null);return;} setActiveEx(ex);setEditIdx(null);setSuggestion(null);
    const xs=sets[ex]||[]; if(xs.length){const l=xs[xs.length-1];setWeight(l.weight);setReps(l.reps);var sg=suggestWeight(ex,l.weight,l.diff);if(sg)setSuggestion(sg);} else{const l=findLastExercise(ex);if(l){setWeight(l.weight);setReps(l.reps);var sg2=suggestWeight(ex,l.weight,l.diff);if(sg2)setSuggestion(sg2);}else{setWeight("");setReps("");}}
    setSelectedDiff("just_right"); setTempoSlow(!!controlFocus[ex]); }

  async function addOrUpdateSet() {
    ensureAudioCtx(); // unlock audio inside a user gesture so the rest-done beep works on iOS
    const cardio=isCardio(activeEx);
    if(!activeEx||!reps||(!cardio&&!weight)) return;
    let updated;
    if(editIdx!==null){const a=[...(sets[activeEx]||[])];a[editIdx]={...a[editIdx],weight:cardio?"0":String(weight),reps:String(reps),diff:cardio?"just_right":selectedDiff,tempo:(!cardio&&tempoSlow)?true:undefined};updated={...sets,[activeEx]:a};setEditIdx(null);showToast("Updated");}
    else{
      if(!workoutStartTime){const t=Date.now();setWorkoutStartTime(t);await store.set(`workout-start-${day}-draft`,t);}
      const entry={weight:cardio?"0":String(weight),reps:String(reps),diff:cardio?"just_right":selectedDiff,tempo:(!cardio&&tempoSlow)?true:undefined};updated={...sets,[activeEx]:[...(sets[activeEx]||[]),entry]};showToast("Logged");}
    setSets(updated); await store.set(`sets-${day}-draft`,updated);
    var exData=getAllExercises().find(e=>e.name===activeEx);
    var loggedNow=(updated[activeEx]||[]).length;
    if(exData&&loggedNow>=exData.sets&&editIdx===null){var ud={...done,[activeEx]:true};setDone(ud);await store.set(`done-${day}-draft`,ud);}
    var ssGroup=getSupersetFor(activeEx);
    var _advInSS=false;
    if(!cardio&&editIdx===null&&exData){
      if(ssGroup){
        var ssIdx=ssGroup.indexOf(activeEx);var nextInSS=ssIdx<ssGroup.length-1?ssGroup[ssIdx+1]:null;
        if(nextInSS){_advInSS=true;setTimeout(()=>openExercise(nextInSS),300);}
        else{var tn=Date.now();setNow(tn);timerHiddenRef.current=false;setTimerStart(tn);setTimerDuration(profile.restTime||90);setTimerMinimized(false);}
      }else{var tn2=Date.now();setNow(tn2);timerHiddenRef.current=false;setTimerStart(tn2);setTimerDuration(profile.restTime||90);setTimerMinimized(false);}
    }
    setSelectedDiff("just_right");
    var sg=suggestWeight(activeEx,weight,selectedDiff);if(sg&&editIdx===null&&!cardio){setSuggestion(sg);}else{setSuggestion(null);}
    setTimeout(() => {repsRef.current?.focus();repsRef.current?.select();},60);
    if(!_advInSS&&exData&&loggedNow>=exData.sets&&editIdx===null){var allE=getAllExercises();var nxt=allE.find(e=>!done[e.name]&&(sets[e.name]||[]).length<e.sets&&e.name!==activeEx);if(nxt)setTimeout(()=>openExercise(nxt.name),400);}
  }

  function startEditSet(ex,i){setActiveEx(ex);setEditIdx(i);const s=sets[ex][i];setWeight(s.weight);setReps(s.reps);setSelectedDiff(s.diff||"just_right");setTimeout(()=>{repsRef.current?.focus();repsRef.current?.select();},80);}
  async function removeSet(ex,i){const a=(sets[ex]||[]).filter((_,idx)=>idx!==i);const u={...sets};if(a.length)u[ex]=a;else delete u[ex];setSets(u);if(editIdx===i)setEditIdx(null);await store.set(`sets-${day}-draft`,u);}
  async function toggleDone(ex){const u={...done,[ex]:!done[ex]};setDone(u);await store.set(`done-${day}-draft`,u);}
  function isCardio(name) {
    if(!name) return false;
    const n = name.toLowerCase();
    return exerciseCatalog.some(e => e.name.toLowerCase() === n && e.category === "Cardio");
  }

  async function addToCatalog(name, category) {
    if(!name.trim()) return;
    const exists = exerciseCatalog.some(e => e.name.toLowerCase() === name.trim().toLowerCase());
    if(!exists) {
      const updated = [...exerciseCatalog, {name: name.trim(), category: category || "Other"}];
      setExerciseCatalog(updated);
      await store.set('exercise-catalog', updated);
    }
  }

  async function addCustomExercise(){if(!newExName.trim())return;const _cardio=isCardio(newExName.trim());const ex={name:newExName.trim(),sets:_cardio?1:(parseInt(newExSets)||3),reps:newExReps||(_cardio?"30":"10-12"),custom:true};const upd=[...customExercises,ex];setCustomExercises(upd);await store.set(`custom-ex-${day}-draft`,upd);await saveOrder([...getAllExercises(),ex]);addToCatalog(newExName.trim(),_cardio?"Cardio":newExCategory);setNewExName("");setNewExSets("3");setNewExReps("10-12");setNewExCategory("Other");setShowAddEx(false);showToast("Added");}
  async function removeCustomExercise(idx){const ex=customExercises[idx];const upd=customExercises.filter((_,i)=>i!==idx);setCustomExercises(upd);await store.set(`custom-ex-${day}-draft`,upd);if(sets[ex.name]){const u={...sets};delete u[ex.name];setSets(u);await store.set(`sets-${day}-draft`,u);}await saveOrder(getAllExercises().filter(e=>e.name!==ex.name));}

  async function renameExercise(origName,newName){
    if(!newName.trim()||newName===origName){setRenamingEx(null);return;}
    var u={...renames,[origName]:newName.trim()};setRenames(u);await store.set(`renames-${day}-draft`,u);setRenamingEx(null);showToast("Renamed");
  }

  function openPlanEditor() {
    const plan = {};
    DAYS.forEach(d => { plan[d] = getWorkout(d); });
    setPlanEditorText(JSON.stringify(plan, null, 2));
    setShowPlanEditor(true);
    setShowProfileModal(false);
  }
  async function savePlanJson() {
    try {
      const plan = JSON.parse(planEditorText);
      const cw = {};
      DAYS.forEach(d => { if (plan[d] && Array.isArray(plan[d].exercises)) cw[d] = plan[d]; });
      setCustomWorkouts(Object.keys(cw).length ? cw : null);
      await store.set('custom-workouts', Object.keys(cw).length ? cw : null);
      setShowPlanEditor(false);
      showToast("Plan updated");
    } catch(e) { showToast("Invalid JSON"); }
  }
  async function saveTemplate(dayName, updatedExercises) {
    var cw = Object.assign({}, customWorkouts || {});
    var base = DEFAULT_WORKOUTS[dayName] || {label:"CUSTOM",sub:""};
    var existing = cw[dayName] || base;
    cw[dayName] = {label:existing.label, sub:existing.sub, exercises:updatedExercises};
    setCustomWorkouts(cw);
    await store.set('custom-workouts', cw);
  }
  async function saveDayMeta(dayName, label, sub) {
    var cw = Object.assign({}, customWorkouts || {});
    var existing = cw[dayName] || DEFAULT_WORKOUTS[dayName] || {label:"CUSTOM",sub:"",exercises:[]};
    cw[dayName] = {label:label, sub:sub, exercises:existing.exercises || []};
    setCustomWorkouts(cw);
    await store.set('custom-workouts', cw);
    setEditingMeta(false);
    showToast("Updated");
  }
  async function toggleRestDay(dayName) {
    var cw = Object.assign({}, customWorkouts || {});
    var existing = cw[dayName] || DEFAULT_WORKOUTS[dayName] || {label:"REST",sub:"",exercises:[]};
    var isRest = (existing.exercises || []).length === 0;
    if (isRest) {
      cw[dayName] = {label:"TRAIN", sub:"Custom", exercises:[{name:"New Exercise",sets:3,reps:"10-12"}]};
    } else {
      cw[dayName] = {label:"REST", sub:"Recovery", exercises:[]};
    }
    setCustomWorkouts(cw);
    await store.set('custom-workouts', cw);
    showToast(isRest ? "Set as training day" : "Set as rest day");
  }
  async function addTemplateExercise(dayName, name, sets, repRange) {
    var current = (getWorkout(dayName).exercises || []).slice();
    current.push({name:name, sets:parseInt(sets)||3, reps:repRange||"10-12"});
    await saveTemplate(dayName, current);
    showToast("Added to template");
  }
  async function removeTemplateExercise(dayName, idx) {
    var current = (getWorkout(dayName).exercises || []).slice();
    current.splice(idx, 1);
    await saveTemplate(dayName, current);
    showToast("Removed");
  }
  async function saveExerciseTarget(exName, newSets, newReps) {
    const baseList = getBaseExercises();
    const baseIdx = baseList.findIndex(e => e.name === exName);
    if(baseIdx >= 0) {
      var current = (getWorkout(day).exercises || []).slice();
      current[baseIdx] = {name:exName, sets:parseInt(newSets)||3, reps:newReps||(isCardio(exName)?"30":"10-12")};
      await saveTemplate(day, current);
    } else {
      const customIdx = customExercises.findIndex(e => e.name === exName);
      if(customIdx >= 0) {
        const upd = customExercises.map((e,i) => i===customIdx ? {...e, sets:isCardio(exName)?1:(parseInt(newSets)||3), reps:newReps||(isCardio(exName)?"30":"10-12")} : e);
        setCustomExercises(upd);
        await store.set(`custom-ex-${day}-draft`, upd);
      }
    }
    setEditingTarget(null);
    showToast("Target updated");
  }
  async function saveNoteOverride(exName, value) {
    const trimmed = value.trim();
    const orig = getBaseExercises().find(e => e.name === exName)?.note || "";
    const updated = {...noteOverrides};
    if (!trimmed || trimmed === orig) { delete updated[exName]; } else { updated[exName] = trimmed; }
    setNoteOverrides(updated);
    setEditingNote(null);
    await store.set('note-overrides', updated);
  }
  async function toggleControlFocus(exName) {
    const updated = {...controlFocus};
    if (updated[exName]) { delete updated[exName]; } else { updated[exName] = true; }
    setControlFocus(updated);
    await store.set('control-focus', updated);
    showToast(updated[exName] ? "Control focus on — quality over plates" : "Control focus off");
  }
  async function saveNoteToProgram(exName, value) {
    const trimmed = value.trim();
    const baseList = getBaseExercises();
    const baseIdx = baseList.findIndex(e => e.name === exName);
    if (baseIdx >= 0) {
      const current = (getWorkout(day).exercises || []).slice();
      current[baseIdx] = {...current[baseIdx], note: trimmed || undefined};
      await saveTemplate(day, current);
    }
    const updated = {...noteOverrides};
    delete updated[exName];
    setNoteOverrides(updated);
    await store.set('note-overrides', updated);
    setEditingNote(null);
    showToast("Saved to program");
  }
  async function updateTemplateExercise(dayName, idx, name, sets, repRange) {
    var current = (getWorkout(dayName).exercises || []).slice();
    current[idx] = {name:name, sets:parseInt(sets)||3, reps:repRange||"10-12"};
    await saveTemplate(dayName, current);
    setEditExIdx(null);
    showToast("Updated");
  }
  async function resetTemplate(dayName) {
    var cw = Object.assign({}, customWorkouts || {});
    delete cw[dayName];
    setCustomWorkouts(Object.keys(cw).length ? cw : null);
    await store.set('custom-workouts', Object.keys(cw).length ? cw : null);
    showToast("Reset to default");
  }
  function downloadTemplateForAI() {
    const exercises = getWorkout(day).exercises || [];
    const dayHistory = Object.values(history).filter(e=>e.day===day).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6).map(session=>({date:session.dateLabel||session.date,exercises:Object.entries(session.sets||{}).map(([name,sts])=>({name,sets:sts.map(s=>({weight:s.weight,reps:s.reps,difficulty:s.diff||"just_right"}))}))}));
    const data={_instructions:"You are a fitness coach. Review the exercises, their current targets, and recent session history. Return ONLY valid JSON in the _responseFormat — no extra text. Adjust sets/reps based on performance and difficulty ratings (easy=increase, hard=decrease/maintain).",_responseFormat:{exercises:[{name:"Exercise Name",sets:3,reps:"10-12",note:"optional note"}]},day,label:getWorkout(day).label,currentTemplate:exercises.map(e=>({name:e.name,sets:e.sets,reps:e.reps})),recentHistory:dayHistory};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`${day.toLowerCase()}-template-for-ai.json`;a.click();URL.revokeObjectURL(url);
  }
  async function importAITemplate(file) {
    try {
      const text=await file.text();
      const data=JSON.parse(text);
      const updates=data.exercises;
      if(!updates||!Array.isArray(updates)){showToast("Invalid format");return;}
      const current=(getWorkout(day).exercises||[]).slice();
      const updated=current.map(e=>{const u=updates.find(x=>x.name.toLowerCase()===e.name.toLowerCase());return u?{name:e.name,sets:parseInt(u.sets)||e.sets,reps:u.reps||e.reps}:e;});
      await saveTemplate(day,updated);
      showToast(`Updated ${updates.filter(u=>current.some(e=>e.name.toLowerCase()===u.name.toLowerCase())).length} exercises`);
    } catch(err) { showToast("Import failed"); }
  }

  function buildLogText(ci) {
   try {
    const w=getWorkout(),allEx=getAllExercises();
    const historyN=profile.historyN||5;
    const phase=profile.phase||null;
    const durMin=workoutStartTime?Math.floor((Date.now()-workoutStartTime)/60000):0;
    const vol=Object.values(sets).flat().reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0);

    // Latest bodyweight from history check-ins (most recent that has one)
    const latestBW=(()=>{const sorted=Object.values(history).filter(e=>e.checkIn?.bodyweight).sort((a,b)=>new Date(b.date)-new Date(a.date));return sorted.length?sorted[0].checkIn.bodyweight:null;})();

    // Header — neutral, no personal context
    const sessionDate=workoutStartTime?localDateKey(workoutStartTime):todayKey();
    const sessionDateLabel=workoutStartTime?new Date(workoutStartTime).toLocaleDateString("en-US",{month:"short",day:"numeric"}):dateLabel();
    let header=`WORKOUT LOG — ${day.toUpperCase()} ${w.label} — ${sessionDateLabel}`;
    const metaParts=[];
    if(w.sub)metaParts.push(`Split: ${w.sub}`);
    if(phase)metaParts.push(`Phase: ${phase}`);
    if(latestBW)metaParts.push(`BW: ${latestBW}lb`);
    if(metaParts.length)header+=`\n${metaParts.join(" | ")}`;

    // Check-in
    const ciLines=[];if(ci?.energy)ciLines.push(`Energy: ${ci.energy}/5`);if(ci?.sleep)ciLines.push(`Sleep: ${ci.sleep}/5`);if(ci?.bodyweight)ciLines.push(`BW: ${ci.bodyweight}lb`);if(ci?.notes)ciLines.push(`Notes: ${ci.notes}`);

    // Substitution log — added vs program template
    const templateNames=(getWorkout(day).exercises||[]).map(e=>e.name);
    const addedEx=customExercises.map(e=>e.name);
    const removedEx=templateNames.filter(n=>!(sets[n]?.length)&&!allEx.some(e=>e.name===n&&e.custom));
    const subLines=[];
    if(addedEx.length)subLines.push(`Added: ${addedEx.join(", ")}`);
    if(removedEx.length)subLines.push(`Skipped: ${removedEx.join(", ")}`);

    // PR detection per exercise
    function getPRFlags(exName, exSets) {
      if(!exSets.length)return [];
      const flags=[];
      const histWeights=Object.values(history).flatMap(e=>(e.sets?.[exName]||[]).map(s=>parseFloat(s.weight)||0));
      const histVolumes=Object.values(history).map(e=>(e.sets?.[exName]||[]).reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0));
      const maxHistWeight=histWeights.length?Math.max(...histWeights):0;
      const maxHistVol=histVolumes.length?Math.max(...histVolumes):0;
      const curMaxWeight=Math.max(...exSets.map(s=>parseFloat(s.weight)||0));
      const curVol=exSets.reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0);
      // Weight PR: new max weight (only flag if there's prior history)
      if(histWeights.length&&curMaxWeight>maxHistWeight)flags.push("Weight PR");
      // Rep PR at a given weight: any set beats prior best reps at same weight
      for(const s of exSets){
        const w=parseFloat(s.weight);if(!w)continue;
        const priorRepsAtW=Object.values(history).flatMap(e=>(e.sets?.[exName]||[]).filter(hs=>Math.abs((parseFloat(hs.weight)||0)-w)<0.1).map(hs=>parseInt(hs.reps)||0));
        const bestPrior=priorRepsAtW.length?Math.max(...priorRepsAtW):0;
        if(bestPrior>0&&(parseInt(s.reps)||0)>bestPrior){flags.push(`Rep PR @${w}lb`);break;}
      }
      // Volume PR
      if(histVolumes.some(v=>v>0)&&curVol>maxHistVol)flags.push("Volume PR");
      return flags;
    }

    // Sets text with PR flags
    const setsText=allEx.map(ex=>{
      const xs=sets[ex.name]||[];if(!xs.length)return null;
      const noteStr=exerciseNotes[ex.name]?` [${exerciseNotes[ex.name]}]`:"";
      const prFlags=getPRFlags(ex.name,xs);
      const prStr=prFlags.length?` ★${prFlags.join(", ")}`:"";
      const cfStr=controlFocus[ex.name]?" [CONTROL FOCUS — progress via reps/tempo, not load]":"";
      return `${ex.name} (target ${ex.sets}x${ex.reps})${cfStr}: ${xs.map((s,i)=>`Set ${i+1}: ${s.weight}lb x ${s.reps}${s.diff?` [${DIFF[s.diff]?.label||s.diff}]`:""}${s.tempo?" [slow/controlled]":""}`).join(", ")}${noteStr}${prStr}`;
    }).filter(Boolean).join("\n");

    // History (same-day sessions)
    const hist=Object.values(history).filter(e=>e.day===day).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,historyN);
    const histText=hist.map(e=>{const s=Object.entries(e.sets||{}).map(([ex,sts])=>`  ${ex}: ${sts.map(x=>`${x.weight}x${x.reps}${x.diff?` [${x.diff}]`:""}`).join(", ")}`).join("\n");return `${e.dateLabel||e.date} — ${e.label}\n${s}`;}).join("\n\n");

    const ss=getSupersets();const ssText=ss.length?`\n\nSUPERSETS:\n${ss.map(g=>`  ${g.join(" + ")}`).join("\n")}`:"";

    return [
      header,
      ciLines.length?"CHECK-IN:\n"+ciLines.join("\n"):"",
      `SESSION: ${durMin?`${durMin} min | `:""}Volume ${vol.toLocaleString()} lb | ${Object.values(sets).filter(v=>v.length).length}/${allEx.length} exercises`,
      subLines.length?"SUBSTITUTIONS:\n"+subLines.join("\n"):"",
      `SETS:\n${setsText||"None"}`,
      ssText.trim(),
      `PREVIOUS ${day.toUpperCase()} (${hist.length} of ${historyN}):\n${histText||"First session"}`,
    ].filter(Boolean).join("\n\n");
   } catch(err) { console.error("buildLogText failed:",err); return `WORKOUT LOG \u2014 ${day}`; }
  }

  async function sendToSheets(entry){if(activeProfileId!=="peter")return;if(!sheetsUrl)return;setSheetsSyncStatus("sending");try{const r=await fetch(sheetsUrl,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify(entry)});const d=await r.json();setSheetsSyncStatus(d.status==="ok"?"ok":"error");}catch(e){setSheetsSyncStatus("error");}}

  async function updateInSheets(entry){if(activeProfileId!=="peter")return;if(!sheetsUrl)return;setSheetsSyncStatus("sending");try{const r=await fetch(sheetsUrl,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({...entry,_action:"update"})});const d=await r.json();setSheetsSyncStatus(d.status==="ok"?"ok":"error");}catch(e){setSheetsSyncStatus("error");}}

  async function deleteFromSheets(date,day){if(activeProfileId!=="peter")return;if(!sheetsUrl)return;try{await fetch(sheetsUrl+"?action=delete&date="+encodeURIComponent(date)+"&day="+encodeURIComponent(day));}catch(e){}}
  async function clearAllFromSheets(){if(activeProfileId!=="peter")return;if(!sheetsUrl)return;try{await fetch(sheetsUrl+"?action=clearall");}catch(e){}}

  async function syncFromSheets(){
    if(activeProfileId!=="peter")return;
    if(!sheetsUrl)return;
    try{
      var r=await fetch(sheetsUrl+"?action=sync");
      var d=await r.json();
      if(d.status==="ok"&&d.sessions&&d.sessions.length>0){
        var localHist=await store.get("iron-history")||{};
        var merged=Object.assign({},localHist);
        var added=0;
        for(var i=0;i<d.sessions.length;i++){
          var s=d.sessions[i];
          var key=s.key||s.date+"-"+s.day;
          if(!merged[key]){merged[key]=s;added++;}
        }
        if(added>0){setHistory(merged);await store.set("iron-history",merged);showToast(added+" session"+(added>1?"s":"")+" synced");}
        else{showToast("Already in sync");}
      }else{showToast("Nothing to sync");}
    }catch(e){showToast("Sync failed");}
  }

  const[syncing,setSyncing]=useState(false);
  async function manualSync(){setSyncing(true);await syncFromSheets();setSyncing(false);}

  function backupProfile() {
    const prefix = "wl_" + activeProfileId + "_";
    const data = { version: 1, profile, exportedAt: new Date().toISOString(), store: {} };
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        try { data.store[key.slice(prefix.length)] = JSON.parse(localStorage.getItem(key)); } catch(e) { data.store[key.slice(prefix.length)] = localStorage.getItem(key); }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "workout-backup-" + profile.name.toLowerCase().replace(/\s+/g,"-") + "-" + todayKey() + ".json";
    a.click(); URL.revokeObjectURL(url);
  }

  async function restoreFromBackup(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.store || !data.profile) { showToast("Invalid backup file"); return; }
      const prefix = "wl_" + activeProfileId + "_";
      // FIX: always JSON.stringify. Backup stored parsed values; writing raw strings
      // back un-stringified made store.get() fail to parse them after a restore.
      Object.entries(data.store).forEach(([k, v]) => {
        localStorage.setItem(prefix + k, JSON.stringify(v));
      });
      showToast("Restored! Reloading…");
      setTimeout(() => window.location.reload(), 1200);
    } catch(e) { showToast("Restore failed"); }
  }

  // Pull from Sheets disabled — push only

  async function finishWorkout(ci) {
   try {
    const w=getWorkout();const duration=workoutStartTime?Math.floor((Date.now()-workoutStartTime)/1000):0;const text=buildLogText(ci||{});
    const displaySets={};Object.entries(sets).forEach(([k,v])=>{displaySets[renames[k]||k]=v;});
    // Use the actual workout date (from start time) so late submissions record correctly
    const sessionDate=workoutStartTime?localDateKey(workoutStartTime):todayKey();
    const sessionDateLabel=workoutStartTime?new Date(workoutStartTime).toLocaleDateString("en-US",{month:"short",day:"numeric"}):dateLabel();
    const entry={day,label:w.label,date:sessionDate,dateLabel:sessionDateLabel,sets:displaySets,customExercises:[...customExercises],checkIn:ci||{},logText:text,duration,notes:{...exerciseNotes},supersets:getSupersets()};
    // FIX: don't silently overwrite an existing session on the same date+day
    // (e.g. "Log Again" after finishing). Suffix the key instead.
    const baseHKey=`${sessionDate}-${day}`;
    let hKey=baseHKey,hn=1;
    while(history[hKey])hKey=`${baseHKey}-${hn++}`;
    const uh={...history,[hKey]:entry};setHistory(uh);await store.set("iron-history",uh);
    setShowFinishModal(false);
    sendToSheets(entry);
    setSets({});setDone({});setActiveEx(null);setCustomExercises([]);setRenames({});setExerciseNotes({});setTempoSlow(false);
    setWorkoutStartTime(null);
    await Promise.all([store.set(`sets-${day}-draft`,{}),store.set(`done-${day}-draft`,{}),store.set(`custom-ex-${day}-draft`,[]),store.set(`renames-${day}-draft`,{}),store.set(`notes-${day}-draft`,{}),store.set(`workout-start-${day}-draft`,null)]);
    dayCache.current={};
    if(activeSessionProgram){const{programId,workoutIdx}=activeSessionProgram;const updProgs=programs.map(p=>{if(p.id!==programId)return p;const nextIdx=(workoutIdx+1)%p.workouts.length;return{...p,currentIdx:nextIdx};});await savePrograms(updProgs);setActiveSessionProgram(null);}
    setView("log");
    showToast("Workout saved");
   } catch(err) { console.error("finishWorkout failed:",err); showToast("Save failed: "+(err&&err.message?err.message:String(err))); }
  }

  async function clearToday(){setSets({});setDone({});setActiveEx(null);setCustomExercises([]);setRenames({});setExerciseNotes({});setWorkoutStartTime(null);setActiveSessionProgram(null);await Promise.all([store.set(`sets-${day}-draft`,{}),store.set(`done-${day}-draft`,{}),store.set(`custom-ex-${day}-draft`,[]),store.set(`renames-${day}-draft`,{}),store.set(`notes-${day}-draft`,{}),store.set(`workout-start-${day}-draft`,null)]); showToast("Cleared");}

  async function saveDraftForDay(d) {
    const prefix=`wl_${activeProfileId}_`;
    const raw=k=>{ try{const v=localStorage.getItem(prefix+k);return v?JSON.parse(v):null;}catch{return null;} };
    const dSets=raw(`sets-${d}-draft`)||{};
    const dWst=raw(`workout-start-${d}-draft`);
    const dCex=raw(`custom-ex-${d}-draft`)||[];
    const dRenames=raw(`renames-${d}-draft`)||{};
    const dNotes=raw(`notes-${d}-draft`)||{};
    const w=getWorkout(d);
    const sessionDate=dWst?localDateKey(dWst):todayKey();
    const sessionDateLabel=dWst?new Date(dWst).toLocaleDateString("en-US",{month:"short",day:"numeric"}):dateLabel();
    const displaySets={};Object.entries(dSets).forEach(([k,v])=>{displaySets[dRenames[k]||k]=v;});
    const entry={day:d,label:w.label,date:sessionDate,dateLabel:sessionDateLabel,sets:displaySets,customExercises:dCex,checkIn:{},logText:"",duration:0,notes:dNotes,supersets:[]};
    const baseHKey=`${sessionDate}-${d}`;
    let hKey=baseHKey,hn=1;
    while(history[hKey])hKey=`${baseHKey}-${hn++}`;
    const uh={...history,[hKey]:entry};
    setHistory(uh);await store.set("iron-history",uh);
    await Promise.all([store.set(`sets-${d}-draft`,{}),store.set(`done-${d}-draft`,{}),store.set(`custom-ex-${d}-draft`,[]),store.set(`renames-${d}-draft`,{}),store.set(`notes-${d}-draft`,{}),store.set(`workout-start-${d}-draft`,null)]);
    sendToSheets(entry);
    if(d===day){setSets({});setDone({});setCustomExercises([]);setRenames({});setExerciseNotes({});setWorkoutStartTime(null);}
    showToast("Saved");setDraftsRefresh(r=>r+1);
  }
  async function discardDraftForDay(d) {
    await Promise.all([store.set(`sets-${d}-draft`,{}),store.set(`done-${d}-draft`,{}),store.set(`custom-ex-${d}-draft`,[]),store.set(`renames-${d}-draft`,{}),store.set(`notes-${d}-draft`,{}),store.set(`workout-start-${d}-draft`,null)]);
    if(d===day){setSets({});setDone({});setCustomExercises([]);setRenames({});setExerciseNotes({});setWorkoutStartTime(null);}
    showToast("Draft discarded");setDiscardConfirmDay(null);setDraftsRefresh(r=>r+1);
  }

  async function deleteHistoryEntry(key) {
    const entry = history[key];
    const u = {...history}; delete u[key]; setHistory(u); await store.set("iron-history", u); showToast("Deleted");
    if(entry) deleteFromSheets(entry.date, entry.day);
  }
  async function editHistoryEntry(key, newSets, newDate, newDay) {
    const orig = history[key];
    if(!orig) return;
    const finalDate = newDate || orig.date;
    const finalDay = newDay || orig.day;
    const finalDateLabel = newDate ? new Date(newDate+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"}) : orig.dateLabel;
    const dateOrDayChanged = orig.date !== finalDate || orig.day !== finalDay;
    const updatedEntry = {...orig, sets: newSets, date: finalDate, day: finalDay, dateLabel: finalDateLabel};
    const updated = {...history};
    const newKey = `${finalDate}-${finalDay}`;
    if(newKey !== key) {
      delete updated[key];
      let safeKey = newKey;
      let n = 1;
      while(updated[safeKey]) { safeKey = `${newKey}-${n}`; n++; }
      updated[safeKey] = updatedEntry;
    } else {
      updated[key] = updatedEntry;
    }
    setHistory(updated);
    await store.set("iron-history", updated);
    showToast("Updated");
    if(activeProfileId === "peter") {
      if(dateOrDayChanged) {
        await deleteFromSheets(orig.date, orig.day);
        await sendToSheets(updatedEntry);
      } else {
        await updateInSheets(updatedEntry);
      }
    }
  }
  async function clearAllHistory() {
    setHistory({}); await store.set("iron-history", {}); showToast("History cleared");
    clearAllFromSheets();
  }

  const w=getWorkout(),isRest=w.exercises.length===0&&customExercises.length===0,allExercises=getAllExercises();
  const totalSets=Object.values(sets).reduce((a,b)=>a+b.length,0),doneCount=Object.values(done).filter(Boolean).length,today=autoDay();
  const todayCompleted=history[`${todayKey()}-${day}`]!==undefined;
  const totalVolume=Object.values(sets).flat().reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0);
  const workoutElapsed=workoutStartTime?Math.floor((now-workoutStartTime)/1000):0;
  const workoutMin=Math.floor(workoutElapsed/60),workoutSec=workoutElapsed%60;
  const dayFull=new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
  if(view!=="log"&&view!=="history"&&view!=="edit"&&view!=="profile"&&view!=="ledger") setView("log");

  if(loading) return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.font}}><div style={{color:T.dim,fontSize:13,letterSpacing:2,animation:"pulse 1.5s infinite"}}>Loading...</div></div>;

  return (
    <>
    <div className="app-wrap" style={{height:"100dvh",maxWidth:540,margin:"0 auto",background:T.spaceBg,fontFamily:T.font,color:T.text,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",zIndex:1}}>
      <style>{css}</style>
      {toast && <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:T.surface2,color:T.text,border:`1px solid ${T.border2}`,padding:"10px 24px",borderRadius:8,fontSize:13,fontWeight:600,zIndex:200,animation:"slideIn .25s",fontFamily:T.mono,whiteSpace:"nowrap",boxShadow:"0 4px 16px rgba(0,0,0,0.4)"}}>{toast}</div>}

      {showFinishModal && <FinishModal energy={finishEnergy} setEnergy={setFinishEnergy} sleep={finishSleep} setSleep={setFinishSleep} bodyweight={finishWeight} setBodyweight={setFinishWeight} notes={finishNotes} setNotes={setFinishNotes} onConfirm={()=>finishWorkout({energy:finishEnergy,sleep:finishSleep,bodyweight:finishWeight,notes:finishNotes})} onSkip={()=>finishWorkout({})} onCancel={()=>setShowFinishModal(false)} />}
      {showStaleDraftModal && <StaleDraftModal
        wst={workoutStartTime}
        setCount={Object.values(sets).reduce((a,v)=>a+v.length,0)}
        volume={Math.round(Object.values(sets).reduce((a,v)=>a+v.reduce((b,s)=>b+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0),0))}
        onResume={()=>setShowStaleDraftModal(false)}
        onSaveAsIs={()=>{setShowStaleDraftModal(false);finishWorkout({});}}
        onDiscard={async()=>{setSets({});setDone({});setActiveEx(null);setCustomExercises([]);setRenames({});setExerciseNotes({});setWorkoutStartTime(null);await Promise.all([store.set(`sets-${day}-draft`,{}),store.set(`done-${day}-draft`,{}),store.set(`custom-ex-${day}-draft`,[]),store.set(`renames-${day}-draft`,{}),store.set(`notes-${day}-draft`,{}),store.set(`workout-start-${day}-draft`,null)]);setShowStaleDraftModal(false);showToast("Draft discarded");}}
      />}


      {/* ═══ PLAN JSON EDITOR ═══ */}
      {showPlanEditor && (
        <div style={{position:"fixed",inset:0,zIndex:200,background:T.bg,display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 20px 12px",borderBottom:"1px solid "+T.border,flexShrink:0}}>
            <div style={{fontSize:17,fontWeight:700,color:T.text}}>Workout Plan JSON</div>
            <button onClick={()=>setShowPlanEditor(false)} style={{background:"none",border:"none",color:T.dim,fontSize:20,cursor:"pointer",padding:"0 4px",lineHeight:1}}>✕</button>
          </div>
          <div style={{padding:"10px 16px",background:T.surface2,borderBottom:"1px solid "+T.border,flexShrink:0}}>
            <div style={{fontSize:12,color:T.dim,lineHeight:1.5}}>Paste this into Claude or ChatGPT and ask it to update your plan. Then paste the response back and tap Save.</div>
          </div>
          <textarea
            value={planEditorText}
            onChange={e=>setPlanEditorText(e.target.value)}
            spellCheck={false}
            style={{flex:1,width:"100%",background:T.surface,color:T.text,border:"none",padding:"14px 16px",fontSize:12,fontFamily:T.mono,resize:"none",outline:"none",boxSizing:"border-box"}}
          />
          <div style={{display:"flex",gap:10,padding:"12px 16px 32px",flexShrink:0,borderTop:"1px solid "+T.border}}>
            <button onClick={()=>setShowPlanEditor(false)} style={{flex:1,background:"none",border:"1.5px solid "+T.border,color:T.sub,padding:"13px 0",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
            <button onClick={savePlanJson} style={{flex:2,background:T.accentGradient,border:"none",color:"#fff",padding:"13px 0",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Save Plan</button>
          </div>
        </div>
      )}

      {/* ═══ PROGRAM MANAGER ═══ */}
      {showProgramManager&&<ProgramManagerOverlay programs={programs} onSave={async(p)=>{await savePrograms(p);}} onClose={()=>setShowProgramManager(false)} customWorkouts={customWorkouts} exerciseCatalog={exerciseCatalog} />}

      {/* ═══ TIMER — FULL or MINIMIZED ═══ */}
      {timerActive && !timerMinimized && (
        <div style={{position:"fixed",inset:0,zIndex:150,background:T.timerBg,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .3s"}}>
          <div style={{textAlign:"center",width:"100%",maxWidth:400,padding:"0 32px",position:"relative",zIndex:1}}>
            <div style={{height:2,background:T.border2,overflow:"hidden",maxWidth:200,margin:"0 auto 40px"}}>
              <div style={{height:"100%",width:`${100-timerPct}%`,background:timerRemaining<=10?T.accent:T.sub,transition:"width 1s linear"}} />
            </div>
            <div style={{fontSize:11,letterSpacing:10,fontWeight:700,marginBottom:20,color:T.accent,fontFamily:T.display}}>REST</div>
            <div
              key={`${Math.floor(timerRemaining/60)}:${String(timerRemaining%60).padStart(2,"0")}`}
              style={{
                fontSize:100,fontWeight:800,letterSpacing:-2,lineHeight:1,
                fontFamily:T.display,
                color:timerRemaining<=10?T.accent:T.text,
                animation:"digitAppear 0.65s ease-out",
              }}
            >{Math.floor(timerRemaining/60)}:{String(timerRemaining%60).padStart(2,"0")}</div>
            <div style={{fontSize:13,color:T.dim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:280,margin:"18px auto 44px",fontFamily:T.mono}}>{activeEx||""}</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={()=>setTimerDuration(p=>Math.max(5,p-15))} style={{background:T.border2,border:`1px solid ${T.sub}`,color:T.text,padding:"14px 18px",fontSize:13,cursor:"pointer",fontFamily:T.font}}>−15s</button>
              <button onClick={()=>{setTimerStart(null);setTimerMinimized(false);setTimeout(()=>{repsRef.current?.focus();repsRef.current?.select();},150);}} style={{background:T.accent,border:"none",color:T.text,padding:"14px 40px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Skip — Go</button>
              <button onClick={()=>setTimerDuration(p=>p+15)} style={{background:T.border2,border:`1px solid ${T.sub}`,color:T.text,padding:"14px 18px",fontSize:13,cursor:"pointer",fontFamily:T.font}}>+15s</button>
            </div>
            <div style={{display:"flex",justifyContent:"center",marginTop:16}}>
              <button onClick={()=>setTimerMinimized(true)} style={{background:"transparent",border:`1px solid ${T.border2}`,color:T.sub,padding:"10px 28px",fontSize:13,cursor:"pointer",fontFamily:T.font}}>Minimize</button>
            </div>
          </div>
        </div>
      )}
      {timerActive && timerMinimized && (
        <div onClick={()=>setTimerMinimized(false)} style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:T.timerBg,padding:"0 20px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",animation:"slideIn .2s ease",maxWidth:540,margin:"0 auto",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,width:`${100-timerPct}%`,background:`rgba(255,159,10,${timerRemaining<=10?0.25:0.12})`,transition:"width 1s linear",pointerEvents:"none"}} />
          <div style={{width:6,height:6,background:T.accent,animation:"pulse 1s infinite",flexShrink:0,position:"relative"}} />
          <span style={{fontSize:11,fontWeight:700,letterSpacing:4,color:T.text,whiteSpace:"nowrap",position:"relative",fontFamily:T.display}}>REST</span>
          {activeEx&&<span style={{fontSize:12,color:T.sub,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",position:"relative",fontFamily:T.mono}}>{activeEx}</span>}
          <span style={{fontSize:17,fontWeight:800,fontFamily:T.display,whiteSpace:"nowrap",marginLeft:"auto",position:"relative",color:timerRemaining<=10?T.accent:T.text,padding:"10px 0"}}>{Math.floor(timerRemaining/60)}:{String(timerRemaining%60).padStart(2,"0")}</span>
          <span style={{fontSize:10,color:T.accent,position:"relative"}}>▼</span>
        </div>
      )}

      {/* Spacer for top-pinned minimized timer */}
      {timerActive&&timerMinimized&&<div style={{height:44,flexShrink:0,transition:"height .2s"}} />}

      {/* ═══ HEADER ═══ */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        {/* Row 1: App title centered, wake lock + profile absolute right */}
        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",padding:"14px 16px 6px"}}>
          <div style={{fontFamily:T.font,fontSize:20,fontWeight:700,letterSpacing:-0.4,lineHeight:1.1,color:T.text}}>Workout Log</div>
          <div style={{position:"absolute",right:16,display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>setWakeLockOn(v=>!v)} title={wakeLockOn?"Screen lock on":"Screen lock off"} style={{background:wakeLockOn?T.accentDim:"none",border:`1.5px solid ${wakeLockOn?T.accent:T.border}`,color:wakeLockOn?T.accent:T.dim,width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15,flexShrink:0}}>☀</button>
          </div>
        </div>
        {/* Row 2: Workout identity centered */}
        <div style={{textAlign:"center",padding:"0 60px 10px"}}>
          <div style={{fontSize:13,fontWeight:600,color:T.sub,display:"flex",alignItems:"center",justifyContent:"center",gap:0,flexWrap:"wrap"}}>
            <span>{w.label||"WORKOUT"}</span>
            <span style={{margin:"0 5px",opacity:0.4}}>·</span>
            <button onClick={()=>setDayPickerOpen(v=>!v)} style={{background:"transparent",border:"none",color:T.sub,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:T.font,padding:0,display:"inline-flex",alignItems:"center",gap:3}}>
              {day.slice(0,3)} <span style={{fontSize:9,opacity:0.6}}>{dayPickerOpen?"▲":"▾"}</span>
            </button>
            <span style={{margin:"0 5px",opacity:0.4}}>·</span>
            <span>{new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
            {workoutStartTime&&<span style={{marginLeft:10,color:T.dim,fontFamily:T.mono,fontWeight:500,fontSize:12}}>{workoutMin}:{String(workoutSec).padStart(2,"0")}</span>}
          </div>
          {w.sub&&<div style={{fontSize:11,color:T.dim,marginTop:3}}>{w.sub}</div>}
          {!w.sub&&isRest&&<div style={{fontSize:11,color:T.dim,marginTop:3}}>Rest Day</div>}
          {activeSessionProgram&&(()=>{const prog=programs.find(p=>p.id===activeSessionProgram.programId);return prog?<div style={{fontSize:10,color:T.accent,marginTop:3,fontWeight:600,letterSpacing:0.3}}>{prog.name} · {activeSessionProgram.workoutIdx+1}/{prog.workouts.length}</div>:null;})()}
          {workoutStartTime&&localDateKey(workoutStartTime)!==todayKey()&&(
            <div style={{marginTop:6,display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,214,10,0.10)",border:"1px solid rgba(255,214,10,0.30)",borderRadius:8,padding:"4px 10px",fontSize:11,color:T.yellow,fontWeight:600}}>
              ⚠ Unsubmitted session from {new Date(workoutStartTime).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})} — tap Finish to save
            </div>
          )}
        </div>
        {!dismissedDrafts&&otherDayDrafts.length>0&&(
          <div style={{margin:"0 16px 10px",background:"rgba(255,214,10,0.08)",border:"1px solid rgba(255,214,10,0.28)",borderRadius:8,padding:"8px 12px",fontSize:12,color:T.yellow}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{fontWeight:700}}>⚠ Unsaved drafts</span>
              <button onClick={()=>setDismissedDrafts(true)} style={{background:"none",border:"none",color:T.yellow,fontSize:14,cursor:"pointer",padding:"0 0 0 8px",lineHeight:1,opacity:0.6}}>✕</button>
            </div>
            {otherDayDrafts.map(({day:d,dateLabel:dl})=>(
              <div key={d} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:5}}>
                <span style={{opacity:0.85}}>{d} · {dl}</span>
                <button onClick={()=>{switchDay(d);setDismissedDrafts(true);}} style={{background:"rgba(255,214,10,0.18)",border:"1px solid rgba(255,214,10,0.40)",color:T.yellow,borderRadius:6,padding:"5px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font,flexShrink:0}}>Jump to →</button>
              </div>
            ))}
          </div>
        )}
        {/* Day picker dropdown */}
        {dayPickerOpen&&(
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"0 16px 10px",overflowX:"auto"}}>
            {DAYS.map(d=>{const sel=d===day,tod=d===today,rest=(getWorkout(d).exercises||[]).length===0; return (
              <button key={d} onClick={()=>{if(sel){setDayPickerOpen(false);}else{switchDay(d);}}} style={{background:sel?T.accentGradient:"transparent",border:`1.5px solid ${sel?T.accent:tod?T.green:T.border}`,color:sel?"#fff":tod?T.green:rest?T.dim:T.sub,padding:"6px 11px",borderRadius:8,fontSize:12,fontWeight:sel||tod?600:400,cursor:"pointer",fontFamily:T.font,whiteSpace:"nowrap",flexShrink:0,position:"relative"}}>
                {d.slice(0,3)}{tod&&!sel&&<span style={{position:"absolute",top:2,right:3,width:4,height:4,borderRadius:"50%",background:T.green,display:"block"}} />}
              </button>);
            })}
          </div>
        )}
      </div>

      {/* ═══ CONTENT ═══ */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
        {Object.keys(sets).length>0&&workoutStartTime&&localDateKey(workoutStartTime)!==todayKey()&&(
          <div style={{position:"sticky",top:0,zIndex:50,background:T.red,color:"#fff",padding:"10px 16px",fontWeight:700,fontSize:13,textAlign:"center",lineHeight:1.5}}>
            ⚠ DRAFT FROM {new Date(workoutStartTime).toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})} — NOT TODAY
            <div style={{fontWeight:400,fontSize:11,marginTop:1}}>Do not log today's workout here. Finish or discard this draft first (Profile → Drafts).</div>
          </div>
        )}
        {view==="log"&&(<>
          {/* Program picker — outside isRest check so it shows on rest days too */}
          {programs.length>0&&!activeSessionProgram&&totalSets===0&&(!todayCompleted||ignoreTodayCompletion)&&<ProgramPickerCard programs={programs} onStart={(programId,workoutIdx)=>setActiveSessionProgram({programId,workoutIdx})} />}
          {/* Active program session banner */}
          {activeSessionProgram&&(()=>{const prog=programs.find(p=>p.id===activeSessionProgram.programId);return prog?(<div style={{margin:"12px 16px 0",background:T.accentLight,border:`1.5px solid ${T.accent}`,borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:10,color:T.accent,fontWeight:700,letterSpacing:0.5}}>{prog.name.toUpperCase()} · {activeSessionProgram.workoutIdx+1}/{prog.workouts.length}</div><div style={{fontSize:12,color:T.sub,marginTop:1}}>Program session active</div></div><button onClick={()=>setActiveSessionProgram(null)} style={{background:"none",border:`1px solid ${T.border}`,color:T.dim,padding:"5px 10px",borderRadius:7,fontSize:11,cursor:"pointer",fontFamily:T.font}}>Cancel</button></div>):null;})()}
          {isRest?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px",textAlign:"center",gap:16}}>
              <div style={{fontSize:56,opacity:0.7}}>🔋</div>
              <div style={{fontSize:28,fontWeight:700,color:T.dim}}>Rest Day</div>
              <div style={{fontSize:14,color:T.sub}}>{w.sub}</div>
              {showAddEx ? (
              <div style={{width:"100%",maxWidth:400,background:T.accentLight,border:`1.5px solid ${T.accent}`,borderRadius:10,padding:"12px",textAlign:"left",marginTop:8}}>
                <div style={{fontSize:12,color:T.accent,fontWeight:600,marginBottom:10}}>Add Exercise</div>
                <div style={{marginBottom:8}}><ExercisePicker value={newExName} onChange={setNewExName} onSelect={(name)=>setNewExName(name)} catalog={exerciseCatalog} placeholder="Exercise name" dropUp={true} /></div>
                {isCardio(newExName.trim())?(
                  <div style={{marginBottom:8}}><div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:3}}>Target duration (min)</div><input type="number" inputMode="numeric" value={newExReps} onChange={e=>setNewExReps(e.target.value)} placeholder="30" style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"9px",borderRadius:8,fontSize:14,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                ):(
                  <div style={{display:"flex",gap:8,marginBottom:8}}>
                    <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:3}}>Sets</div><input type="number" inputMode="numeric" value={newExSets} onChange={e=>setNewExSets(e.target.value)} style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"9px",borderRadius:8,fontSize:14,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                    <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:3}}>Rep range</div><input type="text" value={newExReps} onChange={e=>setNewExReps(e.target.value)} placeholder="10-12" style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"9px",borderRadius:8,fontSize:14,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                  </div>
                )}
                <div style={{display:"flex",gap:8}}>
                  <button onClick={addCustomExercise} disabled={!newExName.trim()} style={{flex:1,padding:"11px 0",background:!newExName.trim()?T.surface3:T.accentGradient,color:!newExName.trim()?T.dim:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:!newExName.trim()?"default":"pointer",fontFamily:T.font}}>Add</button>
                  <button onClick={()=>{setShowAddEx(false);setNewExName("");}} style={{flex:1,padding:"11px 0",background:T.surface,border:`1.5px solid ${T.border}`,color:T.dim,borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={()=>setShowAddEx(true)} style={{marginTop:16,background:T.surface,border:`1.5px dashed ${T.border2}`,color:T.sub,padding:"12px 24px",borderRadius:10,fontSize:13,cursor:"pointer",fontFamily:T.font}}>+ Add exercise anyway</button>
            )}
            </div>
          ):(<>

            {/* Post-completion card OR exercise list */}
            {todayCompleted&&totalSets===0&&!ignoreTodayCompletion?(()=>{
              const ce=history[`${todayKey()}-${day}`];
              const cTs=Object.values(ce.sets||{}).reduce((a,b)=>a+b.length,0);
              const cTv=Object.values(ce.sets||{}).flat().reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0);
              const cMin=ce.duration?Math.floor(ce.duration/60):null;
              return (
                <div style={{margin:"24px 16px 8px",background:T.surface,borderRadius:16,padding:"32px 24px",border:`1px solid ${T.border}`,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:12}}>
                  <div style={{fontSize:52,lineHeight:1}}>✅</div>
                  <div>
                    <div style={{fontSize:24,fontWeight:800,color:T.text,marginBottom:6,letterSpacing:-0.5}}>Workout Complete</div>
                    <div style={{fontSize:14,color:T.sub}}>{ce.label} · {ce.dateLabel||ce.date}</div>
                  </div>
                  <div style={{fontFamily:T.mono,fontSize:13,color:T.dim}}>{cTs} sets · {cTv.toLocaleString()} lb{cMin?` · ${cMin} min`:""}</div>
                  <div style={{display:"flex",gap:10,marginTop:4}}>
                    <button onClick={()=>setView("history")} style={{padding:"10px 20px",background:"transparent",border:`1.5px solid ${T.accent}`,color:T.accent,borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>View Summary</button>
                    <button onClick={()=>setIgnoreTodayCompletion(true)} style={{padding:"10px 20px",background:"transparent",border:`1.5px solid ${T.border}`,color:T.dim,borderRadius:10,fontSize:13,cursor:"pointer",fontFamily:T.font}}>Log Again</button>
                  </div>
                </div>
              );
            })():(
            allExercises.map((ex,exIdx)=>{
              const exSets=sets[ex.name]||[],isActive=activeEx===ex.name,isDone=done[ex.name],targetMet=exSets.length>=ex.sets,lastSession=findLastExercise(ex.name),isCustom=ex.custom,exCardio=isCardio(ex.name),exPR=exCardio?null:findPR(ex.name);
              const ssGroup=getSupersetFor(ex.name);const isSSFirst=ssGroup&&ssGroup[0]===ex.name;const isSSMember=!!ssGroup;
              var exVol=exSets.reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0);
              if(isDone&&!isActive&&!reordering) return (
                <div key={ex.name+exIdx} ref={el=>{exRefs.current[ex.name]=el;}} onClick={()=>toggleDone(ex.name)} style={{background:T.bg,borderRadius:12,margin:"6px 16px",padding:"12px 16px",opacity:0.5,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:20,height:20,borderRadius:6,background:T.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:12,color:"#fff"}}>✓</span></div>
                    <span style={{fontSize:13,color:T.sub}}>{getDisplayName(ex)}</span>
                  </div>
                  <span style={{fontSize:12,color:T.dim}}>{exCardio?`${exSets.reduce((a,s)=>a+(parseInt(s.reps)||0),0)} min`:`${exSets.length} sets · ${exVol.toLocaleString()} lb`}</span>
                </div>
              );
              return (
                <div key={ex.name+exIdx} ref={el=>{exRefs.current[ex.name]=el;}} onClick={e=>{if(reordering||e.target.closest("[data-no-row-click]"))return;openExercise(ex.name);}} style={{background:T.surface,borderRadius:12,margin:isSSMember?"2px 16px":"6px 16px",padding:"16px",border:isActive?"1.5px solid rgba(255,159,10,0.35)":`1px solid ${isCustom?"rgba(255,214,10,0.3)":T.border}`,borderLeft:isSSMember?"2px solid #FF9F0A":undefined,boxShadow:isActive?"0 0 16px rgba(255,159,10,0.12)":"0 1px 3px rgba(0,0,0,0.3)",opacity:isDone&&!reordering?0.4:1,cursor:reordering?"default":"pointer"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                        {!reordering&&<button data-no-row-click onClick={e=>{e.stopPropagation();toggleDone(ex.name);}} style={{width:20,height:20,borderRadius:6,border:`1.5px solid ${isDone?T.green:T.border2}`,background:isDone?T.green:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{isDone&&<span style={{fontSize:12,color:"#fff",lineHeight:1}}>✓</span>}</button>}
                        {reordering&&<div style={{display:"flex",flexDirection:"column",gap:2,flexShrink:0}}><button onClick={()=>moveExercise(exIdx,-1)} disabled={exIdx===0} style={{background:"none",border:"none",color:exIdx===0?T.border:T.sub,fontSize:13,cursor:exIdx===0?"default":"pointer",padding:0,lineHeight:1}}>▲</button><button onClick={()=>moveExercise(exIdx,1)} disabled={exIdx===allExercises.length-1} style={{background:"none",border:"none",color:exIdx===allExercises.length-1?T.border:T.sub,fontSize:13,cursor:exIdx===allExercises.length-1?"default":"pointer",padding:0,lineHeight:1}}>▼</button></div>}
                        {renamingEx===ex.name?(<div data-no-row-click onClick={e=>e.stopPropagation()} style={{display:"flex",gap:4,flex:1}}><input ref={renameRef} type="text" value={renameValue} onChange={e=>setRenameValue(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")renameExercise(ex.name,renameValue);if(e.key==="Escape")setRenamingEx(null);}} style={{flex:1,background:T.surface2,border:"1.5px solid "+T.accent,color:T.text,padding:"4px 8px",borderRadius:6,fontSize:13,fontFamily:T.font,outline:"none"}}/><button onClick={()=>renameExercise(ex.name,renameValue)} style={{background:T.accentGradient,color:"#fff",border:"none",padding:"4px 10px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:T.font}}>✓</button></div>):(<><span style={{fontSize:15,fontWeight:600,color:isCustom?T.yellow:T.text,lineHeight:1.3,letterSpacing:-0.2}}>{getDisplayName(ex)}{isCustom&&<span style={{fontSize:10,color:T.dim,marginLeft:6,fontWeight:400}}>added</span>}{controlFocus[ex.name]&&<span title="Control focus — quality over load" style={{fontSize:10,color:T.accent,marginLeft:6,fontWeight:600}}>🎯</span>}</span>{isSSFirst&&<span style={{fontSize:10,fontWeight:700,color:T.accent,background:"rgba(255,159,10,0.12)",border:"1px solid rgba(255,159,10,0.3)",borderRadius:4,padding:"1px 5px",marginLeft:6,letterSpacing:0.5}}>⚡ SS</span>}{isActive&&!reordering&&<button data-no-row-click onClick={e=>{e.stopPropagation();setRenamingEx(ex.name);setRenameValue(getDisplayName(ex));setTimeout(()=>{if(renameRef.current)renameRef.current.focus();},80);}} style={{background:"none",border:"none",color:T.dim,fontSize:13,cursor:"pointer",padding:"0 0 0 6px",fontFamily:T.font}}>✏️</button>}</>)}
                      </div>
                      {!reordering&&<>
                        <div style={{paddingLeft:30,display:"flex",alignItems:"center",gap:8,marginBottom:exSets.length>0?10:0,flexWrap:"wrap"}}>
                          {editingTarget===ex.name&&isActive?(
                            <div data-no-row-click onClick={e=>e.stopPropagation()} style={{display:"flex",alignItems:"center",gap:6}}>
                              {!exCardio&&<input type="number" inputMode="numeric" value={editTargetSets} onChange={e=>setEditTargetSets(e.target.value)} placeholder="sets" style={{width:44,background:T.surface2,border:`1.5px solid ${T.accent}`,color:T.text,padding:"3px 6px",borderRadius:6,fontSize:12,fontFamily:T.mono,outline:"none",textAlign:"center"}} />}
                              {!exCardio&&<span style={{fontSize:11,color:T.dim}}>×</span>}
                              <input type="text" value={editTargetReps} onChange={e=>setEditTargetReps(e.target.value)} placeholder={exCardio?"min":"reps"} style={{width:exCardio?50:56,background:T.surface2,border:`1.5px solid ${T.accent}`,color:T.text,padding:"3px 6px",borderRadius:6,fontSize:12,fontFamily:T.mono,outline:"none",textAlign:"center"}} />
                              <button onClick={()=>saveExerciseTarget(ex.name,editTargetSets,editTargetReps)} style={{background:T.accentGradient,color:"#fff",border:"none",padding:"3px 10px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:T.font,fontWeight:600}}>✓</button>
                              <button onClick={()=>setEditingTarget(null)} style={{background:"none",border:`1px solid ${T.border}`,color:T.dim,padding:"3px 8px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:T.font}}>✕</button>
                            </div>
                          ):(
                            <span data-no-row-click onClick={e=>{e.stopPropagation();if(isActive){setEditingTarget(ex.name);setEditTargetSets(String(ex.sets));setEditTargetReps(ex.reps);}}} style={{fontSize:12,color:T.dim,cursor:isActive?"pointer":"default",textDecoration:isActive?"underline dotted":"none",textUnderlineOffset:2}}>{exCardio?`${ex.reps} min`:`${ex.sets}×${ex.reps}`}</span>
                          )}
                          {exSets.length>0&&<span style={{fontSize:12,color:targetMet?T.green:T.accent,fontWeight:600}}>{exCardio?`${exSets.reduce((a,s)=>a+(parseInt(s.reps)||0),0)} min ✓`:`${exSets.length}/${ex.sets}${targetMet?" ✓":""}`}</span>}
                          {!exSets.length&&lastSession&&<span style={{fontSize:12,color:T.dim,fontStyle:"italic"}}>{exCardio?`last: ${lastSession.reps} min`:`last: ${lastSession.weight}×${lastSession.reps}`}</span>}
                          {exPR&&<span style={{display:"inline-flex",alignItems:"center",gap:4,background:"rgba(255,159,10,0.10)",border:"1px solid rgba(255,159,10,0.25)",color:T.accent,fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:6}}>PR {exPR.weight}lb×{exPR.reps} · {exPR.date}</span>}
                          {!exSets.length&&(()=>{const p=detectPlateau(ex.name);return p?<div style={{marginTop:4,fontSize:11,color:"rgba(255,214,10,0.75)",fontStyle:"italic",lineHeight:1.4,display:"flex",alignItems:"center",gap:4,flexBasis:"100%"}}>💤 {p.sessions} sessions at {p.weight}lb — push, deload, or hold steady?</div>:null;})()}
                          {!exSets.length&&(function(){var tgt=getSessionTarget(ex.name);return tgt?<div style={{marginTop:4,fontSize:12,color:T.accent,fontWeight:500}}>{"\ud83c\udfaf Target: "+tgt.weight+"lb \u00d7 "+tgt.reps+" \u2014 "+tgt.note}</div>:null;})()}
                          {(()=>{const dn=noteOverrides[ex.name]??ex.note;if(!dn)return null;return(<div data-no-row-click onClick={e=>{e.stopPropagation();if(editingNote!==ex.name){setEditingNote(ex.name);setNoteEditValue(dn);}}} style={{marginTop:4,fontSize:11,color:"rgba(255,159,10,0.75)",fontStyle:"italic",lineHeight:1.4,cursor:"pointer",display:"flex",alignItems:"flex-start",gap:4,flexBasis:"100%"}}><span>📌 {dn}</span><span style={{fontSize:10,color:"rgba(255,159,10,0.45)",flexShrink:0,marginTop:1,marginLeft:2}}>✎</span></div>);})()}
                        </div>
                        {editingNote===ex.name&&<div data-no-row-click onClick={e=>e.stopPropagation()} style={{paddingLeft:30,marginTop:6}}><textarea autoFocus value={noteEditValue} onChange={e=>setNoteEditValue(e.target.value)} onBlur={()=>saveNoteOverride(ex.name,noteEditValue)} rows={3} style={{width:"100%",background:T.surface2,border:"1px solid rgba(255,159,10,0.4)",color:T.text,padding:"8px 10px",borderRadius:8,fontSize:11,fontFamily:T.font,outline:"none",resize:"none",lineHeight:1.5,boxSizing:"border-box"}}/><div style={{display:"flex",gap:6,marginTop:5}}><button onMouseDown={e=>{e.preventDefault();saveNoteOverride(ex.name,noteEditValue);}} style={{flex:1,background:"rgba(255,159,10,0.15)",border:"1px solid rgba(255,159,10,0.3)",color:T.accent,padding:"5px 0",borderRadius:7,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Save</button><button onMouseDown={e=>{e.preventDefault();saveNoteToProgram(ex.name,noteEditValue);}} style={{flex:1,background:"rgba(255,159,10,0.10)",border:"1px solid rgba(255,159,10,0.25)",color:T.accent,padding:"5px 0",borderRadius:7,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Save to program</button>{noteOverrides[ex.name]&&<button onMouseDown={e=>{e.preventDefault();saveNoteOverride(ex.name,ex.note||"");}} style={{background:"none",border:"1px solid rgba(72,72,74,0.5)",color:T.dim,padding:"5px 8px",borderRadius:7,fontSize:11,cursor:"pointer",fontFamily:T.font}}>Reset</button>}<button onMouseDown={e=>{e.preventDefault();setEditingNote(null);}} style={{background:"none",border:"1px solid rgba(72,72,74,0.5)",color:T.dim,padding:"5px 8px",borderRadius:7,fontSize:11,cursor:"pointer",fontFamily:T.font}}>✕</button></div></div>}
                        {exSets.length>0&&(
                          <div style={{paddingLeft:30,display:"flex",flexWrap:"wrap",gap:5}}>
                            {exSets.map((s,i)=>{const df=(!exCardio&&s.diff)?DIFF[s.diff]:null; return (
                              <span key={i} data-no-row-click onClick={e=>{e.stopPropagation();startEditSet(ex.name,i);}} style={{display:"inline-flex",alignItems:"center",gap:4,background:editIdx===i&&activeEx===ex.name?T.accentDim:df?df.bg:T.surface2,border:`1px solid ${editIdx===i&&activeEx===ex.name?T.accent:df?df.color+"22":T.border2}`,borderRadius:10,padding:"6px 12px",fontSize:13,cursor:"pointer",boxShadow:"0 1px 2px rgba(0,0,0,0.2)"}}>
                                {exCardio?(<span style={{fontWeight:700,color:T.text,fontFamily:T.mono}}>{s.reps} <span style={{fontSize:11,fontWeight:400,color:T.dim}}>min</span></span>):(<><span style={{fontWeight:700,color:T.text,fontFamily:T.mono}}>{s.weight}</span><span style={{color:T.dim,fontSize:11}}>×</span><span style={{fontWeight:600,color:T.text,fontFamily:T.mono}}>{s.reps}</span>{df&&<span style={{fontSize:10,color:df.color,fontWeight:600,marginLeft:2}}>{df.label==="Just Right"?"👌":df.label==="Easy"?"🟢":"🔴"}</span>}{s.tempo&&<span title="slow & controlled" style={{fontSize:10,marginLeft:2}}>🐢</span>}</>)}
                                <button onClick={e=>{e.stopPropagation();removeSet(ex.name,i);}} style={{background:"none",border:"none",color:T.dim,fontSize:11,padding:"0 0 0 4px",cursor:"pointer",fontFamily:T.font}}>✕</button>
                              </span>);})}
                          </div>
                        )}
                        {!isActive&&exerciseNotes[ex.name]&&<div style={{paddingLeft:30,marginTop:4,fontSize:12,color:T.dim,fontStyle:"italic"}}>📝 {exerciseNotes[ex.name]}</div>}
                      </>}
                    </div>
                    {!reordering&&<div style={{display:"flex",gap:4,flexShrink:0}}>
                      {isCustom&&<button data-no-row-click onClick={e=>{e.stopPropagation();removeCustomExercise(customExercises.findIndex(c=>c.name===ex.name));}} style={{background:"none",border:`1.5px solid ${T.red}22`,color:T.red,padding:"6px 10px",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:T.font,opacity:0.7}}>✕</button>}
                      <button data-no-row-click onClick={e=>{e.stopPropagation();openExercise(ex.name);}} style={isActive?{background:"transparent",border:"none",color:"rgba(255,159,10,0.5)",fontSize:11,fontWeight:500,padding:"6px 12px",cursor:"pointer",fontFamily:T.font,letterSpacing:0.3}:{background:"rgba(255,159,10,0.08)",border:"1.5px solid rgba(255,159,10,0.25)",color:T.accent,padding:"8px 16px",borderRadius:10,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>{isActive?"Close":"+ Set"}</button>
                    </div>}
                  </div>

                  {isActive&&!reordering&&(
                    <div data-no-row-click onClick={e=>e.stopPropagation()} style={{paddingLeft:30,marginTop:14}}>
                      {(()=>{const DIFF_EMOJI={just_right:"👌",easy:"🟢",hard:"🔴"};const recent=findRecentSessions(ex.name);if(!recent.length)return null;return(<div style={{marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${T.border}`}}><div style={{fontSize:10,color:T.dim,fontWeight:600,letterSpacing:0.5,marginBottom:6}}>RECENT</div>{recent.map((r,i)=>{const label=r.dateLabel||r.date.slice(5);const row=exCardio?`${r.sets.reduce((a,s)=>a+(parseInt(s.reps)||0),0)} min`:r.sets.map(s=>{const em=s.diff?DIFF_EMOJI[s.diff]||"":"";return `${s.weight}×${s.reps}${em}`;}).join(" · ");return(<div key={i} style={{fontSize:11,color:T.sub,fontFamily:T.mono,lineHeight:1.6}}><span style={{color:T.dim}}>{label}</span>{" · "}{row}</div>);})}</div>);})()}
                      {!exCardio&&suggestion&&editIdx===null&&<div onClick={()=>setWeight(String(suggestion.weight))} style={{marginBottom:8,fontSize:12,color:T.accent,fontWeight:500,animation:"fadeIn .3s",cursor:"pointer",lineHeight:1.4}}>{"💡 "+suggestion.reason}{suggestion.weight?<span style={{color:T.dim,fontWeight:400}}>{"  · tap to set "+suggestion.weight+"lb"}</span>:null}</div>}
                      {!exCardio&&<div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                        <button onClick={()=>toggleControlFocus(activeEx)} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 11px",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:T.font,background:controlFocus[activeEx]?T.accentDim:T.surface3,color:controlFocus[activeEx]?T.accent:T.dim,border:`1.5px solid ${controlFocus[activeEx]?T.accent:"transparent"}`}}>🎯 Control focus{controlFocus[activeEx]?" · on":""}</button>
                        <button onClick={()=>setTempoSlow(v=>!v)} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 11px",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:T.font,background:tempoSlow?T.tealBg:T.surface3,color:tempoSlow?T.teal:T.dim,border:`1.5px solid ${tempoSlow?T.teal:"transparent"}`}}>🐢 Slow & controlled{tempoSlow?" · on":""}</button>
                      </div>}
                      <div style={{display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap",animation:"slideIn .2s ease"}}>
                        {!exCardio&&<div><div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:4}}>Weight</div><input ref={weightRef} type="number" inputMode="decimal" step="any" value={weight} onChange={e=>setWeight(e.target.value)} onFocus={e=>e.target.select()} onKeyDown={e=>{if(e.key==="Enter")repsRef.current?.focus();}} placeholder="0" style={{background:T.bg,border:`1.5px solid ${T.border2}`,color:T.text,padding:"12px 8px",width:80,borderRadius:10,textAlign:"center",fontSize:22,fontWeight:700,fontFamily:T.mono,outline:"none"}} /></div>}
                        <div><div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:4}}>{exCardio?"Minutes":"Reps"}</div><input ref={repsRef} type="number" inputMode="numeric" value={reps} onChange={e=>setReps(e.target.value)} onFocus={e=>e.target.select()} onKeyDown={e=>{if(e.key==="Enter")addOrUpdateSet();}} placeholder="0" style={{background:T.bg,border:`1.5px solid ${T.border2}`,color:T.text,padding:"12px 8px",width:exCardio?96:72,borderRadius:10,textAlign:"center",fontSize:22,fontWeight:700,fontFamily:T.mono,outline:"none"}} /></div>
                        {editIdx!==null&&<button onClick={()=>setEditIdx(null)} style={{background:T.surface,border:`1.5px solid ${T.border}`,color:T.dim,padding:"11px 14px",borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>}
                        {!exCardio&&editIdx===null&&exSets.length>0&&<span style={{fontSize:12,color:T.dim,alignSelf:"center",fontWeight:500}}>Set {exSets.length+1}/{ex.sets}</span>}
                      </div>
                      {/* Difficulty + Log in one row */}
                      <div style={{marginTop:10,display:"flex",alignItems:"center",gap:6}}>
                        {!exCardio&&<div style={{display:"flex",gap:5,flex:1}}>
                          {Object.entries(DIFF).map(([k,v])=>{
                            const sel=selectedDiff===k;
                            return <button key={k} onClick={()=>setSelectedDiff(k)} style={{flex:1,padding:"9px 6px",fontSize:11,fontWeight:sel?700:400,cursor:"pointer",fontFamily:T.font,background:sel?v.btnBg:T.surface3,color:sel?v.color:"rgba(174,174,178,0.95)",border:sel?`1.5px solid ${v.color}55`:"1.5px solid rgba(72,72,74,0.8)",borderRadius:10,transition:"all .15s",boxShadow:sel?`0 0 10px ${v.color}30`:"none",letterSpacing:0.2}}>{k==="just_right"?"👌 Solid":k==="easy"?"🟢 Easy":"🔴 Hard"}</button>;
                          })}
                        </div>}
                        <button onClick={addOrUpdateSet} disabled={!reps||((!exCardio)&&!weight)} className={(!reps||((!exCardio)&&!weight))?"":"cta-btn"} style={{background:(!reps||((!exCardio)&&!weight))?T.surface3:T.accentGradient,color:(!reps||((!exCardio)&&!weight))?T.dim:"#fff",border:"none",padding:"10px 24px",borderRadius:10,fontSize:14,fontWeight:700,cursor:(!reps||((!exCardio)&&!weight))?"default":"pointer",fontFamily:T.font,marginLeft:"auto",boxShadow:(!reps||((!exCardio)&&!weight))?"none":"0 2px 16px #FF9F0A40"}}>{editIdx!==null?"Update":"Log"}</button>
                      </div>
                      <input type="text" placeholder="Note (optional)" value={exerciseNotes[ex.name]||""} onChange={async e=>{const v=e.target.value;const u={...exerciseNotes,[ex.name]:v};setExerciseNotes(u);await store.set(`notes-${day}-draft`,u);}} style={{marginTop:8,width:"100%",background:T.bg,border:`1px solid ${T.border}`,color:T.sub,padding:"8px 12px",borderRadius:8,fontSize:12,fontFamily:T.font,outline:"none",boxSizing:"border-box"}} />
                    </div>
                  )}
                </div>
              );
            }))}

            {/* Add exercise / Reorder */}
            {reordering&&(
              <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.border}`,background:T.surface}}>
                <button onClick={()=>setReordering(false)} style={{width:"100%",padding:"14px 0",background:T.accentDim,border:`1.5px solid ${T.accent}`,borderRadius:10,color:T.accent,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Done Reordering</button>
              </div>
            )}
            {!reordering&&(<>
              {!showAddEx?(
                <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.border}`,background:T.surface,display:"flex",gap:8}}>
                  <button onClick={()=>{setShowAddEx(true);setTimeout(()=>addExFormRef.current?.scrollIntoView({behavior:"smooth",block:"nearest"}),150);}} style={{flex:1,padding:"14px 0",background:"transparent",border:`1.5px dashed ${T.border2}`,borderRadius:12,color:T.dim,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    <span style={{fontSize:20,color:T.accent,fontWeight:300}}>+</span> Add Exercise
                  </button>
                  <button onClick={()=>setReordering(true)} title="Reorder" style={{padding:"14px 16px",background:T.bg,border:`1.5px solid ${T.border}`,borderRadius:10,color:T.dim,fontSize:16,cursor:"pointer",fontFamily:T.font,flexShrink:0}}>⇅</button>
                </div>
              ):(
                <div ref={addExFormRef} style={{padding:"16px 20px",borderBottom:`1px solid ${T.border}`,background:T.accentLight,animation:"slideIn .2s ease"}}>
                  <div style={{fontSize:12,color:T.accent,fontWeight:600,marginBottom:10}}>Add Exercise</div>
                  <div style={{marginBottom:8}}><ExercisePicker value={newExName} onChange={setNewExName} onSelect={(name)=>{setNewExName(name);const cat=exerciseCatalog.find(e=>e.name.toLowerCase()===name.toLowerCase());setNewExCategory(cat?cat.category:"Other");}} catalog={exerciseCatalog} placeholder="Exercise name" dropUp={true} /></div>
                  {isCardio(newExName.trim())?(
                    <div style={{marginBottom:8}}><div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:3}}>Target duration (min)</div><input type="number" inputMode="numeric" value={newExReps} onChange={e=>setNewExReps(e.target.value)} placeholder="30" style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"9px",borderRadius:8,fontSize:14,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                  ):(
                    <div style={{display:"flex",gap:8,marginBottom:8}}>
                      <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:3}}>Sets</div><input type="number" inputMode="numeric" value={newExSets} onChange={e=>setNewExSets(e.target.value)} style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"9px",borderRadius:8,fontSize:14,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                      <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:3}}>Rep range</div><input type="text" value={newExReps} onChange={e=>setNewExReps(e.target.value)} placeholder="10-12" style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"9px",borderRadius:8,fontSize:14,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                    </div>
                  )}
                  {!isCardio(newExName.trim())&&<div style={{marginBottom:10}}>
                    <div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:5}}>Category</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {CATEGORIES.filter(c=>c!=="Cardio").map(cat=>(
                        <button key={cat} onClick={()=>setNewExCategory(cat)} style={{padding:"4px 10px",fontSize:11,fontWeight:newExCategory===cat?600:400,background:newExCategory===cat?T.accentDim:"transparent",border:`1px solid ${newExCategory===cat?T.accent:T.border}`,color:newExCategory===cat?T.accent:T.dim,borderRadius:6,cursor:"pointer",fontFamily:T.font}}>{cat}</button>
                      ))}
                    </div>
                  </div>}
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={addCustomExercise} disabled={!newExName.trim()} style={{flex:1,padding:"11px 0",background:!newExName.trim()?T.surface3:T.accentGradient,color:!newExName.trim()?T.dim:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:!newExName.trim()?"default":"pointer",fontFamily:T.font}}>Add</button>
                    <button onClick={()=>{setShowAddEx(false);setNewExName("");setNewExCategory("Other");}} style={{flex:1,padding:"11px 0",background:T.surface,border:`1.5px solid ${T.border}`,color:T.dim,borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                  </div>
                </div>
              )}
            </>)}

            {totalSets>0&&!reordering&&(
              <div style={{padding:20,borderTop:`1px solid ${T.border}`,background:T.surface}}>
                {allExercises.length>0&&(
                  <div style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <span style={{fontSize:11,color:T.dim,fontWeight:600,letterSpacing:0.5}}>PROGRESS</span>
                      <span style={{fontSize:11,color:doneCount===allExercises.length?T.accent:T.dim,fontWeight:600}}>{doneCount}/{allExercises.length}</span>
                    </div>
                    <div style={{height:3,background:T.surface3,borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${doneCount/allExercises.length*100}%`,background:T.accentGradient,transition:"width .4s ease",borderRadius:2,boxShadow:`0 0 6px ${T.accentGlow}`}} />
                    </div>
                  </div>
                )}
                <button onClick={()=>{setShowFinishModal(true);setFinishEnergy(0);setFinishSleep(0);setFinishWeight("");setFinishNotes("");}} className="cta-btn" style={{width:"100%",padding:16,background:T.accentGradient,color:"#fff",border:"none",borderRadius:14,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:T.font,boxShadow:"0 4px 24px #FF9F0A40",letterSpacing:0.3}}>Finish & Analyze</button>
                <div style={{display:"flex",justifyContent:"center",marginTop:10}}>
                  {clearConfirm===0&&<button onClick={()=>{setClearConfirm(1);setTimeout(()=>setClearConfirm(0),3000);}} style={{background:"none",border:"none",color:T.dim,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Clear all</button>}
                  {clearConfirm===1&&<button onClick={()=>{setClearConfirm(2);setTimeout(()=>setClearConfirm(0),3000);}} style={{background:"none",border:`1px solid ${T.red}`,color:T.red,fontSize:12,cursor:"pointer",fontFamily:T.font,borderRadius:6,padding:"4px 12px"}}>Are you sure?</button>}
                  {clearConfirm===2&&<button onClick={()=>{setClearConfirm(0);clearToday();}} style={{background:T.red,border:"none",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:T.font,borderRadius:6,padding:"4px 12px"}}>Yes, clear everything</button>}
                </div>
              </div>
            )}
          </>)}
        </>)}

        {view==="edit"&&(
          <div style={{padding:"16px 20px"}}>
            {/* Day selector — switch days without leaving Edit */}
            <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:2}}>
              {DAYS.map(d=>{
                const sel=d===day,isToday=d===today;
                const hasExercises=(getWorkout(d).exercises||[]).length>0;
                return(
                  <button key={d} onClick={()=>switchDay(d)} style={{flexShrink:0,padding:"7px 12px",borderRadius:8,fontSize:12,fontWeight:sel?700:400,cursor:"pointer",fontFamily:T.font,background:sel?T.accentGradient:"transparent",border:`1.5px solid ${sel?T.accent:isToday?T.green:T.border}`,color:sel?"#fff":isToday?T.green:hasExercises?T.sub:T.dim,position:"relative"}}>
                    {d.slice(0,3)}{isToday&&!sel&&<span style={{position:"absolute",top:2,right:3,width:4,height:4,borderRadius:"50%",background:T.green,display:"block"}} />}
                  </button>
                );
              })}
            </div>
            <div style={{background:T.yellowBg,border:"1.5px solid "+T.yellow+"44",borderRadius:10,padding:"12px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:16}}>⚠️</span>
              <div style={{fontSize:12,color:T.yellow,fontWeight:500,lineHeight:1.4}}>Editing your program template. Changes apply to all future {day} workouts.</div>
            </div>
            {!editingMeta ? (
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontSize:20,fontWeight:700,marginBottom:2}}>{w.label}</div>
                    <div style={{fontSize:13,color:T.sub}}>{w.sub}</div>
                    <div style={{fontSize:11,color:T.dim,marginTop:4}}>{day}</div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={function(){setEditingMeta(true);setEditLabel(w.label);setEditSub(w.sub);}} style={{background:"none",border:"1.5px solid "+T.border,color:T.sub,padding:"6px 12px",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:T.font}}>✏️ Name</button>
                    <button onClick={function(){toggleRestDay(day);}} style={{background:(w.exercises||[]).length===0?T.greenBg:"transparent",border:"1.5px solid "+((w.exercises||[]).length===0?T.green:T.border),color:(w.exercises||[]).length===0?T.green:T.sub,padding:"6px 12px",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:T.font}}>{(w.exercises||[]).length===0?"Make Training":"Make Rest"}</button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{marginBottom:16,padding:"14px",background:T.accentLight,border:"1.5px solid "+T.accent,borderRadius:10}}>
                <div style={{fontSize:10,color:T.accent,fontWeight:600,marginBottom:8}}>Edit Day Name</div>
                <div style={{marginBottom:6}}><div style={{fontSize:10,color:T.dim,marginBottom:3}}>Label</div><input type="text" value={editLabel} onChange={function(e){setEditLabel(e.target.value);}} placeholder="e.g. PUSH A" style={{width:"100%",background:T.surface,border:"1.5px solid "+T.border,color:T.text,padding:"9px 12px",borderRadius:8,fontSize:14,fontFamily:T.font,outline:"none"}} /></div>
                <div style={{marginBottom:10}}><div style={{fontSize:10,color:T.dim,marginBottom:3}}>Description</div><input type="text" value={editSub} onChange={function(e){setEditSub(e.target.value);}} placeholder="e.g. Chest, Shoulders, Triceps" style={{width:"100%",background:T.surface,border:"1.5px solid "+T.border,color:T.text,padding:"9px 12px",borderRadius:8,fontSize:13,fontFamily:T.font,outline:"none"}} /></div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={function(){saveDayMeta(day,editLabel,editSub);}} style={{flex:1,padding:"9px",background:T.accentGradient,color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Save</button>
                  <button onClick={function(){setEditingMeta(false);}} style={{flex:1,padding:"9px",background:T.surface,border:"1.5px solid "+T.border,color:T.dim,borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                </div>
              </div>
            )}
            {(getWorkout().exercises||[]).length===0 ? (
              <div style={{textAlign:"center",padding:"40px 20px",color:T.dim}}>
                <div style={{fontSize:32,marginBottom:8}}>🔋</div>
                <div style={{fontSize:14,fontWeight:600,marginBottom:6}}>Rest Day</div>
                <div style={{fontSize:12}}>Toggle above to make this a training day</div>
              </div>
            ) : (<>
            {(getWorkout().exercises||[]).map(function(ex,i) {
              if(editExIdx===i) return (
                <div key={i} style={{padding:"12px",background:T.accentLight,border:"1.5px solid "+T.accent,borderRadius:10,marginBottom:8}}>
                  <div style={{marginBottom:6}}><ExercisePicker value={editExName} onChange={setEditExName} onSelect={(name)=>setEditExName(name)} catalog={exerciseCatalog} /></div>
                  <div style={{display:"flex",gap:8,marginBottom:8}}>
                    <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,marginBottom:3}}>Sets</div><input type="number" inputMode="numeric" value={editExSets} onChange={function(e){setEditExSets(e.target.value);}} style={{width:"100%",background:T.surface,border:"1.5px solid "+T.border,color:T.text,padding:"7px",borderRadius:8,fontSize:13,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                    <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,marginBottom:3}}>Reps</div><input type="text" value={editExReps} onChange={function(e){setEditExReps(e.target.value);}} style={{width:"100%",background:T.surface,border:"1.5px solid "+T.border,color:T.text,padding:"7px",borderRadius:8,fontSize:13,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={function(){updateTemplateExercise(day,i,editExName,editExSets,editExReps);}} style={{flex:1,padding:"9px",background:T.accentGradient,color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Save</button>
                    <button onClick={function(){setEditExIdx(null);}} style={{flex:1,padding:"9px",background:T.surface,border:"1.5px solid "+T.border,color:T.dim,borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                  </div>
                </div>
              );
              return (
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid "+T.border}}>
                  <div><div style={{fontSize:13,fontWeight:500}}>{ex.name}</div><div style={{fontSize:11,color:T.dim}}>{ex.sets} x {ex.reps}</div></div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={function(){setEditExIdx(i);setEditExName(ex.name);setEditExSets(String(ex.sets));setEditExReps(ex.reps);}} style={{background:"none",border:"1.5px solid "+T.border,color:T.sub,padding:"5px 10px",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:T.font}}>Edit</button>
                    <button onClick={function(){removeTemplateExercise(day,i);}} style={{background:"none",border:"1.5px solid "+T.red+"33",color:T.red,padding:"5px 8px",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:T.font}}>✕</button>
                  </div>
                </div>
              );
            })}
            {!showAddTemplate ? (
              <button onClick={function(){setShowAddTemplate(true);setNewTemplateName("");setNewTemplateSets("3");setNewTemplateReps("10-12");}} style={{width:"100%",marginTop:12,padding:"12px",background:T.bg,border:"1.5px dashed "+T.border2,borderRadius:10,color:T.sub,fontSize:13,cursor:"pointer",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{fontSize:18,color:T.accent}}>+</span> Add to Template</button>
            ) : (
              <div style={{marginTop:12,padding:"12px",background:T.accentLight,border:"1.5px solid "+T.accent,borderRadius:10}}>
                <div style={{fontSize:10,color:T.accent,fontWeight:600,marginBottom:8}}>Add to Template</div>
                <div style={{marginBottom:6}}><ExercisePicker value={newTemplateName} onChange={setNewTemplateName} onSelect={(name)=>{setNewTemplateName(name);const cat=exerciseCatalog.find(e=>e.name.toLowerCase()===name.toLowerCase());setNewTemplateCategory(cat?cat.category:"Other");}} catalog={exerciseCatalog} placeholder="Exercise name" /></div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,marginBottom:3}}>Sets</div><input type="number" inputMode="numeric" value={newTemplateSets} onChange={function(e){setNewTemplateSets(e.target.value);}} style={{width:"100%",background:T.surface,border:"1.5px solid "+T.border,color:T.text,padding:"7px",borderRadius:8,fontSize:13,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                  <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,marginBottom:3}}>Reps</div><input type="text" value={newTemplateReps} onChange={function(e){setNewTemplateReps(e.target.value);}} style={{width:"100%",background:T.surface,border:"1.5px solid "+T.border,color:T.text,padding:"7px",borderRadius:8,fontSize:13,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                </div>
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:T.dim,marginBottom:5}}>Category</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {CATEGORIES.map(cat=>(
                      <button key={cat} onClick={function(){setNewTemplateCategory(cat);}} style={{padding:"4px 10px",fontSize:11,fontWeight:newTemplateCategory===cat?600:400,background:newTemplateCategory===cat?T.accentDim:"transparent",border:`1px solid ${newTemplateCategory===cat?T.accent:T.border}`,color:newTemplateCategory===cat?T.accent:T.dim,borderRadius:6,cursor:"pointer",fontFamily:T.font}}>{cat}</button>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={function(){if(!newTemplateName.trim())return;addTemplateExercise(day,newTemplateName,newTemplateSets,newTemplateReps);addToCatalog(newTemplateName,newTemplateCategory);setShowAddTemplate(false);setNewTemplateName("");setNewTemplateSets("3");setNewTemplateReps("10-12");setNewTemplateCategory("Other");}} disabled={!newTemplateName.trim()} style={{flex:1,padding:"9px",background:!newTemplateName.trim()?T.surface3:T.accentGradient,color:!newTemplateName.trim()?T.dim:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:!newTemplateName.trim()?"default":"pointer",fontFamily:T.font}}>Add</button>
                  <button onClick={function(){setShowAddTemplate(false);setNewTemplateCategory("Other");}} style={{flex:1,padding:"9px",background:T.surface,border:"1.5px solid "+T.border,color:T.dim,borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                </div>
              </div>
            )}
            </>)}
            {customWorkouts&&customWorkouts[day]&&<button onClick={function(){resetTemplate(day);}} style={{width:"100%",marginTop:10,padding:"10px",background:"transparent",border:"1.5px solid "+T.red+"33",color:T.red,borderRadius:10,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Reset to Default</button>}
            {(getWorkout().exercises||[]).length>0&&(<div style={{marginTop:10,padding:"14px",background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:11,color:T.dim,fontWeight:600,letterSpacing:0.5}}>SUPERSETS</div>
                <button onClick={()=>setShowSupersetCreator(true)} style={{background:T.accentGradient,border:"none",color:"#fff",padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>+ Create</button>
              </div>
              {getSupersets().length===0?(<div style={{fontSize:12,color:T.dim}}>Group exercises into supersets — no rest between them.</div>):(
                getSupersets().map((g,gi)=>(
                  <div key={gi} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                    <div style={{fontSize:12,color:T.sub}}><span style={{color:T.accent,fontWeight:700,marginRight:4}}>⚡</span>{g.join(" + ")}</div>
                    <button onClick={async()=>{const updated=getSupersets().filter((_,i)=>i!==gi);setTodaySupersets([]);await saveSupersets(day,updated);}} style={{background:"none",border:"none",color:T.red,fontSize:13,cursor:"pointer",padding:"0 4px"}}>✕</button>
                  </div>
                ))
              )}
              {showSupersetCreator&&(
                <div style={{marginTop:10,padding:"12px",background:T.accentLight,border:`1.5px solid ${T.accent}`,borderRadius:10}}>
                  <div style={{fontSize:11,color:T.accent,fontWeight:600,marginBottom:8}}>Select 2–3 exercises to superset</div>
                  <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10}}>
                    {getAllExercises().map(e=>{
                      const isSel=ssSelection.includes(e.name);
                      return(<button key={e.name} onClick={()=>setSsSelection(prev=>isSel?prev.filter(n=>n!==e.name):(prev.length<3?[...prev,e.name]:prev))} style={{textAlign:"left",padding:"8px 12px",background:isSel?T.accentDim:T.surface,border:`1.5px solid ${isSel?T.accent:T.border}`,borderRadius:8,color:isSel?T.accent:T.sub,fontSize:12,cursor:"pointer",fontFamily:T.font}}>{isSel?"✓ ":""}{e.name}</button>);
                    })}
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button disabled={ssSelection.length<2} onClick={async()=>{const updated=[...getSupersets(),ssSelection];setTodaySupersets([]);await saveSupersets(day,updated);setSsSelection([]);setShowSupersetCreator(false);}} style={{flex:1,padding:"9px",background:ssSelection.length<2?T.surface3:T.accentGradient,color:ssSelection.length<2?T.dim:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:ssSelection.length<2?"default":"pointer",fontFamily:T.font}}>Create Superset</button>
                    <button onClick={()=>{setShowSupersetCreator(false);setSsSelection([]);}} style={{flex:1,padding:"9px",background:T.surface,border:`1.5px solid ${T.border}`,color:T.dim,borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                  </div>
                </div>
              )}
            </div>)}
            <div style={{marginTop:16,padding:"14px",background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10}}>
              <div style={{fontSize:11,color:T.dim,fontWeight:600,marginBottom:10,letterSpacing:0.5}}>AI PROGRAM EDITOR</div>
              <div style={{fontSize:12,color:T.sub,marginBottom:12,lineHeight:1.5}}>Download today's template + history, upload to any AI (ChatGPT, Claude, etc.), then import the AI's response to update your targets.</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={downloadTemplateForAI} style={{flex:1,padding:"10px",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>⬇ Download</button>
                <button onClick={()=>aiImportRef.current?.click()} style={{flex:1,padding:"10px",background:T.accentGradient,color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>⬆ Upload Response</button>
              </div>
              <input ref={aiImportRef} type="file" accept=".json" style={{display:"none"}} onChange={e=>{if(e.target.files[0])importAITemplate(e.target.files[0]);e.target.value="";}} />
            </div>
            <div style={{marginTop:12,padding:"14px",background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:11,color:T.dim,fontWeight:600,letterSpacing:0.5}}>PROGRAMS</div>
                <button onClick={()=>setShowProgramManager(true)} style={{background:T.accentGradient,border:"none",color:"#fff",padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Manage</button>
              </div>
              {programs.length===0?(
                <div style={{fontSize:12,color:T.dim,lineHeight:1.5}}>Create a program (e.g. Push / Pull / Legs) to rotate workouts independent of the day of the week.</div>
              ):(
                <div>{programs.map(p=>{const ni=p.currentIdx%Math.max(1,p.workouts.length);const nw=p.workouts[ni];return(<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:6,marginBottom:6,borderBottom:`1px solid ${T.border}`}}><div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.name}</div><div style={{fontSize:11,color:T.dim}}>Next: {nw?.label||"—"} ({ni+1}/{p.workouts.length})</div></div></div>);})}</div>
              )}
            </div>
          </div>
        )}
        {view==="history"&&(
          <HistoryView history={history} onDelete={deleteHistoryEntry} onClearAll={clearAllHistory} onEdit={editHistoryEntry} exerciseCatalog={exerciseCatalog} addToCatalog={addToCatalog} />
        )}

        {view==="ledger"&&(
          <LedgerView history={history} />
        )}

        {view==="profile"&&(
          <div style={{padding:"24px 20px"}}>
            <div style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:2}}>{profile.name}</div>
            <div style={{fontSize:13,color:T.dim,marginBottom:0}}>Profile</div>

            {/* ── SETTINGS ── */}
            <div style={{fontSize:11,fontWeight:600,color:T.dim,letterSpacing:1,textTransform:"uppercase",marginTop:24,marginBottom:12}}>Settings</div>
            <div style={{borderTop:`1px solid ${T.border}`,paddingTop:16}}>
              <div style={{fontSize:11,color:T.dim,fontWeight:600,letterSpacing:0.5,marginBottom:10}}>REST TIMER</div>
              <div style={{display:"flex",gap:8}}>
                {[60,90,120].map(s=>(
                  <button key={s} onClick={async()=>{const u={...profile,restTime:s};onProfileUpdated(u);}} style={{flex:1,padding:"12px 0",background:(profile.restTime||90)===s?T.accentDim:"none",border:`1.5px solid ${(profile.restTime||90)===s?T.accent:T.border}`,color:(profile.restTime||90)===s?T.accent:T.sub,borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>{s}s</button>
                ))}
                <button onClick={()=>{const v=prompt("Custom rest time (seconds):",(profile.restTime||90).toString());const n=parseInt(v);if(n&&n>0){const u={...profile,restTime:n};onProfileUpdated(u);}}} style={{flex:1,padding:"12px 0",background:![60,90,120].includes(profile.restTime||90)?T.accentDim:"none",border:`1.5px solid ${![60,90,120].includes(profile.restTime||90)?T.accent:T.border}`,color:![60,90,120].includes(profile.restTime||90)?T.accent:T.sub,borderRadius:10,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>{![60,90,120].includes(profile.restTime||90)?`${profile.restTime}s`:"Custom"}</button>
              </div>
            </div>

            <div style={{borderTop:`1px solid ${T.border}`,paddingTop:16,marginTop:16}}>
              <div style={{fontSize:11,color:T.dim,fontWeight:600,letterSpacing:0.5,marginBottom:10}}>TRAINING PHASE</div>
              <div style={{display:"flex",gap:8}}>
                {["Bulk","Cut","Maintain"].map(p=>{const active=(profile.phase||null)===p;return(
                  <button key={p} onClick={()=>onProfileUpdated({...profile,phase:active?null:p})} style={{flex:1,padding:"12px 0",background:active?T.accentDim:"none",border:`1.5px solid ${active?T.accent:T.border}`,color:active?T.accent:T.sub,borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>{p}</button>
                );})}
              </div>
            </div>

            <div style={{borderTop:`1px solid ${T.border}`,paddingTop:16,marginTop:16}}>
              <div style={{fontSize:11,color:T.dim,fontWeight:600,letterSpacing:0.5,marginBottom:10}}>HISTORY IN LOG EXPORT</div>
              <div style={{display:"flex",gap:8}}>
                {[3,5,8,10].map(n=>{const active=(profile.historyN||5)===n;return(
                  <button key={n} onClick={()=>onProfileUpdated({...profile,historyN:n})} style={{flex:1,padding:"12px 0",background:active?T.accentDim:"none",border:`1.5px solid ${active?T.accent:T.border}`,color:active?T.accent:T.sub,borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>{n}</button>
                );})}
              </div>
            </div>

            {/* ── DATA ── */}
            <div style={{fontSize:11,fontWeight:600,color:T.dim,letterSpacing:1,textTransform:"uppercase",marginTop:24,marginBottom:12}}>Data</div>
            <div style={{borderTop:`1px solid ${T.border}`,paddingTop:16,display:"flex",flexDirection:"column",gap:10}}>
              {activeProfileId==="peter"&&(
                <button onClick={()=>manualSync()} style={{width:"100%",background:syncing?T.accentDim:"none",border:`1.5px solid ${syncing?T.accent:T.border}`,color:syncing?T.accent:T.sub,padding:"13px 0",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>↻ {syncing?"Syncing…":"Sync from Sheets"}</button>
              )}
              <div style={{display:"flex",gap:8}}>
                <button onClick={backupProfile} style={{flex:1,background:"none",border:"1.5px solid "+T.border,color:T.sub,padding:"13px 0",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>⬇ Backup</button>
                <label style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:"1.5px solid "+T.border,color:T.sub,padding:"13px 0",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>
                  ⬆ Restore<input type="file" accept=".json" style={{display:"none"}} onChange={e=>{if(e.target.files[0])restoreFromBackup(e.target.files[0]);e.target.value="";}} />
                </label>
              </div>
              <button onClick={openPlanEditor} style={{width:"100%",background:"none",border:"1.5px solid "+T.border,color:T.sub,padding:"13px 0",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Edit Workout Plan (JSON)</button>
            </div>

            {/* ── DRAFTS ── */}
            {(()=>{
              void draftsRefresh; // subscribe to refresh counter
              const prefix=`wl_${activeProfileId}_`;
              const raw=k=>{try{const v=localStorage.getItem(prefix+k);return v?JSON.parse(v):null;}catch{return null;}};
              const drafts=DAYS.map(d=>{
                const s=raw(`sets-${d}-draft`);
                if(!s||!Object.keys(s).length)return null;
                const wst=raw(`workout-start-${d}-draft`);
                const dl=wst?new Date(wst).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}):d;
                const setCount=Object.values(s).reduce((a,v)=>a+v.length,0);
                const vol=Math.round(Object.values(s).reduce((a,v)=>a+v.reduce((b,sv)=>b+(parseFloat(sv.weight)||0)*(parseInt(sv.reps)||0),0),0));
                return {d,dl,setCount,vol};
              }).filter(Boolean);
              if(!drafts.length)return null;
              return (<>
                <div style={{fontSize:11,fontWeight:600,color:T.dim,letterSpacing:1,textTransform:"uppercase",marginTop:24,marginBottom:12}}>Drafts</div>
                <div style={{borderTop:`1px solid ${T.border}`,paddingTop:16,display:"flex",flexDirection:"column",gap:10}}>
                  {drafts.map(({d,dl,setCount,vol})=>(
                    <div key={d} style={{background:T.surface2,borderRadius:10,padding:"12px 14px",border:`1px solid ${T.border2}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                        <div>
                          <div style={{fontSize:14,fontWeight:700,color:T.text}}>{d}</div>
                          <div style={{fontSize:12,color:T.sub,marginTop:1}}>{dl}</div>
                        </div>
                        <div style={{fontSize:12,color:T.dim,fontFamily:T.mono,textAlign:"right"}}>{setCount} sets<br/>{vol.toLocaleString()} lb</div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={()=>saveDraftForDay(d)} style={{flex:1,background:"rgba(255,159,10,0.15)",border:"1px solid rgba(255,159,10,0.35)",color:T.accent,padding:"9px 0",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Save</button>
                        {discardConfirmDay===d
                          ? <button onClick={()=>discardDraftForDay(d)} style={{flex:1,background:T.red,border:"none",color:"#fff",padding:"9px 0",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Sure? Delete {setCount} sets</button>
                          : <button onClick={()=>setDiscardConfirmDay(d)} style={{flex:1,background:"rgba(255,159,10,0.08)",border:"1px solid rgba(255,159,10,0.28)",color:T.accent,padding:"9px 0",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Discard</button>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </>);
            })()}

            {/* ── ACCOUNT ── */}
            <div style={{fontSize:11,fontWeight:600,color:T.dim,letterSpacing:1,textTransform:"uppercase",marginTop:24,marginBottom:12}}>Account</div>
            <div style={{borderTop:`1px solid ${T.border}`,paddingTop:16,display:"flex",flexDirection:"column",gap:10}}>
              <button onClick={()=>{onLogout();}} style={{width:"100%",background:"none",border:`1.5px solid ${T.border}`,color:T.sub,padding:"13px 0",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Switch Profile</button>
              {confirmDeleteProfile ? (
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setConfirmDeleteProfile(false)} style={{flex:1,background:"none",border:"1.5px solid "+T.border,color:T.sub,padding:"13px 0",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                  <button onClick={async()=>{const pid=activeProfileId;const kill=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(`wl_${pid}_`))kill.push(k);}kill.forEach(k=>localStorage.removeItem(k));const profiles=(getShared("profiles")||[]).filter(p=>p.id!==pid);setShared("profiles",profiles);setShared("active-profile",null);setConfirmDeleteProfile(false);onLogout();}} style={{flex:1,background:T.red,border:"none",color:"#fff",padding:"13px 0",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Delete</button>
                </div>
              ) : (
                <button onClick={()=>setConfirmDeleteProfile(true)} style={{width:"100%",background:"none",border:`1.5px solid ${T.red}`,color:T.red,padding:"13px 0",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Delete Profile…</button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ═══ BOTTOM NAV ═══ */}
      <div className="bottom-nav" style={{position:"fixed",bottom:0,left:0,right:0,background:T.surface,borderTop:`1px solid ${T.border}`,boxShadow:"0 -2px 10px rgba(0,0,0,0.3)",display:"flex",alignItems:"flex-start",zIndex:100,maxWidth:540,margin:"0 auto"}}>
        {[
          {v:"log",label:"Log",svg:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1.5" y="8.5" width="5" height="7" rx="1.5"/><rect x="17.5" y="8.5" width="5" height="7" rx="1.5"/><line x1="6.5" y1="12" x2="17.5" y2="12" strokeWidth="2.5"/></svg>},
          {v:"history",label:"History",svg:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>},
          {v:"ledger",label:"Ledger",svg:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"/><path d="M5 20V10l7-7 7 7v10"/><path d="M9 20v-5h6v5"/></svg>},
          {v:"edit",label:"Edit",svg:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>},
          {v:"profile",label:"Profile",svg:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>},
        ].map(({v,label,svg})=>(
          <button key={v} onClick={()=>{setView(v);if(v==="edit"){setReordering(false);setEditExIdx(null);setEditingMeta(false);}}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"none",border:"none",cursor:"pointer",fontFamily:T.font,gap:2,color:view===v?T.accent:T.dim,padding:"8px 0",position:"relative"}}>
            {svg}
            <span style={{fontSize:9,fontWeight:view===v?700:500,letterSpacing:0.2,fontFamily:view===v?"-apple-system,system-ui,sans-serif":T.font}}>{label.toUpperCase()}</span>
            {view===v&&<div style={{width:16,height:2,background:T.accent,marginTop:1}} />}
          </button>
        ))}
      </div>
    </div>
    </>
  );
}

// ─── PROGRAM PICKER CARD ────────────────────────────────────────────────────
function ProgramPickerCard({programs, onStart}) {
  const [minimized, setMinimized] = useState(false);
  const visible = programs.filter(p => p.workouts && p.workouts.length > 0);
  if(!visible.length) return null;
  if(minimized) return (
    <div style={{margin:"12px 16px 4px"}}>
      <button onClick={()=>setMinimized(false)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"9px 14px",cursor:"pointer",fontFamily:T.font}}>
        <span style={{fontSize:12,color:T.dim,fontWeight:500}}>Programs</span>
        <span style={{fontSize:11,color:T.accent,fontWeight:600}}>Show ▾</span>
      </button>
    </div>
  );
  return (
    <div style={{margin:"12px 16px 4px"}}>
      {visible.map(prog => {
        const nextIdx = prog.currentIdx % prog.workouts.length;
        return (
          <div key={prog.id} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,marginBottom:8,overflow:"hidden"}}>
            <div style={{padding:"10px 14px 8px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:10,color:T.accent,fontWeight:600,letterSpacing:0.5}}>{prog.name.toUpperCase()}</div>
                <div style={{fontSize:11,color:T.dim,marginTop:1}}>Tap a workout to start</div>
              </div>
              <button onClick={()=>setMinimized(true)} style={{background:"none",border:`1px solid ${T.border}`,color:T.dim,padding:"4px 9px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:T.font}}>Hide ▴</button>
            </div>
            <div style={{padding:"8px 12px 10px"}}>
              {prog.workouts.map((w,wi)=>(
                <button key={wi} onClick={()=>onStart(prog.id,wi)} style={{display:"flex",width:"100%",justifyContent:"space-between",alignItems:"center",background:wi===nextIdx?T.accentLight:"transparent",border:`1.5px solid ${wi===nextIdx?T.accent:T.border}`,borderRadius:10,padding:"10px 14px",marginBottom:5,cursor:"pointer",fontFamily:T.font,textAlign:"left",boxSizing:"border-box"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:700,color:wi===nextIdx?T.accent:T.text}}>{w.label}</div>
                    {w.sub&&<div style={{fontSize:11,color:T.dim,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.sub}</div>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0,marginLeft:10}}>
                    {wi===nextIdx&&<span style={{fontSize:9,color:T.accent,fontWeight:700,letterSpacing:0.5,background:T.accentDim,padding:"3px 7px",borderRadius:4}}>NEXT</span>}
                    <span style={{fontSize:11,color:T.dim}}>{(w.exercises||[]).length} ex</span>
                    <span style={{fontSize:15,color:wi===nextIdx?T.accent:T.dim}}>▶</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PROGRAM MANAGER OVERLAY ─────────────────────────────────────────────────
function ProgramManagerOverlay({programs, onSave, onClose, customWorkouts, exerciseCatalog}) {
  const [progs, setProgs] = useState(() => programs.map(p => ({...p, workouts: p.workouts.map(w => ({...w, exercises: (w.exercises||[]).map(e => ({...e}))}))})));
  const [expandedId, setExpandedId] = useState(null);
  const [showNewProg, setShowNewProg] = useState(false);
  const [newProgName, setNewProgName] = useState("");
  // Add workout form
  const [addingWorkoutTo, setAddingWorkoutTo] = useState(null);
  const [wLabel, setWLabel] = useState("");
  const [wSub, setWSub] = useState("");
  const [wTemplate, setWTemplate] = useState("");
  // Exercise edit sub-screen
  const [editingExKey, setEditingExKey] = useState(null); // {progId, wi}
  const [addExName, setAddExName] = useState("");
  const [addExSets, setAddExSets] = useState("3");
  const [addExReps, setAddExReps] = useState("10-12");
  const [showAddEx, setShowAddEx] = useState(false);

  function save(updated) { setProgs(updated); onSave(updated); }

  function addProgram() {
    if(!newProgName.trim()) return;
    const np = {id:"p-"+Date.now(), name:newProgName.trim(), currentIdx:0, workouts:[]};
    const updated = [...progs, np];
    save(updated); setShowNewProg(false); setNewProgName(""); setExpandedId(np.id);
  }

  function deleteProgram(id) {
    save(progs.filter(p => p.id !== id));
    if(expandedId === id) setExpandedId(null);
  }

  function addWorkout(progId) {
    if(!wLabel.trim()) return;
    let exercises = [];
    if(wTemplate) {
      const dw = (customWorkouts&&customWorkouts[wTemplate]) || DEFAULT_WORKOUTS[wTemplate] || {exercises:[]};
      exercises = (dw.exercises||[]).map(e => ({...e}));
    }
    const nw = {id:"w-"+Date.now(), label:wLabel.trim().toUpperCase(), sub:wSub.trim(), exercises};
    const updated = progs.map(p => p.id===progId ? {...p, workouts:[...p.workouts, nw]} : p);
    save(updated);
    const newWi = updated.find(p=>p.id===progId).workouts.length - 1;
    setAddingWorkoutTo(null); setWLabel(""); setWSub(""); setWTemplate("");
    setEditingExKey({progId, wi: newWi}); setShowAddEx(true);
  }

  function removeWorkout(progId, wi) {
    if(editingExKey&&editingExKey.progId===progId&&editingExKey.wi===wi) setEditingExKey(null);
    const updated = progs.map(p => {
      if(p.id!==progId) return p;
      const ws = p.workouts.filter((_,i) => i!==wi);
      return {...p, workouts:ws, currentIdx:Math.min(p.currentIdx, Math.max(0,ws.length-1))};
    });
    save(updated);
  }

  function moveWorkout(progId, wi, dir) {
    const updated = progs.map(p => {
      if(p.id!==progId) return p;
      const ws = [...p.workouts]; const ni = wi+dir;
      if(ni<0||ni>=ws.length) return p;
      [ws[wi],ws[ni]] = [ws[ni],ws[wi]];
      return {...p, workouts:ws};
    });
    save(updated);
  }

  function setNext(progId, wi) { save(progs.map(p => p.id===progId ? {...p, currentIdx:wi} : p)); }

  function addExToWorkout() {
    if(!addExName.trim()||!editingExKey) return;
    const {progId, wi} = editingExKey;
    const ex = {name:addExName.trim(), sets:parseInt(addExSets)||3, reps:addExReps||"10-12"};
    const updated = progs.map(p => {
      if(p.id!==progId) return p;
      const ws = [...p.workouts];
      ws[wi] = {...ws[wi], exercises:[...(ws[wi].exercises||[]), ex]};
      return {...p, workouts:ws};
    });
    save(updated); setAddExName(""); setAddExSets("3"); setAddExReps("10-12");
  }

  function removeExFromWorkout(ei) {
    if(!editingExKey) return;
    const {progId, wi} = editingExKey;
    const updated = progs.map(p => {
      if(p.id!==progId) return p;
      const ws = [...p.workouts];
      ws[wi] = {...ws[wi], exercises:(ws[wi].exercises||[]).filter((_,i)=>i!==ei)};
      return {...p, workouts:ws};
    });
    save(updated);
  }

  const templateDays = DAYS.filter(d => ((customWorkouts&&customWorkouts[d])||DEFAULT_WORKOUTS[d]||{exercises:[]}).exercises.length > 0);

  // ── Exercise sub-screen ──
  if(editingExKey) {
    const prog = progs.find(p=>p.id===editingExKey.progId);
    const w = prog?.workouts[editingExKey.wi];
    if(!prog||!w){setEditingExKey(null);return null;}
    return (
      <div style={{position:"fixed",inset:0,zIndex:200,background:T.bg,display:"flex",flexDirection:"column",maxWidth:540,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px 12px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>{setEditingExKey(null);setShowAddEx(false);setExpandedId(editingExKey.progId);}} style={{background:"none",border:"none",color:T.accent,fontSize:22,cursor:"pointer",padding:0,lineHeight:1,fontFamily:T.font}}>←</button>
            <div>
              <div style={{fontSize:10,color:T.dim}}>{prog.name}</div>
              <div style={{fontSize:17,fontWeight:700,color:T.text}}>{w.label}{w.sub&&<span style={{fontSize:12,color:T.dim,fontWeight:400,marginLeft:8}}>{w.sub}</span>}</div>
            </div>
          </div>
          <button onClick={()=>{setEditingExKey(null);setShowAddEx(false);onClose();}} style={{background:"none",border:"none",color:T.dim,fontSize:22,cursor:"pointer",padding:"0 4px",lineHeight:1}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"12px 16px"}}>
          {(w.exercises||[]).length===0&&!showAddEx&&(
            <div style={{textAlign:"center",padding:"40px 24px",color:T.dim}}>
              <div style={{fontSize:32,marginBottom:8}}>🏋️</div>
              <div style={{fontSize:13}}>No exercises yet. Tap "+ Add Exercise" below.</div>
            </div>
          )}
          {(w.exercises||[]).map((ex,ei)=>(
            <div key={ei} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",background:T.surface,borderRadius:10,marginBottom:8,border:`1px solid ${T.border}`}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>{ex.name}</div>
                <div style={{fontSize:11,color:T.dim}}>{ex.sets} × {ex.reps}</div>
              </div>
              <button onClick={()=>removeExFromWorkout(ei)} style={{background:"none",border:`1px solid ${T.red}33`,color:T.red,padding:"5px 9px",borderRadius:7,fontSize:12,cursor:"pointer",fontFamily:T.font}}>✕</button>
            </div>
          ))}
          {showAddEx?(
            <div style={{padding:"14px",background:T.accentLight,border:`1.5px solid ${T.accent}`,borderRadius:10,marginTop:4}}>
              <div style={{fontSize:11,color:T.accent,fontWeight:600,marginBottom:10}}>Add Exercise</div>
              <div style={{marginBottom:8}}>
                <ExercisePicker value={addExName} onChange={setAddExName} onSelect={n=>setAddExName(n)} catalog={exerciseCatalog||[]} placeholder="Exercise name" />
              </div>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,marginBottom:3}}>Sets</div><input type="number" inputMode="numeric" value={addExSets} onChange={e=>setAddExSets(e.target.value)} style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"9px",borderRadius:8,fontSize:15,fontFamily:T.mono,outline:"none",textAlign:"center",boxSizing:"border-box"}} /></div>
                <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,marginBottom:3}}>Reps</div><input type="text" value={addExReps} onChange={e=>setAddExReps(e.target.value)} placeholder="10-12" style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"9px",borderRadius:8,fontSize:15,fontFamily:T.mono,outline:"none",textAlign:"center",boxSizing:"border-box"}} /></div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={addExToWorkout} disabled={!addExName.trim()} style={{flex:2,padding:"11px",background:!addExName.trim()?T.surface3:T.accentGradient,color:!addExName.trim()?T.dim:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Add</button>
                <button onClick={()=>{setShowAddEx(false);setAddExName("");setAddExSets("3");setAddExReps("10-12");}} style={{flex:1,padding:"11px",background:T.surface,border:`1.5px solid ${T.border}`,color:T.dim,borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:T.font}}>Done</button>
              </div>
            </div>
          ):(
            <button onClick={()=>setShowAddEx(true)} style={{width:"100%",padding:"13px",background:"transparent",border:`1.5px dashed ${T.border2}`,borderRadius:10,color:T.sub,fontSize:13,cursor:"pointer",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:4}}><span style={{fontSize:18,color:T.accent,fontWeight:300}}>+</span> Add Exercise</button>
          )}
        </div>
      </div>
    );
  }

  // ── Program list screen ──
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,background:T.bg,display:"flex",flexDirection:"column",maxWidth:540,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 20px 12px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{fontSize:17,fontWeight:700,color:T.text}}>Programs</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setShowNewProg(true)} style={{background:T.accentGradient,border:"none",color:"#fff",padding:"7px 14px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>+ New</button>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.dim,fontSize:22,cursor:"pointer",padding:"0 4px",lineHeight:1}}>✕</button>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 16px"}}>
        {showNewProg&&(
          <div style={{background:T.accentLight,border:`1.5px solid ${T.accent}`,borderRadius:10,padding:"12px",marginBottom:12}}>
            <div style={{fontSize:11,color:T.accent,fontWeight:600,marginBottom:8}}>New Program</div>
            <input type="text" value={newProgName} onChange={e=>setNewProgName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addProgram();}} placeholder="e.g. Push / Pull / Legs" autoFocus style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"10px 12px",borderRadius:8,fontSize:14,fontFamily:T.font,outline:"none",boxSizing:"border-box",marginBottom:8}} />
            <div style={{display:"flex",gap:6}}>
              <button onClick={addProgram} disabled={!newProgName.trim()} style={{flex:1,padding:"9px",background:!newProgName.trim()?T.surface3:T.accentGradient,color:!newProgName.trim()?T.dim:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Create</button>
              <button onClick={()=>{setShowNewProg(false);setNewProgName("");}} style={{flex:1,padding:"9px",background:T.surface,border:`1.5px solid ${T.border}`,color:T.dim,borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
            </div>
          </div>
        )}
        {progs.length===0&&!showNewProg&&(
          <div style={{textAlign:"center",padding:"60px 24px",color:T.dim}}>
            <div style={{fontSize:40,marginBottom:12}}>🔄</div>
            <div style={{fontSize:15,fontWeight:700,color:T.sub,marginBottom:8}}>No programs yet</div>
            <div style={{fontSize:12,lineHeight:1.6}}>Create a program to rotate through workouts like Push / Pull / Legs, independent of the day of the week.</div>
          </div>
        )}
        {progs.map(prog => {
          const nextIdx = prog.currentIdx % Math.max(1, prog.workouts.length);
          const isExp = expandedId === prog.id;
          return (
            <div key={prog.id} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,marginBottom:12,overflow:"hidden"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",borderBottom:isExp?`1px solid ${T.border}`:"none"}}>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:T.text}}>{prog.name}</div>
                  <div style={{fontSize:11,color:T.dim,marginTop:2}}>{prog.workouts.length} workout{prog.workouts.length!==1?"s":""}{prog.workouts.length>0?` · next: ${prog.workouts[nextIdx]?.label||"—"}`:""}</div>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <button onClick={()=>setExpandedId(isExp?null:prog.id)} style={{background:isExp?T.accentDim:"none",border:`1.5px solid ${isExp?T.accent:T.border}`,color:isExp?T.accent:T.sub,padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:isExp?600:400,cursor:"pointer",fontFamily:T.font}}>{isExp?"Done":"Edit"}</button>
                  <button onClick={()=>deleteProgram(prog.id)} style={{background:"none",border:`1.5px solid ${T.red}33`,color:T.red,padding:"6px 8px",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:T.font}}>✕</button>
                </div>
              </div>
              {isExp&&(
                <div style={{padding:"12px 16px"}}>
                  {prog.workouts.length===0&&!addingWorkoutTo&&<div style={{textAlign:"center",padding:"20px 0",color:T.dim,fontSize:13}}>No workouts yet. Add one below.</div>}
                  {prog.workouts.map((w,wi)=>(
                    <div key={w.id||wi} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:wi===nextIdx?T.accent:T.text}}>{w.label}{wi===nextIdx&&<span style={{fontSize:9,color:T.accent,fontWeight:700,marginLeft:8,background:T.accentDim,padding:"2px 6px",borderRadius:4}}>NEXT</span>}</div>
                        {w.sub&&<div style={{fontSize:11,color:T.dim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.sub}</div>}
                        <div style={{fontSize:10,color:T.dim,marginTop:1}}>{(w.exercises||[]).length} exercise{(w.exercises||[]).length!==1?"s":""}</div>
                      </div>
                      <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0,marginLeft:8}}>
                        <button onClick={()=>{setEditingExKey({progId:prog.id,wi});setShowAddEx(false);}} style={{background:"none",border:`1.5px solid ${T.border}`,color:T.sub,padding:"5px 9px",borderRadius:7,fontSize:11,cursor:"pointer",fontFamily:T.font}}>Exercises</button>
                        <button onClick={()=>setNext(prog.id,wi)} title="Set as next" style={{background:wi===nextIdx?T.accentGradient:"none",border:`1.5px solid ${wi===nextIdx?T.accent:T.border}`,color:wi===nextIdx?"#fff":T.dim,width:26,height:26,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:10}}>▶</button>
                        <button onClick={()=>moveWorkout(prog.id,wi,-1)} disabled={wi===0} style={{background:"none",border:`1px solid ${T.border}`,color:wi===0?T.dim:T.sub,padding:"4px 7px",borderRadius:6,fontSize:11,cursor:wi===0?"default":"pointer",fontFamily:T.font}}>↑</button>
                        <button onClick={()=>moveWorkout(prog.id,wi,1)} disabled={wi===prog.workouts.length-1} style={{background:"none",border:`1px solid ${T.border}`,color:wi===prog.workouts.length-1?T.dim:T.sub,padding:"4px 7px",borderRadius:6,fontSize:11,cursor:wi===prog.workouts.length-1?"default":"pointer",fontFamily:T.font}}>↓</button>
                        <button onClick={()=>removeWorkout(prog.id,wi)} style={{background:"none",border:`1px solid ${T.red}33`,color:T.red,padding:"4px 7px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:T.font}}>✕</button>
                      </div>
                    </div>
                  ))}
                  {addingWorkoutTo===prog.id?(
                    <div style={{marginTop:12,padding:"12px",background:T.accentLight,border:`1.5px solid ${T.accent}`,borderRadius:10}}>
                      <div style={{fontSize:11,color:T.accent,fontWeight:600,marginBottom:8}}>New Workout</div>
                      <div style={{marginBottom:6}}>
                        <div style={{fontSize:10,color:T.dim,marginBottom:3}}>Label (e.g. PUSH)</div>
                        <input type="text" value={wLabel} onChange={e=>setWLabel(e.target.value)} placeholder="PUSH" autoFocus style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"9px 12px",borderRadius:8,fontSize:15,fontFamily:T.font,outline:"none",boxSizing:"border-box"}} />
                      </div>
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:10,color:T.dim,marginBottom:3}}>Description (optional)</div>
                        <input type="text" value={wSub} onChange={e=>setWSub(e.target.value)} placeholder="Chest · Shoulders · Triceps" style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"8px 12px",borderRadius:8,fontSize:12,fontFamily:T.font,outline:"none",boxSizing:"border-box"}} />
                      </div>
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:10,color:T.dim,marginBottom:5}}>Copy exercises from day (optional)</div>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                          <button onClick={()=>setWTemplate("")} style={{padding:"4px 10px",fontSize:11,fontWeight:wTemplate===""?600:400,background:wTemplate===""?T.accentDim:"transparent",border:`1px solid ${wTemplate===""?T.accent:T.border}`,color:wTemplate===""?T.accent:T.dim,borderRadius:6,cursor:"pointer",fontFamily:T.font}}>None</button>
                          {templateDays.map(d=>{const dw=(customWorkouts&&customWorkouts[d])||DEFAULT_WORKOUTS[d]||{label:d};return<button key={d} onClick={()=>setWTemplate(d)} style={{padding:"4px 10px",fontSize:11,fontWeight:wTemplate===d?600:400,background:wTemplate===d?T.accentDim:"transparent",border:`1px solid ${wTemplate===d?T.accent:T.border}`,color:wTemplate===d?T.accent:T.dim,borderRadius:6,cursor:"pointer",fontFamily:T.font}}>{dw.label||d.slice(0,3)}</button>;})}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <button onClick={()=>addWorkout(prog.id)} disabled={!wLabel.trim()} style={{flex:2,padding:"9px",background:!wLabel.trim()?T.surface3:T.accentGradient,color:!wLabel.trim()?T.dim:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Next: Add Exercises →</button>
                        <button onClick={()=>{setAddingWorkoutTo(null);setWLabel("");setWSub("");setWTemplate("");}} style={{flex:1,padding:"9px",background:T.surface,border:`1.5px solid ${T.border}`,color:T.dim,borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                      </div>
                    </div>
                  ):(
                    <button onClick={()=>{setAddingWorkoutTo(prog.id);setWLabel("");setWSub("");setWTemplate("");}} style={{width:"100%",marginTop:10,padding:"11px",background:"transparent",border:`1.5px dashed ${T.border2}`,borderRadius:8,color:T.sub,fontSize:13,cursor:"pointer",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><span style={{fontSize:16,color:T.accent,fontWeight:300}}>+</span> Add Workout</button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── EXERCISE PICKER ─────────────────────────────────────────────────────────
function ExercisePicker({value, onChange, onSelect, catalog, placeholder, dropUp}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const query = (value || "").toLowerCase();
  const filtered = query.length > 0
    ? catalog.filter(e => e.name.toLowerCase().includes(query) || e.category.toLowerCase().includes(query)).slice(0, 50)
    : catalog;
  const groups = {};
  filtered.forEach(e => { if(!groups[e.category]) groups[e.category] = []; groups[e.category].push(e); });
  const dropStyle = dropUp
    ? {position:"absolute",bottom:"calc(100% + 4px)",left:0,right:0,zIndex:100,background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:10,maxHeight:260,overflowY:"auto",boxShadow:"0 -8px 24px rgba(0,0,0,0.4)",overscrollBehavior:"contain"}
    : {position:"absolute",top:"100%",left:0,right:0,zIndex:100,background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:10,marginTop:4,maxHeight:260,overflowY:"auto",boxShadow:"0 8px 24px rgba(0,0,0,0.4)",overscrollBehavior:"contain"};
  return (
    <div style={{position:"relative"}}>
      <input
        type="text" value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => { closeTimer.current = setTimeout(() => setOpen(false), 200); }}
        placeholder={placeholder || "Exercise name"}
        autoComplete="off"
        style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"11px 14px",borderRadius:8,fontSize:14,fontFamily:T.font,outline:"none"}}
      />
      {open && filtered.length > 0 && (
        <div style={dropStyle}>
          {Object.entries(groups).map(([cat, exercises]) => (
            <div key={cat}>
              <div style={{padding:"6px 14px",fontSize:10,fontWeight:600,color:T.accent,background:T.surface2}}>{cat}</div>
              {exercises.map(e => (
                <div key={e.name}
                  onMouseDown={ev => { ev.preventDefault(); clearTimeout(closeTimer.current); onSelect(e.name); setOpen(false); }}
                  style={{padding:"10px 14px",fontSize:13,color:T.text,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.border}`}}>
                  <span>{e.name}</span>
                  <span style={{fontSize:10,color:T.dim}}>{cat}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── HISTORY ─────────────────────────────────────────────────────────────────
function HistoryView({history, onDelete, onClearAll, onEdit, exerciseCatalog, addToCatalog}) {
  const histEntries = Object.entries(history).map(([key, val]) => ({key, ...val})).sort((a,b) => new Date(b.date)-new Date(a.date));
  const [expanded,setExpanded]=useState(null);
  const [hv,setHv]=useState("sessions");
  const [selectedExercise,setSelectedExercise]=useState(null);
  const [confirmClear,setConfirmClear]=useState(false);
  const [copiedKey,setCopiedKey]=useState(null);
  const [editingEntry,setEditingEntry]=useState(null);
  const [editedSets,setEditedSets]=useState(null);
  const [editedDate,setEditedDate]=useState("");
  const [editedDay,setEditedDay]=useState("");
  const [renamingHistEx,setRenamingHistEx]=useState(null); // {key, oldName}
  const [renameHistValue,setRenameHistValue]=useState("");
  const [editingHistSet,setEditingHistSet]=useState(null); // {exName, setIdx}
  const [editHistSetVals,setEditHistSetVals]=useState({weight:"",reps:"",diff:"just_right"});

  function startEdit(entry) {
    setEditingEntry(entry.key);
    setEditedSets(JSON.parse(JSON.stringify(entry.sets||{})));
    setEditedDate(entry.date || "");
    setEditedDay(entry.day || "");
  }
  function cancelEdit() { setEditingEntry(null); setEditedSets(null); setRenamingHistEx(null); setEditingHistSet(null); setEditedDate(""); setEditedDay(""); }
  function saveEdit() { onEdit(editingEntry, editedSets, editedDate, editedDay); cancelEdit(); }

  function renameHistEx(oldName, newName) {
    if(!newName.trim()||newName===oldName){setRenamingHistEx(null);return;}
    const updated={};
    Object.entries(editedSets).forEach(([k,v])=>{ updated[k===oldName?newName.trim():k]=v; });
    setEditedSets(updated);
    if(addToCatalog) addToCatalog(newName.trim(),"Other");
    setRenamingHistEx(null);
  }
  function editHistSet(exName, setIdx, fields) {
    const updated={...editedSets, [exName]:[...editedSets[exName]]};
    updated[exName][setIdx]={...updated[exName][setIdx],...fields};
    setEditedSets(updated);
  }
  function removeHistSet(exName, setIdx) {
    const updated={...editedSets};
    updated[exName]=updated[exName].filter((_,i)=>i!==setIdx);
    if(!updated[exName].length) delete updated[exName];
    setEditedSets(updated);
  }

  function exportHistory() {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `workout-history-${todayKey()}.json`;
    a.click(); URL.revokeObjectURL(url);
  }
  function getWeekly(){const w={};histEntries.forEach(e=>{if(!e.date)return;const parts=e.date.split('-');const d=parts.length===3?new Date(Number(parts[0]),Number(parts[1])-1,Number(parts[2])):new Date(e.date);if(isNaN(d))return;const sun=new Date(d);sun.setDate(d.getDate()-d.getDay());if(isNaN(sun))return;const k=`${sun.getFullYear()}-${String(sun.getMonth()+1).padStart(2,'0')}-${String(sun.getDate()).padStart(2,'0')}`;if(!w[k])w[k]={sessions:0,volume:0,sets:0,days:{}};w[k].sessions++;w[k].sets+=Object.values(e.sets||{}).reduce((a,b)=>a+b.length,0);const dayVol=Object.values(e.sets||{}).flat().reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0);w[k].volume+=dayVol;const di=d.getDay();w[k].days[di]=(w[k].days[di]||0)+dayVol;});return Object.entries(w).sort(([a],[b])=>b.localeCompare(a)).map(([k,v])=>{const[sy,sm,sd]=k.split('-').map(Number);const s=new Date(sy,sm-1,sd);if(isNaN(s))return null;const en=new Date(s);en.setDate(s.getDate()+6);const f=d=>d.toLocaleDateString("en-US",{month:"short",day:"numeric"});return{key:k,label:`${f(s)} – ${f(en)}`,...v};}).filter(Boolean);}
  const weekly=getWeekly();
  if(!histEntries.length) return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px",textAlign:"center"}}><div style={{fontSize:40,opacity:0.6,marginBottom:12}}>📋</div><div style={{fontSize:20,fontWeight:700,color:T.dim}}>No history yet</div><div style={{fontSize:13,color:T.dim,marginTop:8}}>Finish a workout to see it here</div></div>;
  if(selectedExercise) return <ExerciseDetailOverlay exName={selectedExercise} history={history} onClose={()=>setSelectedExercise(null)}/>;

  return (
    <div style={{padding:"12px 0"}}>
      <div style={{display:"flex",margin:"0 16px 14px",border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
        {[["sessions","Sessions"],["weekly","Weekly"],["analytics","Analytics"]].map(([v,l])=>(<button key={v} onClick={()=>setHv(v)} style={{flex:1,padding:"9px 0",background:hv===v?T.accentGradient:T.surface,color:hv===v?"#fff":T.sub,border:"none",fontSize:12,fontWeight:hv===v?600:400,cursor:"pointer",fontFamily:T.font}}>{l}</button>))}
      </div>
      {hv==="weekly"&&<div>{weekly.map((wk)=>{
        const dayVols=[0,1,2,3,4,5,6].map(d=>wk.days?wk.days[d]||0:0);
        const maxDay=Math.max(...dayVols,1);
        const BAR_W=28,GAP=8,DAY_LABELS=["S","M","T","W","T","F","S"];
        const MAX_H=80;
        const fmtVol=v=>v===0?"—":v>=1000?`${(v/1000).toFixed(v>=10000?0:1)}k`:`${v}`;
        return(
          <div key={wk.key} style={{background:T.surface,borderRadius:12,margin:"8px 16px",border:`1px solid ${T.border}`,padding:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:16}}>
              <span style={{fontSize:13,fontWeight:600,color:T.text}}>{wk.label}</span>
              <span style={{fontSize:11,color:T.sub,fontFamily:T.mono}}>{wk.sessions} sessions · {(wk.volume/1000).toFixed(1)}k lb</span>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:GAP,alignItems:"flex-end"}}>
              {dayVols.map((v,d)=>{
                const barH=v>0?Math.max(8,Math.round((v/maxDay)*MAX_H)):0;
                return(
                  <div key={d} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,width:BAR_W}}>
                    {v>0?(
                      <div style={{width:BAR_W,height:barH,background:T.accent,borderRadius:"4px 4px 0 0",flexShrink:0}} />
                    ):(
                      <div style={{width:BAR_W,height:MAX_H,display:"flex",alignItems:"flex-end"}}>
                        <div style={{width:"100%",height:2,background:T.border,borderRadius:2}} />
                      </div>
                    )}
                    <span style={{fontSize:11,color:T.dim,fontFamily:T.font}}>{DAY_LABELS[d]}</span>
                    <span style={{fontSize:10,color:T.sub,fontFamily:T.mono}}>{fmtVol(v)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}</div>}
      {hv==="analytics"&&<AnalyticsView history={history} exerciseCatalog={exerciseCatalog} />}
      {hv==="sessions"&&(<>
        {histEntries.map((entry,idx)=>{
          const isOpen=expanded===idx;
          const isEditing=editingEntry===entry.key;
          const ts=Object.values(entry.sets||{}).reduce((a,b)=>a+b.length,0);
          const tv=Object.values(entry.sets||{}).flat().reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0);
          return(<div key={entry.key} style={{background:T.surface,borderRadius:12,margin:"6px 16px",border:`1px solid ${T.border}`,overflow:"hidden"}}>
            <div onClick={()=>{if(!isEditing){setExpanded(isOpen?null:idx);if(isEditing)cancelEdit();}}} style={{padding:"16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:isOpen?T.accentLight:T.surface}}>
              <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:16,fontWeight:700}}>{entry.label}</span><span style={{fontSize:12,color:T.dim}}>{entry.day}</span></div><div style={{fontSize:13,color:T.sub}}>{entry.dateLabel||entry.date}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:13,color:T.sub,fontWeight:500}}>{ts} sets</div>{tv>0&&<div style={{fontSize:12,color:T.dim,marginTop:2}}>{tv.toLocaleString()} lb</div>}</div>
            </div>
            {isOpen&&<div style={{padding:"0 16px 16px",background:T.accentLight}}>
              {/* Edit mode */}
              {isEditing&&editedSets?(
                <div>
                  <div style={{padding:"12px 0",borderBottom:`1px solid ${T.border}`,marginBottom:4}}>
                    <div style={{fontSize:11,color:T.accent,fontWeight:600,marginBottom:8,letterSpacing:0.5}}>SESSION DATE & DAY</div>
                    <div style={{display:"flex",gap:8}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:10,color:T.dim,marginBottom:3}}>Date</div>
                        <input type="date" value={editedDate} onChange={e=>{
                          const v=e.target.value;
                          setEditedDate(v);
                          if(v){const d=new Date(v+"T12:00:00");if(!isNaN(d))setEditedDay(DAYS[d.getDay()]);}
                        }} style={{width:"100%",background:T.surface2,border:`1.5px solid ${T.accent}`,color:T.text,padding:"8px 10px",borderRadius:8,fontSize:13,fontFamily:T.mono,outline:"none",boxSizing:"border-box"}} />
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:10,color:T.dim,marginBottom:3}}>Day of week</div>
                        <select value={editedDay} onChange={e=>setEditedDay(e.target.value)} style={{width:"100%",background:T.surface2,border:`1.5px solid ${T.border}`,color:T.text,padding:"8px 10px",borderRadius:8,fontSize:13,fontFamily:T.font,outline:"none",boxSizing:"border-box"}}>
                          {DAYS.map(d=><option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  {Object.entries(editedSets).map(([exName,exSets])=>(
                    <div key={exName} style={{padding:"10px 0",borderTop:`1px solid ${T.border}`}}>
                      {/* Exercise name — tappable to rename */}
                      {renamingHistEx?.oldName===exName?(
                        <div style={{marginBottom:8}}>
                          <ExercisePicker value={renameHistValue} onChange={setRenameHistValue} onSelect={n=>setRenameHistValue(n)} catalog={exerciseCatalog||[]} placeholder="Exercise name" />
                          <div style={{display:"flex",gap:6,marginTop:6}}>
                            <button onClick={()=>renameHistEx(exName,renameHistValue)} style={{flex:1,padding:"7px",background:T.accentGradient,color:"#fff",border:"none",borderRadius:7,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>✓ Rename</button>
                            <button onClick={()=>setRenamingHistEx(null)} style={{flex:1,padding:"7px",background:T.surface,border:`1.5px solid ${T.border}`,color:T.dim,borderRadius:7,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                          </div>
                        </div>
                      ):(
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                          <span style={{fontSize:14,fontWeight:600,color:T.text}}>{exName}</span>
                          <button onClick={()=>{setRenamingHistEx({oldName:exName});setRenameHistValue(exName);}} style={{background:"none",border:`1px solid ${T.border}`,color:T.dim,padding:"3px 8px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:T.font}}>✏️ Rename</button>
                        </div>
                      )}
                      {/* Sets */}
                      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                        {exSets.map((s,i)=>{
                          const isEditingSet=editingHistSet?.exName===exName&&editingHistSet?.setIdx===i;
                          const df=s.diff?DIFF[s.diff]:null;
                          if(isEditingSet) return (
                            <div key={i} style={{width:"100%",background:T.surface2,border:"1.5px solid #FF9F0A",borderRadius:8,padding:"8px 10px",marginBottom:4}}>
                              <div style={{display:"flex",gap:6,marginBottom:6}}>
                                <div style={{flex:1}}><div style={{fontSize:9,color:T.dim,marginBottom:2}}>Weight</div><input type="number" inputMode="decimal" value={editHistSetVals.weight} onChange={e=>setEditHistSetVals(v=>({...v,weight:e.target.value}))} style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"6px",borderRadius:6,fontSize:14,fontFamily:T.mono,outline:"none",textAlign:"center"}} /></div>
                                <div style={{flex:1}}><div style={{fontSize:9,color:T.dim,marginBottom:2}}>Reps</div><input type="number" inputMode="numeric" value={editHistSetVals.reps} onChange={e=>setEditHistSetVals(v=>({...v,reps:e.target.value}))} style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"6px",borderRadius:6,fontSize:14,fontFamily:T.mono,outline:"none",textAlign:"center"}} /></div>
                              </div>
                              <div style={{display:"flex",borderRadius:6,overflow:"hidden",border:`1.5px solid ${T.border}`,marginBottom:6}}>
                                {Object.entries(DIFF).map(([k,v])=><button key={k} onClick={()=>setEditHistSetVals(sv=>({...sv,diff:k}))} style={{flex:1,padding:"5px 0",fontSize:11,background:editHistSetVals.diff===k?v.bg:T.surface,color:editHistSetVals.diff===k?v.color:T.dim,border:"none",borderRight:`1px solid ${T.border}`,cursor:"pointer",fontFamily:T.font,fontWeight:editHistSetVals.diff===k?700:400}}>{v.label==="Just Right"?"👌":v.label==="Easy"?"🟢":"🔴"}</button>)}
                              </div>
                              <div style={{display:"flex",gap:6}}>
                                <button onClick={()=>{editHistSet(exName,i,{weight:editHistSetVals.weight,reps:editHistSetVals.reps,diff:editHistSetVals.diff});setEditingHistSet(null);}} style={{flex:1,padding:"6px",background:T.accentGradient,color:"#fff",border:"none",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Save</button>
                                <button onClick={()=>setEditingHistSet(null)} style={{flex:1,padding:"6px",background:T.surface,border:`1.5px solid ${T.border}`,color:T.dim,borderRadius:6,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                                <button onClick={()=>{removeHistSet(exName,i);setEditingHistSet(null);}} style={{padding:"6px 10px",background:"transparent",border:`1.5px solid ${T.red}33`,color:T.red,borderRadius:6,fontSize:12,cursor:"pointer",fontFamily:T.font}}>✕</button>
                              </div>
                            </div>
                          );
                          return <span key={i} onClick={()=>{setEditingHistSet({exName,setIdx:i});setEditHistSetVals({weight:s.weight,reps:s.reps,diff:s.diff||"just_right"});}} style={{background:df?df.bg:T.surface,border:`1.5px solid ${df?df.color+"33":T.border}`,borderRadius:8,padding:"4px 10px",fontSize:12,color:T.sub,fontWeight:500,cursor:"pointer"}}>{s.weight}×{s.reps}{df&&<span style={{marginLeft:4,fontSize:10,color:df.color}}>{df.label==="Just Right"?"👌":df.label==="Easy"?"🟢":"🔴"}</span>}</span>;
                        })}
                      </div>
                    </div>
                  ))}
                  <div style={{display:"flex",gap:8,marginTop:14}}>
                    <button onClick={saveEdit} style={{flex:1,padding:"10px",background:T.accentGradient,color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Save Changes</button>
                    <button onClick={cancelEdit} style={{flex:1,padding:"10px",background:T.surface,border:`1.5px solid ${T.border}`,color:T.sub,borderRadius:9,fontSize:13,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                  </div>
                </div>
              ):(
                /* Read-only mode */
                <div>
                  {Object.entries(entry.sets||{}).map(([exName,exSets])=>(<div key={exName} style={{padding:"10px 0",borderTop:`1px solid ${T.border}`}}><div onClick={()=>setSelectedExercise(exName)} style={{fontSize:13,fontWeight:500,color:T.text,marginBottom:6,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5}}>{exName}<span style={{fontSize:10,color:T.accent,opacity:0.8}}>›</span></div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{exSets.map((s,i)=>{const df=s.diff?DIFF[s.diff]:null;return <span key={i} style={{background:df?df.bg:T.surface,border:`1.5px solid ${df?df.color+"33":T.border}`,borderRadius:8,padding:"4px 10px",fontSize:12,color:T.sub,fontWeight:500}}>{s.weight} × {s.reps}{df&&<span style={{marginLeft:4,fontSize:10,color:df.color}}>{df.label==="Just Right"?"👌":df.label==="Easy"?"🟢":"🔴"}</span>}</span>;})}</div>{entry.notes&&entry.notes[exName]&&<div style={{marginTop:4,fontSize:12,color:T.dim,fontStyle:"italic"}}>📝 {entry.notes[exName]}</div>}</div>))}
                  {entry.logText&&<div style={{marginTop:10,borderTop:`1px solid ${T.border}`,paddingTop:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:12,color:T.dim,fontWeight:500}}>Copy to Claude</span><button onClick={()=>{navigator.clipboard.writeText(entry.logText).then(()=>{setCopiedKey(entry.key);setTimeout(()=>setCopiedKey(null),2000);}).catch(()=>{});}} style={{padding:"4px 12px",background:copiedKey===entry.key?T.greenBg:"transparent",border:`1.5px solid ${copiedKey===entry.key?T.green:T.border}`,color:copiedKey===entry.key?T.green:T.sub,borderRadius:8,fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>{copiedKey===entry.key?"Copied!":"Copy"}</button></div><pre style={{margin:0,background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",fontSize:11,color:T.dim,overflowX:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word",maxHeight:160,overflowY:"auto",fontFamily:T.mono}}>{entry.logText}</pre></div>}
                  <div style={{display:"flex",gap:8,marginTop:10}}>
                    <button onClick={()=>startEdit(entry)} style={{padding:"8px 16px",background:T.surface2,border:`1.5px solid ${T.border}`,color:T.sub,borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>✏️ Edit</button>
                    <button onClick={()=>{onDelete(entry.key);setExpanded(null);}} style={{padding:"8px 16px",background:"transparent",border:`1.5px solid ${T.red}33`,color:T.red,borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Delete</button>
                  </div>
                </div>
              )}
            </div>}
          </div>);
        })}
        <div style={{padding:"16px 20px",display:"flex",justifyContent:"center",alignItems:"center",gap:20}}>
          <button onClick={exportHistory} style={{background:"none",border:"none",color:T.sub,fontSize:12,cursor:"pointer",fontFamily:T.font}}>⬇ Export JSON</button>
          {!confirmClear ? (
            <button onClick={()=>setConfirmClear(true)} style={{background:"none",border:"none",color:T.dim,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Clear all history</button>
          ) : (
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:12,color:T.red,fontWeight:500}}>Delete everything?</span>
              <button onClick={()=>{onClearAll();setConfirmClear(false);setExpanded(null);}} style={{padding:"6px 16px",background:T.red,color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Yes</button>
              <button onClick={()=>setConfirmClear(false)} style={{padding:"6px 16px",background:T.surface,border:`1.5px solid ${T.border}`,color:T.sub,borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:T.font}}>No</button>
            </div>
          )}
        </div>
      </>)}
    </div>
  );
}

// ─── LEDGER ──────────────────────────────────────────────────────────────────
// Per-exercise progress ledger from history. Stacked sections (no side-by-side
// columns): Growing → Holding → Trailing. Tap a row for full detail.
function LedgerView({history}) {
  const [selected,setSelected]=useState(null);
  const data=useMemo(()=>{
    const byEx={};
    Object.values(history).forEach(e=>{
      if(!e||!e.date||typeof e.sets!=="object"||!e.sets)return;
      Object.entries(e.sets).forEach(([name,sts])=>{
        if(!Array.isArray(sts)||!sts.length)return;
        const top=Math.max(...sts.map(s=>parseFloat(s.weight)||0));
        const reps=sts.reduce((a,s)=>a+(parseInt(s.reps)||0),0);
        if(!byEx[name])byEx[name]=[];
        byEx[name].push({date:e.date,dateLabel:e.dateLabel,top,reps,sets:sts.length});
      });
    });
    const rows=[];
    Object.entries(byEx).forEach(([name,sessions])=>{
      sessions.sort((a,b)=>a.date<b.date?-1:1);
      if(sessions.length<2)return;
      const last=sessions[sessions.length-1],prev=sessions[sessions.length-2];
      if(last.top<=0)return; // cardio / bodyweight-only
      const delta=last.top-prev.top;
      // flat run: how many sessions back the top weight has been unchanged
      let flat=1;
      for(let i=sessions.length-2;i>=0&&sessions[i].top===last.top;i--)flat++;
      let bucket="hold";
      if(delta>0)bucket="grow";
      else if(delta<0||flat>=3)bucket="trail";
      rows.push({name,last,delta,flat,n:sessions.length,bucket});
    });
    return {
      grow:rows.filter(r=>r.bucket==="grow").sort((a,b)=>b.delta-a.delta),
      hold:rows.filter(r=>r.bucket==="hold").sort((a,b)=>b.last.date<a.last.date?-1:1),
      trail:rows.filter(r=>r.bucket==="trail").sort((a,b)=>b.flat-a.flat),
    };
  },[history]);
  if(selected) return <ExerciseDetailOverlay exName={selected} history={history} onClose={()=>setSelected(null)} />;
  const total=data.grow.length+data.hold.length+data.trail.length;
  if(!total) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px",textAlign:"center"}}>
      <div style={{fontSize:40,opacity:0.6,marginBottom:12}}>📒</div>
      <div style={{fontSize:18,fontWeight:700,color:T.sub}}>Nothing to track yet</div>
      <div style={{fontSize:13,color:T.dim,marginTop:8}}>Log an exercise in two sessions and it shows up here.</div>
    </div>
  );
  const Row=({r,tone})=>(
    <button onClick={()=>setSelected(r.name)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",textAlign:"left",background:"none",border:"none",padding:"12px 16px",cursor:"pointer",fontFamily:T.font,gap:12}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:15,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</div>
        <div style={{fontSize:13,color:T.dim,marginTop:2}}>{r.last.top}lb top · {r.n} sessions{r.bucket==="trail"&&r.flat>=3?` · ${r.flat} at this weight`:""}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <span style={{fontSize:14,fontWeight:700,fontFamily:T.mono,color:tone}}>{r.delta>0?`+${r.delta}`:r.delta<0?`${r.delta}`:"—"}</span>
        <span style={{fontSize:13,color:T.dim}}>›</span>
      </div>
    </button>
  );
  const Section=({title,rows,tone})=>!rows.length?null:(
    <div style={{marginBottom:24}}>
      <div style={{fontSize:13,fontWeight:600,color:T.dim,letterSpacing:0.5,textTransform:"uppercase",padding:"0 32px",marginBottom:8}}>{title}</div>
      <div style={{margin:"0 16px",background:T.surface,borderRadius:12,overflow:"hidden"}}>
        {rows.map((r,i)=>(
          <div key={r.name}>
            {i>0&&<div style={{height:0.5,background:T.border,marginLeft:16}} />}
            <Row r={r} tone={tone} />
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div style={{padding:"20px 0 12px"}}>
      <div style={{padding:"0 16px",marginBottom:20}}>
        <div style={{fontSize:28,fontWeight:800,letterSpacing:-0.5,color:T.text}}>Ledger</div>
        <div style={{fontSize:14,color:T.dim,marginTop:2}}>Top-set weight, last session vs the one before.</div>
      </div>
      <Section title="Growing" rows={data.grow} tone={T.green} />
      <Section title="Holding" rows={data.hold} tone={T.sub} />
      <Section title="Trailing" rows={data.trail} tone={T.red} />
    </div>
  );
}

// ─── EXERCISE DETAIL ─────────────────────────────────────────────────────────
function MiniWeightChart({points,color}) {
  if(!points||points.length<2)return null;
  const W=320,H=110,P=14;
  const min=Math.min(...points),max=Math.max(...points);
  const span=max-min||1;
  const x=i=>P+(i/(points.length-1))*(W-2*P);
  const y=v=>H-P-((v-min)/span)*(H-2*P);
  const path=points.map((v,i)=>`${i?"L":"M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block"}}>
      <line x1={P} y1={H-P} x2={W-P} y2={H-P} stroke={T.border} strokeWidth="1" />
      <path d={path} fill="none" stroke={color||T.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((v,i)=>(<circle key={i} cx={x(i)} cy={y(v)} r="3" fill={color||T.accent} />))}
      <text x={P} y={12} fill={T.dim} fontSize="10" fontFamily="ui-monospace,monospace">{max}lb</text>
      <text x={P} y={H-2} fill={T.dim} fontSize="10" fontFamily="ui-monospace,monospace">{min}lb</text>
    </svg>
  );
}

function ExerciseDetailOverlay({exName,history,onClose}) {
  const sessions=useMemo(()=>Object.values(history)
    .filter(e=>e&&typeof e.sets==="object"&&e.sets&&Array.isArray(e.sets[exName])&&e.sets[exName].length)
    .sort((a,b)=>a.date<b.date?-1:1)
    .map(e=>({date:e.date,dateLabel:e.dateLabel,day:e.day,sets:e.sets[exName]})),[history,exName]);
  const tops=sessions.map(s=>Math.max(...s.sets.map(x=>parseFloat(x.weight)||0)));
  const pr=useMemo(()=>{
    let best=null;
    sessions.forEach(s=>s.sets.forEach(x=>{
      const w=parseFloat(x.weight);if(!w)return;
      if(!best||w>best.weight||(w===best.weight&&(parseInt(x.reps)||0)>(parseInt(best.reps)||0)))best={weight:w,reps:x.reps,date:s.dateLabel||s.date};
    }));
    return best;
  },[sessions]);
  return (
    <div style={{position:"fixed",inset:0,zIndex:220,background:T.bg,display:"flex",flexDirection:"column",maxWidth:540,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:4,padding:"14px 10px 10px",borderBottom:`0.5px solid ${T.border}`,flexShrink:0}}>
        <button onClick={onClose} style={{background:"none",border:"none",color:T.accent,fontSize:17,cursor:"pointer",fontFamily:T.font,padding:"4px 8px",display:"flex",alignItems:"center",gap:2}}><span style={{fontSize:22,lineHeight:1}}>‹</span> Back</button>
        <div style={{flex:1,textAlign:"center",fontSize:16,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:64}}>{exName}</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 0 40px"}}>
        {pr&&(
          <div style={{margin:"0 16px 16px",background:T.surface,borderRadius:12,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:T.dim,letterSpacing:0.5,textTransform:"uppercase"}}>Personal record</div>
              <div style={{fontSize:24,fontWeight:800,fontFamily:T.mono,color:T.text,marginTop:2}}>{pr.weight}<span style={{fontSize:14,fontWeight:600,color:T.sub}}> lb × {pr.reps}</span></div>
            </div>
            <div style={{fontSize:13,color:T.dim}}>{pr.date}</div>
          </div>
        )}
        {tops.length>=2&&(
          <div style={{margin:"0 16px 16px",background:T.surface,borderRadius:12,padding:"14px 8px 8px"}}>
            <div style={{fontSize:13,fontWeight:600,color:T.dim,letterSpacing:0.5,textTransform:"uppercase",padding:"0 8px",marginBottom:6}}>Top set per session</div>
            <MiniWeightChart points={tops.slice(-12)} />
          </div>
        )}
        <div style={{fontSize:13,fontWeight:600,color:T.dim,letterSpacing:0.5,textTransform:"uppercase",padding:"0 32px",marginBottom:8}}>Sessions · {sessions.length}</div>
        <div style={{margin:"0 16px",background:T.surface,borderRadius:12,overflow:"hidden"}}>
          {sessions.slice().reverse().map((s,i)=>(
            <div key={s.date+i}>
              {i>0&&<div style={{height:0.5,background:T.border,marginLeft:16}} />}
              <div style={{padding:"12px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:14,fontWeight:600,color:T.text}}>{s.dateLabel||s.date}</span>
                  <span style={{fontSize:13,color:T.dim}}>{s.day}</span>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {s.sets.map((x,j)=>(
                    <span key={j} style={{background:T.surface2,borderRadius:8,padding:"4px 10px",fontSize:13,fontFamily:T.mono,color:T.sub}}>{x.weight}×{x.reps}{x.diff==="easy"?" 🟢":x.diff==="hard"?" 🔴":""}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
function BodyweightChart({history}) {
  const pts=useMemo(()=>Object.values(history)
    .filter(e=>e&&e.checkIn&&typeof e.checkIn==="object"&&parseFloat(e.checkIn.bodyweight))
    .sort((a,b)=>a.date<b.date?-1:1)
    .map(e=>({date:e.dateLabel||e.date,bw:parseFloat(e.checkIn.bodyweight)})),[history]);
  if(pts.length<2)return null;
  return (
    <div style={{margin:"0 16px 16px",background:T.surface,borderRadius:12,padding:"14px 8px 8px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"0 8px",marginBottom:6}}>
        <span style={{fontSize:13,fontWeight:600,color:T.dim,letterSpacing:0.5,textTransform:"uppercase"}}>Bodyweight</span>
        <span style={{fontSize:15,fontWeight:700,fontFamily:T.mono,color:T.teal}}>{pts[pts.length-1].bw} lb</span>
      </div>
      <MiniWeightChart points={pts.slice(-14).map(p=>p.bw)} color={T.teal} />
    </div>
  );
}

function AnalyticsView({history,exerciseCatalog}) {
  const stats=useMemo(()=>{
    const entries=Object.values(history).filter(e=>e&&/^\d{4}-\d{2}-\d{2}$/.test(e.date||""));
    const localKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    const weekKey=ds=>{const[y,m,dd]=ds.split("-").map(Number);const d=new Date(y,m-1,dd);const s=new Date(d);s.setDate(d.getDate()-d.getDay());return localKey(s);};
    const vol=e=>{ if(typeof e.sets!=="object"||!e.sets)return 0; return Object.values(e.sets).flat().reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0); };
    const setCount=e=>{ if(typeof e.sets!=="object"||!e.sets)return 0; return Object.values(e.sets).reduce((a,b)=>a+(Array.isArray(b)?b.length:0),0); };
    const now=new Date();
    const thisWeek=weekKey(localKey(now));
    const wk=entries.filter(e=>weekKey(e.date)===thisWeek);
    // streak of consecutive weeks with >=1 session, ending at this (or last) week
    const weeks=new Set(entries.map(e=>weekKey(e.date)));
    let streak=0;const cur=new Date(now);cur.setDate(cur.getDate()-cur.getDay());
    if(!weeks.has(localKey(cur)))cur.setDate(cur.getDate()-7); // current week may be in progress
    while(weeks.has(localKey(cur))){streak++;cur.setDate(cur.getDate()-7);}
    // last-30-day volume by category
    const catOf={};(exerciseCatalog||[]).forEach(c=>{catOf[c.name.toLowerCase()]=c.category;});
    const cutoff=new Date(now);cutoff.setDate(cutoff.getDate()-30);const cutKey=localKey(cutoff);
    const byCat={};
    entries.filter(e=>e.date>=cutKey).forEach(e=>{
      if(typeof e.sets!=="object"||!e.sets)return;
      Object.entries(e.sets).forEach(([name,sts])=>{
        if(!Array.isArray(sts))return;
        const cat=catOf[name.toLowerCase()]||"Other";
        const v=sts.reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0);
        byCat[cat]=(byCat[cat]||0)+v;
      });
    });
    const cats=Object.entries(byCat).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
    return {
      total:entries.length,
      totalVol:entries.reduce((a,e)=>a+vol(e),0),
      wkSessions:wk.length,
      wkVol:wk.reduce((a,e)=>a+vol(e),0),
      wkSets:wk.reduce((a,e)=>a+setCount(e),0),
      streak,cats,catMax:cats.length?cats[0][1]:1,
    };
  },[history,exerciseCatalog]);
  const fmtK=v=>v>=1000?`${(v/1000).toFixed(v>=100000?0:1)}k`:`${Math.round(v)}`;
  const Card=({label,value,sub})=>(
    <div style={{flex:1,background:T.surface,borderRadius:12,padding:"14px 16px",minWidth:0}}>
      <div style={{fontSize:13,fontWeight:600,color:T.dim,letterSpacing:0.5,textTransform:"uppercase"}}>{label}</div>
      <div style={{fontSize:26,fontWeight:800,fontFamily:T.mono,color:T.text,marginTop:4,lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:12,color:T.dim,marginTop:4}}>{sub}</div>}
    </div>
  );
  return (
    <div style={{paddingBottom:24}}>
      <div style={{display:"flex",gap:10,margin:"0 16px 10px"}}>
        <Card label="This week" value={stats.wkSessions} sub={`${stats.wkSets} sets · ${fmtK(stats.wkVol)} lb`} />
        <Card label="Streak" value={stats.streak} sub={stats.streak===1?"week":"weeks"} />
      </div>
      <div style={{display:"flex",gap:10,margin:"0 16px 16px"}}>
        <Card label="Sessions" value={stats.total} sub="all time" />
        <Card label="Volume" value={fmtK(stats.totalVol)} sub="lb, all time" />
      </div>
      <BodyweightChart history={history} />
      {stats.cats.length>0&&(
        <div style={{margin:"0 16px",background:T.surface,borderRadius:12,padding:"14px 16px"}}>
          <div style={{fontSize:13,fontWeight:600,color:T.dim,letterSpacing:0.5,textTransform:"uppercase",marginBottom:12}}>Volume by muscle group · 30 days</div>
          {stats.cats.map(([cat,v])=>(
            <div key={cat} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:14,fontWeight:600,color:T.text}}>{cat}</span>
                <span style={{fontSize:13,fontFamily:T.mono,color:T.sub}}>{fmtK(v)} lb</span>
              </div>
              <div style={{height:6,background:T.surface3,borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.max(4,(v/stats.catMax)*100)}%`,background:T.accent,borderRadius:3}} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── BOTTOM SHEETS ───────────────────────────────────────────────────────────
function Sheet({children,onDismiss}) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn .2s"}} onClick={onDismiss}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.surface,borderRadius:"16px 16px 0 0",width:"100%",maxWidth:540,padding:"8px 20px calc(20px + env(safe-area-inset-bottom,0px))",animation:"slideIn .25s ease"}}>
        <div style={{width:36,height:5,background:T.surface3,borderRadius:3,margin:"4px auto 16px"}} />
        {children}
      </div>
    </div>
  );
}

function StaleDraftModal({wst,setCount,volume,onResume,onSaveAsIs,onDiscard}) {
  const when=wst?new Date(wst).toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}):"a previous day";
  return (
    <Sheet onDismiss={onResume}>
      <div style={{fontSize:20,fontWeight:800,letterSpacing:-0.4,color:T.text,marginBottom:4}}>Unfinished workout</div>
      <div style={{fontSize:14,color:T.sub,lineHeight:1.5,marginBottom:16}}>You have {setCount} unsaved {setCount===1?"set":"sets"} ({volume.toLocaleString()} lb) from {when}.</div>
      <button onClick={onSaveAsIs} style={{width:"100%",padding:"15px",background:T.accent,color:"#000",border:"none",borderRadius:12,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:T.font,marginBottom:10}}>Save it as that day's workout</button>
      <button onClick={onResume} style={{width:"100%",padding:"15px",background:T.surface2,color:T.text,border:"none",borderRadius:12,fontSize:16,fontWeight:600,cursor:"pointer",fontFamily:T.font,marginBottom:10}}>Keep logging into it</button>
      <button onClick={onDiscard} style={{width:"100%",padding:"13px",background:"none",border:"none",color:T.red,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Discard draft</button>
    </Sheet>
  );
}

function FinishModal({energy,setEnergy,sleep,setSleep,bodyweight,setBodyweight,notes,setNotes,onConfirm,onSkip,onCancel}) {
  const Scale=({label,value,onChange})=>(
    <div style={{marginBottom:14}}>
      <div style={{fontSize:13,fontWeight:600,color:T.dim,letterSpacing:0.5,textTransform:"uppercase",marginBottom:8}}>{label}</div>
      <div style={{display:"flex",gap:6}}>
        {[1,2,3,4,5].map(n=>(
          <button key={n} onClick={()=>onChange(value===n?0:n)} style={{flex:1,padding:"12px 0",borderRadius:10,fontSize:16,fontWeight:700,fontFamily:T.mono,cursor:"pointer",background:value===n?T.accent:T.surface2,color:value===n?"#000":T.sub,border:"none"}}>{n}</button>
        ))}
      </div>
    </div>
  );
  return (
    <Sheet onDismiss={onCancel}>
      <div style={{fontSize:20,fontWeight:800,letterSpacing:-0.4,color:T.text,marginBottom:14}}>Finish workout</div>
      <Scale label="Energy" value={energy} onChange={setEnergy} />
      <Scale label="Sleep" value={sleep} onChange={setSleep} />
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600,color:T.dim,letterSpacing:0.5,textTransform:"uppercase",marginBottom:8}}>Bodyweight</div>
          <input type="number" inputMode="decimal" value={bodyweight} onChange={e=>setBodyweight(e.target.value)} placeholder="lb" style={{width:"100%",background:T.surface2,border:"none",color:T.text,padding:"13px 14px",borderRadius:10,fontSize:17,fontFamily:T.mono,outline:"none",boxSizing:"border-box"}} />
        </div>
        <div style={{flex:2}}>
          <div style={{fontSize:13,fontWeight:600,color:T.dim,letterSpacing:0.5,textTransform:"uppercase",marginBottom:8}}>Notes</div>
          <input type="text" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional" style={{width:"100%",background:T.surface2,border:"none",color:T.text,padding:"13px 14px",borderRadius:10,fontSize:15,fontFamily:T.font,outline:"none",boxSizing:"border-box"}} />
        </div>
      </div>
      <button onClick={onConfirm} style={{width:"100%",padding:"15px",background:T.accent,color:"#000",border:"none",borderRadius:12,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:T.font,marginBottom:10}}>Save workout</button>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onSkip} style={{flex:1,padding:"13px",background:T.surface2,border:"none",color:T.text,borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Save without check-in</button>
        <button onClick={onCancel} style={{flex:1,padding:"13px",background:"none",border:"none",color:T.dim,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
      </div>
    </Sheet>
  );
}
