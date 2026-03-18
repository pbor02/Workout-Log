import { useState, useEffect, useRef } from "react";

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
const todayKey = () => new Date().toISOString().slice(0, 10);
const dateLabel = () => new Date().toLocaleDateString("en-US", { month:"short", day:"numeric" });
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbz5Zm1-YRLwAG2kYxQqiVVcjfWCHGRBQLwBrTUCMP311w__ZZWLotNYotFWEr7oldw3Qg/exec";

let activeProfileId = null;

const store = {
  async get(k) { try { var v = localStorage.getItem("wl_" + activeProfileId + "_" + k); return v ? JSON.parse(v) : null; } catch(e) { return null; } },
  async set(k, v) { try { localStorage.setItem("wl_" + activeProfileId + "_" + k, JSON.stringify(v)); } catch(e) { console.error(e); } },
};
function getShared(k) { try { var v = localStorage.getItem("wl_" + k); return v ? JSON.parse(v) : null; } catch(e) { return null; } }
function setShared(k, v) { try { localStorage.setItem("wl_" + k, JSON.stringify(v)); } catch(e) {} }

const T = {
  bg:"#0c0c0e", surface:"#16161a", surface2:"#1e1e24", surface3:"#28282f",
  border:"#2a2a32", border2:"#35353f",
  text:"#e8e6e3", sub:"#8a8a94", dim:"#55555f",
  accent:"#dc2626", accentDim:"#dc262620", accentLight:"#dc26260a",
  green:"#3dd68c", greenBg:"#3dd68c15", yellow:"#e8c840", yellowBg:"#e8c84018",
  red:"#ef4444", redBg:"#ef444418",
  font:"'Geist','SF Pro Display',-apple-system,sans-serif",
  display:"'Geist','SF Pro Display',-apple-system,sans-serif",
  mono:"'Geist Mono','SF Mono','Menlo',monospace",
  timerBg:"rgba(12,12,14,0.97)",
};

const DIFF = { easy:{label:"Easy",color:"#3dd68c",bg:"#3dd68c15",icon:"\u2191"}, just_right:{label:"Just Right",color:"#e8c840",bg:"#e8c84018",icon:"\u2022"}, hard:{label:"Hard",color:"#ef4444",bg:"#ef444418",icon:"\u2193"} };

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.border2};border-radius:2px}
  input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
  input[type=number]{-moz-appearance:textfield}
  textarea{font-family:${T.font}}
  @keyframes slideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes timerPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
  @media(orientation:landscape){.app-wrap{display:none!important}.landscape-msg{display:flex!important}}
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
  useEffect(() => {
    migrateIfNeeded();
    const active = getShared("active-profile");
    const profiles = getShared("profiles") || [];
    const profile = profiles.find(p => p.id === active);
    if(profile) { activeProfileId = profile.id; setActiveProfile(profile); }
    setProfileReady(true);
  }, []);
  function onProfileSelected(profile) { activeProfileId = profile.id; setShared("active-profile", profile.id); setActiveProfile(profile); }
  function onLogout() { activeProfileId = null; setShared("active-profile", null); setActiveProfile(null); }
  function onProfileUpdated(updatedProfile) {
    const profiles = getShared("profiles") || [];
    const idx = profiles.findIndex(p => p.id === updatedProfile.id);
    if(idx >= 0) profiles[idx] = updatedProfile;
    setShared("profiles", profiles);
    setActiveProfile(updatedProfile);
  }
  if(!profileReady) return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.font}}><style>{css}</style><div style={{color:T.dim,fontSize:13,animation:"pulse 1.5s infinite"}}>Loading...</div></div>;
  if(!activeProfile) return <ProfileScreen onSelect={onProfileSelected} />;
  return <WorkoutLog profile={activeProfile} onLogout={onLogout} onProfileUpdated={onProfileUpdated} />;
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
  const btnPrimary = (disabled) => ({width:"100%",padding:"16px",background:disabled?T.surface3:`linear-gradient(135deg,${T.accent},#991b1b)`,color:disabled?T.dim:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:disabled?"default":"pointer",fontFamily:T.font,boxShadow:disabled?"none":"0 4px 24px #dc262640",marginTop:28});
  const wrap = {minHeight:"100vh",background:T.bg,fontFamily:T.font,color:T.text,display:"flex",flexDirection:"column",alignItems:"center",padding:"48px 24px 48px"};
  const inner = {width:"100%",maxWidth:420};

  if(!showWizard) return (
    <div style={wrap}>
      <style>{css}</style>
      <div style={inner}>
        <div style={{fontSize:30,fontWeight:800,letterSpacing:-0.5,marginBottom:4}}>Workout Log</div>
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
                <button onClick={()=>deleteProfile(p.id)} style={{padding:"6px 14px",background:T.red,color:"#000",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Yes</button>
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
          {[1,2,3].map(s=><div key={s} style={{height:3,flex:1,background:s<=step?T.accent:T.surface2,borderRadius:2,transition:"background .3s"}} />)}
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
            <button onClick={()=>setStep(3)} style={{flex:2,padding:"14px",background:`linear-gradient(135deg,${T.accent},#991b1b)`,color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:T.font,boxShadow:"0 4px 24px #dc262640"}}>Next →</button>
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
                      <button onClick={()=>addWizardExercise(d)} disabled={!newExName.trim()} style={{flex:1,padding:"9px",background:!newExName.trim()?T.surface3:T.accent,color:!newExName.trim()?T.dim:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:!newExName.trim()?"default":"pointer",fontFamily:T.font}}>Add</button>
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
            <button onClick={finishWizard} style={{flex:2,padding:"14px",background:`linear-gradient(135deg,${T.accent},#991b1b)`,color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:T.font,boxShadow:"0 4px 24px #dc262640"}}>Finish ✓</button>
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
      <button onClick={()=>{const t=Math.max(10,parseInt(val)||90);const updated={...profile,restTime:t};const profiles=(getShared("profiles")||[]).map(p=>p.id===profile.id?updated:p);setShared("profiles",profiles);onSave(updated);setEditing(false);}} style={{background:T.accent,border:"none",color:"#fff",padding:"10px 18px",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Save</button>
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
  const [editIdx, setEditIdx] = useState(null);
  const [selectedDiff, setSelectedDiff] = useState("just_right");
  const [history, setHistory] = useState({});
  const [customExercises, setCustomExercises] = useState([]);
  const [showAddEx, setShowAddEx] = useState(false);
  const [newExName, setNewExName] = useState("");
  const [newExSets, setNewExSets] = useState("3");
  const [newExReps, setNewExReps] = useState("10-12");
  const [reordering, setReordering] = useState(false);
  const [toast, setToast] = useState(null);
  const [timerStart, setTimerStart] = useState(null);
  const [timerDuration, setTimerDuration] = useState(0);
  const [timerMinimized, setTimerMinimized] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [showFinishModal, setShowFinishModal] = useState(false);
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
  const [suggestion, setSuggestion] = useState(null);
  const [exerciseCatalog, setExerciseCatalog] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [confirmDeleteProfile, setConfirmDeleteProfile] = useState(false);
  const repsRef = useRef(null);
  const weightRef = useRef(null);
  const newExRef = useRef(null);
  const renameRef = useRef(null);
  const addExFormRef = useRef(null);
  const exRefs = useRef({});
  const dayCache = useRef({});

  useEffect(() => { (async () => {
    const [hist,s,d,cex,order,rn,cw,cat] = await Promise.all([store.get("iron-history"),store.get(`sets-${day}-${todayKey()}`),store.get(`done-${day}-${todayKey()}`),store.get(`custom-ex-${day}-${todayKey()}`),store.get(`order-${day}`),store.get(`renames-${day}-${todayKey()}`),store.get('custom-workouts'),store.get('exercise-catalog')]);
    if(hist)setHistory(hist); if(s)setSets(s); if(d)setDone(d); if(cex)setCustomExercises(cex); if(order)setExerciseOrder(order); if(rn)setRenames(rn); if(cw)setCustomWorkouts(cw);
    if(cat){setExerciseCatalog(cat);}else{setExerciseCatalog(EXERCISE_CATALOG_DEFAULT);await store.set('exercise-catalog',EXERCISE_CATALOG_DEFAULT);}
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
    var w = parseFloat(lastWeight) || 0;
    if (!w) return null;
    var bump = getWeightBump(exName);
    if (lastDiff === "easy") return {weight: w + bump, reason: "+" + bump + "lb — last was easy"};
    var allHistSets = [];
    Object.values(history).forEach(function(e) { var s = e.sets ? e.sets[exName] : null; if (s) s.forEach(function(x) { allHistSets.push(x); }); });
    var justRight = allHistSets.filter(function(s) { return s.diff === "just_right"; });
    if (justRight.length >= 3) {
      var avgW = justRight.reduce(function(a, s) { return a + (parseFloat(s.weight) || 0); }, 0) / justRight.length;
      if (Math.abs(avgW - w) > bump) return {weight: Math.round(avgW / bump) * bump, reason: Math.round(avgW) + "lb avg for just right"};
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
    if (allEasy) return {weight: lastW + bump, reps: lastAvgReps, note: "Bump +" + bump + "lb"};
    if (allJR && lastAvgReps >= repMax) return {weight: lastW + bump, reps: repMin, note: "Top of range — go up"};
    if (allJR) return {weight: lastW, reps: Math.min(lastAvgReps + 1, repMax), note: "+1 rep"};
    if (anyHard) return {weight: lastW, reps: lastAvgReps, note: "Match weight — complete all reps"};
    return {weight: lastW, reps: lastAvgReps, note: "Same targets"};
  }

  useEffect(() => {
    if (timerStart) {
      var id = setInterval(function() { setNow(Date.now()); }, 1000);
      return function() { clearInterval(id); };
    }
  }, [timerStart]);

  var timerElapsed = timerStart ? Math.floor((now - timerStart) / 1000) : 0;
  var timerRemaining = timerStart ? Math.max(0, timerDuration - timerElapsed) : 0;
  var timerPct = timerDuration > 0 ? Math.min(100, (timerElapsed / timerDuration) * 100) : 0;
  var timerActive = timerStart !== null && timerRemaining > 0;
  var timerDone = timerStart !== null && timerRemaining <= 0;

  useEffect(() => {
    if (timerDone && timerStart) {
      showToast("REST DONE — GO");
      setTimerStart(null);
      setTimerMinimized(false);
      setTimeout(() => { repsRef.current?.focus(); repsRef.current?.select(); }, 200);
    }
  }, [timerDone]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2400); }
  function getWorkout(d) { var dd=d||day; var cw=customWorkouts||{}; return cw[dd]||DEFAULT_WORKOUTS[dd]||{label:'REST',sub:'',exercises:[]}; }
  function getBaseExercises() { return getWorkout().exercises || []; }
  function getAllExercises() { const all=[...getBaseExercises(),...customExercises]; if(exerciseOrder?.length){const map={};all.forEach(e=>{map[e.name]=e;});const ord=[];exerciseOrder.forEach(n=>{if(map[n]){ord.push(map[n]);delete map[n];}});Object.values(map).forEach(e=>ord.push(e));return ord;} return all; }
  async function saveOrder(list) { const n=list.map(e=>e.name); setExerciseOrder(n); await store.set(`order-${day}`,n); }
  async function moveExercise(idx,dir) { const all=getAllExercises(); const ni=idx+dir; if(ni<0||ni>=all.length)return; const a=[...all]; [a[idx],a[ni]]=[a[ni],a[idx]]; await saveOrder(a); }

  async function switchDay(d) {
    if(d===day) return;
    dayCache.current[day] = {sets:sets,done:done,customExercises:customExercises,exerciseOrder:exerciseOrder,renames:renames};
    store.set(`sets-${day}-${todayKey()}`,sets);store.set(`done-${day}-${todayKey()}`,done);store.set(`custom-ex-${day}-${todayKey()}`,customExercises);store.set(`renames-${day}-${todayKey()}`,renames);
    setDay(d);setActiveEx(null);setWeight("");setReps("");setEditIdx(null);setView("log");setReordering(false);setRenamingEx(null);setSuggestion(null);
    var cached = dayCache.current[d];
    if(cached){setSets(cached.sets||{});setDone(cached.done||{});setCustomExercises(cached.customExercises||[]);setExerciseOrder(cached.exerciseOrder);setRenames(cached.renames||{});}
    else{const[s,dn,cex,order,rn]=await Promise.all([store.get(`sets-${d}-${todayKey()}`),store.get(`done-${d}-${todayKey()}`),store.get(`custom-ex-${d}-${todayKey()}`),store.get(`order-${d}`),store.get(`renames-${d}-${todayKey()}`)]);setSets(s||{});setDone(dn||{});setCustomExercises(cex||[]);setExerciseOrder(order);setRenames(rn||{});}
  }

  function findLastExercise(n) { for(const e of Object.values(history).sort((a,b)=>new Date(b.date)-new Date(a.date))){const s=e.sets?.[n];if(s?.length)return s[s.length-1];} return null; }

  function openExercise(ex) { if(activeEx===ex){setActiveEx(null);setWeight("");setReps("");setEditIdx(null);setSuggestion(null);return;} setActiveEx(ex);setEditIdx(null);setSuggestion(null);
    const xs=sets[ex]||[]; if(xs.length){const l=xs[xs.length-1];setWeight(l.weight);setReps(l.reps);var sg=suggestWeight(ex,l.weight,l.diff);if(sg){setSuggestion(sg);setWeight(String(sg.weight));}} else{const l=findLastExercise(ex);if(l){setWeight(l.weight);setReps(l.reps);var sg2=suggestWeight(ex,l.weight,l.diff);if(sg2){setSuggestion(sg2);setWeight(String(sg2.weight));}}else{setWeight("");setReps("");}}
    setSelectedDiff("just_right"); }

  async function addOrUpdateSet() {
    if(!activeEx||!weight||!reps) return;
    let updated;
    if(editIdx!==null){const a=[...(sets[activeEx]||[])];a[editIdx]={...a[editIdx],weight:String(weight),reps:String(reps),diff:selectedDiff};updated={...sets,[activeEx]:a};setEditIdx(null);showToast("Updated");}
    else{const entry={weight:String(weight),reps:String(reps),diff:selectedDiff};updated={...sets,[activeEx]:[...(sets[activeEx]||[]),entry]};showToast("Logged");}
    setSets(updated); await store.set(`sets-${day}-${todayKey()}`,updated);
    var exData=getAllExercises().find(e=>e.name===activeEx);
    var loggedNow=(updated[activeEx]||[]).length;
    if(exData&&loggedNow>=exData.sets&&editIdx===null){var ud={...done,[activeEx]:true};setDone(ud);await store.set(`done-${day}-${todayKey()}`,ud);}
    if(editIdx===null&&exData){var tn=Date.now();setNow(tn);setTimerStart(tn);setTimerDuration(profile.restTime||90);setTimerMinimized(false);}
    setSelectedDiff("just_right");
    var sg=suggestWeight(activeEx,weight,selectedDiff);if(sg&&editIdx===null){setSuggestion(sg);setWeight(String(sg.weight));}else{setSuggestion(null);}
    setTimeout(() => {repsRef.current?.focus();repsRef.current?.select();},60);
    if(exData&&loggedNow>=exData.sets&&editIdx===null){var allE=getAllExercises();var nxt=allE.find(e=>!done[e.name]&&(sets[e.name]||[]).length<e.sets&&e.name!==activeEx);if(nxt)setTimeout(()=>openExercise(nxt.name),400);}
  }

  function startEditSet(ex,i){setActiveEx(ex);setEditIdx(i);const s=sets[ex][i];setWeight(s.weight);setReps(s.reps);setSelectedDiff(s.diff||"just_right");setTimeout(()=>{repsRef.current?.focus();repsRef.current?.select();},80);}
  async function removeSet(ex,i){const a=(sets[ex]||[]).filter((_,idx)=>idx!==i);const u={...sets};if(a.length)u[ex]=a;else delete u[ex];setSets(u);if(editIdx===i)setEditIdx(null);await store.set(`sets-${day}-${todayKey()}`,u);}
  async function toggleDone(ex){const u={...done,[ex]:!done[ex]};setDone(u);await store.set(`done-${day}-${todayKey()}`,u);}
  async function addToCatalog(name, category) {
    if(!name.trim()) return;
    const exists = exerciseCatalog.some(e => e.name.toLowerCase() === name.trim().toLowerCase());
    if(!exists) {
      const updated = [...exerciseCatalog, {name: name.trim(), category: category || "Other"}];
      setExerciseCatalog(updated);
      await store.set('exercise-catalog', updated);
    }
  }

  async function addCustomExercise(){if(!newExName.trim())return;const ex={name:newExName.trim(),sets:parseInt(newExSets)||3,reps:newExReps||"10-12",custom:true};const upd=[...customExercises,ex];setCustomExercises(upd);await store.set(`custom-ex-${day}-${todayKey()}`,upd);await saveOrder([...getAllExercises(),ex]);addToCatalog(newExName.trim(),"Other");setNewExName("");setNewExSets("3");setNewExReps("10-12");setShowAddEx(false);showToast("Added");}
  async function removeCustomExercise(idx){const ex=customExercises[idx];const upd=customExercises.filter((_,i)=>i!==idx);setCustomExercises(upd);await store.set(`custom-ex-${day}-${todayKey()}`,upd);if(sets[ex.name]){const u={...sets};delete u[ex.name];setSets(u);await store.set(`sets-${day}-${todayKey()}`,u);}await saveOrder(getAllExercises().filter(e=>e.name!==ex.name));}

  async function renameExercise(origName,newName){
    if(!newName.trim()||newName===origName){setRenamingEx(null);return;}
    var u={...renames,[origName]:newName.trim()};setRenames(u);await store.set(`renames-${day}-${todayKey()}`,u);setRenamingEx(null);showToast("Renamed");
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

  function buildLogText(ci) {
    const w=getWorkout(),allEx=getAllExercises();
    const vol=Object.values(sets).flat().reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0);
    const setsText=allEx.map(ex=>{const xs=sets[ex.name]||[];if(!xs.length)return null;return `${ex.name} (target ${ex.sets}x${ex.reps}): ${xs.map((s,i)=>`Set ${i+1}: ${s.weight}lb x ${s.reps}${s.diff?` [${DIFF[s.diff]?.label||s.diff}]`:""}`).join(", ")}`;}).filter(Boolean).join("\n");
    const skipped=allEx.filter(ex=>!(sets[ex.name]?.length)).map(e=>e.name);
    const hist=Object.values(history).filter(e=>e.day===day).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
    const histText=hist.map(e=>{const s=Object.entries(e.sets||{}).map(([ex,sts])=>`  ${ex}: ${sts.map(x=>`${x.weight}x${x.reps}${x.diff?` [${x.diff}]`:""}`).join(", ")}`).join("\n");return `${e.dateLabel||e.date} — ${e.label}\n${s}`;}).join("\n\n");
    const ciLines=[];if(ci?.energy)ciLines.push(`Energy: ${ci.energy}/5`);if(ci?.sleep)ciLines.push(`Sleep: ${ci.sleep}/5`);if(ci?.bodyweight)ciLines.push(`BW: ${ci.bodyweight}lb`);if(ci?.notes)ciLines.push(`Notes: ${ci.notes}`);
    const header = activeProfileId === "peter"
      ? `WORKOUT LOG — ${day.toUpperCase()} ${w.label} — ${dateLabel()}\n\nPROGRAM: 5-day hypertrophy split (Push/Pull/Legs/Arms&Shoulders/Full Upper), Wed+Sat rest\nGOAL: Body recomp — visible abs by June. TRT ~150mg/wk + tirzepatide. Progressive overload while cutting.`
      : `WORKOUT LOG — ${day.toUpperCase()} ${w.label} — ${dateLabel()}`;
    return `${header}\n\n${ciLines.length?"CHECK-IN:\n"+ciLines.join("\n")+"\n\n":""}SESSION: Volume ${vol.toLocaleString()} lb | ${Object.keys(sets).length}/${allEx.length} exercises\n${skipped.length?`Skipped: ${skipped.join(", ")}`:"All completed"}\n\nSETS:\n${setsText||"None"}\n${customExercises.length?`\nADDED: ${customExercises.map(e=>e.name).join(", ")}`:""}\n\nPREVIOUS ${day.toUpperCase()} (${hist.length}):\n${histText||"First session"}\n\nAnalyze:\n1. Compare to last ${day} — volume, progression, regression. Note difficulty ratings.\n2. Exact weight/rep targets for next ${day}\n3. Flag anything off\n4. One-sentence verdict\nDirect. No filler.`;
  }

  async function sendToSheets(entry){if(activeProfileId!=="peter")return;if(!sheetsUrl)return;setSheetsSyncStatus("sending");try{const r=await fetch(sheetsUrl,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify(entry)});const d=await r.json();setSheetsSyncStatus(d.status==="ok"?"ok":"error");}catch(e){setSheetsSyncStatus("error");}}

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
    a.href = url; a.download = "workout-backup-" + profile.name.toLowerCase().replace(/\s+/g,"-") + "-" + new Date().toISOString().slice(0,10) + ".json";
    a.click(); URL.revokeObjectURL(url);
  }

  async function restoreFromBackup(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.store || !data.profile) { showToast("Invalid backup file"); return; }
      const prefix = "wl_" + activeProfileId + "_";
      Object.entries(data.store).forEach(([k, v]) => {
        localStorage.setItem(prefix + k, typeof v === "string" ? v : JSON.stringify(v));
      });
      showToast("Restored! Reloading…");
      setTimeout(() => window.location.reload(), 1200);
    } catch(e) { showToast("Restore failed"); }
  }

  useEffect(function(){if(!loading&&sheetsUrl&&activeProfileId==="peter"){setTimeout(syncFromSheets,2000);}},[loading]);

  async function finishWorkout(ci) {
    const w=getWorkout();const text=buildLogText(ci||{});const entry={day,label:w.label,date:todayKey(),dateLabel:dateLabel(),sets:{...sets},customExercises:[...customExercises],checkIn:ci||{},logText:text};
    const uh={...history,[`${todayKey()}-${day}`]:entry};setHistory(uh);await store.set("iron-history",uh);
    setShowFinishModal(false);
    sendToSheets(entry);
    setSets({});setDone({});setActiveEx(null);setCustomExercises([]);setRenames({});
    await Promise.all([store.set(`sets-${day}-${todayKey()}`,{}),store.set(`done-${day}-${todayKey()}`,{}),store.set(`custom-ex-${day}-${todayKey()}`,[]),store.set(`renames-${day}-${todayKey()}`,{})]);
    dayCache.current={};
    setView("log");
    showToast("Workout saved");
  }

  async function clearToday(){setSets({});setDone({});setActiveEx(null);setCustomExercises([]);setRenames({});await Promise.all([store.set(`sets-${day}-${todayKey()}`,{}),store.set(`done-${day}-${todayKey()}`,{}),store.set(`custom-ex-${day}-${todayKey()}`,[]),store.set(`renames-${day}-${todayKey()}`,{})]); showToast("Cleared");}

  async function deleteHistoryEntry(key) {
    const entry = history[key];
    const u = {...history}; delete u[key]; setHistory(u); await store.set("iron-history", u); showToast("Deleted");
    if(entry) deleteFromSheets(entry.date, entry.day);
  }
  async function clearAllHistory() {
    setHistory({}); await store.set("iron-history", {}); showToast("History cleared");
    clearAllFromSheets();
  }

  const w=getWorkout(),isRest=w.exercises.length===0&&customExercises.length===0,allExercises=getAllExercises();
  const totalSets=Object.values(sets).reduce((a,b)=>a+b.length,0),doneCount=Object.values(done).filter(Boolean).length,today=autoDay();
  const totalVolume=Object.values(sets).flat().reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0);
  if(view!=="log"&&view!=="history"&&view!=="edit") setView("log");

  if(loading) return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.font}}><div style={{color:T.dim,fontSize:13,letterSpacing:2,animation:"pulse 1.5s infinite"}}>Loading...</div></div>;

  return (
    <>
    <div className="landscape-msg" style={{display:"none",minHeight:"100vh",background:T.bg,alignItems:"center",justifyContent:"center",fontFamily:T.font,color:T.dim,fontSize:14,textAlign:"center",padding:40}}>Rotate to portrait</div>
    <div className="app-wrap" style={{minHeight:"100vh",maxWidth:540,margin:"0 auto",background:T.bg,fontFamily:T.font,color:T.text,display:"flex",flexDirection:"column"}}>
      <style>{css}</style>
      {toast && <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:T.accent,color:"#fff",padding:"10px 28px",borderRadius:100,fontSize:13,fontWeight:700,zIndex:200,animation:"slideIn .25s",boxShadow:"0 4px 20px #dc262640",fontFamily:T.font}}>{toast}</div>}

      {showFinishModal && <FinishModal energy={finishEnergy} setEnergy={setFinishEnergy} sleep={finishSleep} setSleep={setFinishSleep} bodyweight={finishWeight} setBodyweight={setFinishWeight} notes={finishNotes} setNotes={setFinishNotes} onConfirm={()=>finishWorkout({energy:finishEnergy,sleep:finishSleep,bodyweight:finishWeight,notes:finishNotes})} onSkip={()=>finishWorkout({})} onCancel={()=>setShowFinishModal(false)} />}

      {showProfileModal && (
        <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setShowProfileModal(false)}>
          <div style={{background:T.surface,borderRadius:"16px 16px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:480}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
              <div style={{fontSize:18,fontWeight:700,color:T.text}}>{profile.name}</div>
              <button onClick={()=>setShowProfileModal(false)} style={{background:"none",border:"none",color:T.dim,fontSize:20,cursor:"pointer",padding:"0 4px",lineHeight:1}}>✕</button>
            </div>
            <div style={{fontSize:13,color:T.dim,marginBottom:20}}>Rest timer: {profile.restTime||90}s</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <ProfileRestEdit profile={profile} onSave={(updated)=>{onProfileUpdated(updated);setShowProfileModal(false);}} T={T} />
              <div style={{display:"flex",gap:8}}>
                <button onClick={backupProfile} style={{flex:1,background:"none",border:"1.5px solid "+T.border,color:T.sub,padding:"12px 0",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>⬇ Backup</button>
                <label style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:"1.5px solid "+T.border,color:T.sub,padding:"12px 0",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>
                  ⬆ Restore<input type="file" accept=".json" style={{display:"none"}} onChange={e=>{if(e.target.files[0])restoreFromBackup(e.target.files[0]);e.target.value="";}} />
                </label>
              </div>
              <button onClick={()=>{setShowProfileModal(false);onLogout();}} style={{background:"none",border:"1.5px solid "+T.border,color:T.sub,padding:"12px 0",borderRadius:10,fontSize:15,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Switch Profile</button>
              {confirmDeleteProfile ? (
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setConfirmDeleteProfile(false)} style={{flex:1,background:"none",border:"1.5px solid "+T.border,color:T.sub,padding:"12px 0",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                  <button onClick={async()=>{const profiles=(getShared("profiles")||[]).filter(p=>p.id!==activeProfileId);setShared("profiles",profiles);setShared("active-profile",null);setConfirmDeleteProfile(false);setShowProfileModal(false);onLogout();}} style={{flex:1,background:"#dc2626",border:"none",color:"#fff",padding:"12px 0",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Delete</button>
                </div>
              ) : (
                <button onClick={()=>setConfirmDeleteProfile(true)} style={{background:"none",border:"1.5px solid #dc2626",color:"#dc2626",padding:"12px 0",borderRadius:10,fontSize:15,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Delete Profile…</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TIMER — FULL or MINIMIZED ═══ */}
      {timerActive && !timerMinimized && (
        <div style={{position:"fixed",inset:0,zIndex:150,background:T.timerBg,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .2s"}}>
          <div style={{textAlign:"center",width:"100%",maxWidth:400,padding:"0 24px"}}>
            <div style={{marginBottom:20}}><div style={{height:5,background:T.border,borderRadius:3,overflow:"hidden",maxWidth:300,margin:"0 auto"}}><div style={{height:"100%",width:`${100-timerPct}%`,background:`linear-gradient(90deg, ${T.accent}, ${T.yellow})`,transition:"width 1s linear",borderRadius:3}} /></div></div>
            <div style={{fontSize:13,color:T.sub,letterSpacing:4,marginBottom:16,fontWeight:500}}>REST</div>
            <div style={{fontSize:110,fontWeight:800,letterSpacing:2,color:timerRemaining<=10?T.accent:T.text,lineHeight:1,animation:timerRemaining<=10?"timerPulse 1s infinite":"none",fontFamily:T.mono}}>{Math.floor(timerRemaining/60)}:{String(timerRemaining%60).padStart(2,"0")}</div>
            <div style={{fontSize:13,color:T.dim,marginTop:16,marginBottom:36,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:300,margin:"16px auto 36px"}}>{activeEx||""}</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={()=>{setTimerStart(null);setTimerMinimized(false);setTimeout(()=>{repsRef.current?.focus();repsRef.current?.select();},150);}} style={{background:T.accent,border:"none",color:"#fff",padding:"14px 36px",borderRadius:10,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Skip — Go</button>
              <button onClick={()=>setTimerMinimized(true)} style={{background:T.surface,border:`1px solid ${T.border}`,color:T.sub,padding:"14px 20px",borderRadius:10,fontSize:13,cursor:"pointer",fontFamily:T.font}}>Minimize</button>
              <button onClick={()=>setTimerDuration(p=>p+30)} style={{background:T.surface,border:`1px solid ${T.border}`,color:T.sub,padding:"14px 18px",borderRadius:10,fontSize:13,cursor:"pointer",fontFamily:T.font}}>+30s</button>
            </div>
          </div>
        </div>
      )}
      {timerActive && timerMinimized && (
        <div onClick={()=>setTimerMinimized(false)} style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:timerRemaining<=10?T.accent:T.surface2,padding:"10px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",animation:"fadeIn .15s",borderBottom:"1px solid "+T.border}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:timerRemaining<=10?"#000":T.accent,animation:"pulse 1s infinite"}} />
            <span style={{color:timerRemaining<=10?"#000":T.text,fontSize:13,fontWeight:600,fontFamily:T.font}}>REST</span>
            <span style={{color:timerRemaining<=10?"#000a":T.dim,fontSize:12,fontFamily:T.font}}>{activeEx}</span>
          </div>
          <span style={{color:timerRemaining<=10?"#000":T.accent,fontSize:22,fontWeight:800,fontFamily:T.mono}}>{Math.floor(timerRemaining/60)}:{String(timerRemaining%60).padStart(2,"0")}</span>
        </div>
      )}

      {/* ═══ HEADER ═══ */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,flexShrink:0,marginTop:timerActive&&timerMinimized?42:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 20px 12px"}}>
          <div>
            <div style={{fontSize:22,fontWeight:800,color:T.text,lineHeight:1,letterSpacing:-0.5}}>Workout Log</div>
            <div style={{fontSize:12,color:T.dim,marginTop:4,fontWeight:400}}>{profile.name} · {day} · {dateLabel()}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {totalSets>0&&view==="log"&&<div style={{textAlign:"right"}}><div style={{fontSize:28,fontWeight:700,color:T.accent,lineHeight:1}}>{totalSets}</div><div style={{fontSize:10,color:T.dim,fontWeight:500,marginTop:2}}>sets</div></div>}
            <button onClick={()=>setShowProfileModal(true)} title="Profile" style={{background:T.accentDim,border:"1.5px solid "+T.accent,color:T.accent,width:34,height:34,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0}}>{profile.name.charAt(0).toUpperCase()}</button>
            <button onClick={()=>setWakeLockOn(v=>!v)} title={wakeLockOn?"Screen on (tap to disable)":"Keep screen on"} style={{background:wakeLockOn?T.accentDim:"transparent",border:"1.5px solid "+(wakeLockOn?T.accent:T.border),color:wakeLockOn?T.accent:T.dim,width:34,height:34,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15,flexShrink:0}}>☀</button>
            {activeProfileId==="peter"&&<button onClick={manualSync} disabled={syncing} style={{background:syncing?T.accentDim:"transparent",border:"1.5px solid "+(syncing?T.accent:T.border),color:syncing?T.accent:T.dim,width:34,height:34,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:syncing?"default":"pointer",fontSize:14,flexShrink:0,animation:syncing?"pulse 1s infinite":"none"}}>↻</button>}
            <button onClick={()=>{setView(view==="edit"?"log":"edit");setReordering(false);setEditExIdx(null);setEditingMeta(false);}} style={{background:view==="edit"?T.accentDim:"transparent",border:"1.5px solid "+(view==="edit"?T.accent:T.border),color:view==="edit"?T.accent:T.dim,width:34,height:34,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,flexShrink:0}}>⚙</button>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 20px 12px",overflowX:"auto"}}>
          {DAYS.map(d=>{const sel=d===day,tod=d===today,rest=(getWorkout(d).exercises||[]).length===0; return (
            <button key={d} onClick={()=>switchDay(d)} style={{position:"relative",background:sel?T.accent:"transparent",border:`1.5px solid ${sel?T.accent:T.border}`,color:sel?"#fff":rest?T.dim:T.sub,padding:"6px 12px",borderRadius:8,fontSize:12,fontWeight:sel?600:400,cursor:"pointer",fontFamily:T.font,whiteSpace:"nowrap"}}>
              {d.slice(0,3)}{tod&&<span style={{position:"absolute",top:-3,right:-3,width:6,height:6,background:T.green,borderRadius:"50%",border:`2px solid ${sel?T.accent:T.surface}`}} />}
            </button>);
          })}
          {day!==today&&<button onClick={()=>switchDay(today)} style={{background:"none",border:"none",color:T.green,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:T.font,whiteSpace:"nowrap",padding:"6px 8px"}}>↩ Today</button>}
        </div>
        <div style={{display:"flex",borderTop:`1px solid ${T.border}`}}>
          {[["log","Log"],["history","History"]].map(([v,l])=>(
            <button key={v} onClick={()=>{setView(v);setReordering(false);}} style={{flex:1,padding:"10px 0",background:"transparent",border:"none",borderBottom:`2.5px solid ${view===v?T.accent:"transparent"}`,color:view===v?T.text:T.dim,fontSize:13,fontWeight:view===v?600:400,cursor:"pointer",fontFamily:T.font}}>{l}</button>
          ))}
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:timerActive&&timerMinimized?64:0}}>
        {view==="log"&&(<>
          {isRest?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px",textAlign:"center",gap:16}}>
              <div style={{fontSize:56,opacity:0.7}}>🔋</div>
              <div style={{fontSize:28,fontWeight:700,color:T.dim}}>Rest Day</div>
              <div style={{fontSize:14,color:T.sub}}>{w.sub}</div>
              {showAddEx ? (
              <div style={{width:"100%",maxWidth:400,background:T.accentLight,border:`1.5px solid ${T.accent}`,borderRadius:10,padding:"12px",textAlign:"left",marginTop:8}}>
                <div style={{fontSize:12,color:T.accent,fontWeight:600,marginBottom:10}}>Add Exercise</div>
                <div style={{marginBottom:8}}><ExercisePicker value={newExName} onChange={setNewExName} onSelect={(name)=>setNewExName(name)} catalog={exerciseCatalog} placeholder="Exercise name" /></div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:3}}>Sets</div><input type="number" inputMode="numeric" value={newExSets} onChange={e=>setNewExSets(e.target.value)} style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"9px",borderRadius:8,fontSize:14,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                  <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:3}}>Rep range</div><input type="text" value={newExReps} onChange={e=>setNewExReps(e.target.value)} placeholder="10-12" style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"9px",borderRadius:8,fontSize:14,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={addCustomExercise} disabled={!newExName.trim()} style={{flex:1,padding:"11px 0",background:!newExName.trim()?T.surface3:T.accent,color:!newExName.trim()?T.dim:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:!newExName.trim()?"default":"pointer",fontFamily:T.font}}>Add</button>
                  <button onClick={()=>{setShowAddEx(false);setNewExName("");}} style={{flex:1,padding:"11px 0",background:T.surface,border:`1.5px solid ${T.border}`,color:T.dim,borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={()=>setShowAddEx(true)} style={{marginTop:16,background:T.surface,border:`1.5px dashed ${T.border2}`,color:T.sub,padding:"12px 24px",borderRadius:10,fontSize:13,cursor:"pointer",fontFamily:T.font}}>+ Add exercise anyway</button>
            )}
            </div>
          ):(<>
            {/* Banner */}
            <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-end",background:T.surface}}>
              <div><div style={{fontSize:30,fontWeight:800,lineHeight:1,letterSpacing:-0.5}}>{w.label}</div><div style={{fontSize:13,color:T.sub,marginTop:6}}>{w.sub}</div></div>
              <div style={{display:"flex",alignItems:"flex-end",gap:12}}>
                {totalVolume>0&&<div style={{textAlign:"right"}}><div style={{fontSize:14,color:T.sub,fontWeight:600}}>{totalVolume.toLocaleString()}</div><div style={{fontSize:10,color:T.dim}}>lb vol</div></div>}
                <button onClick={()=>setReordering(!reordering)} style={{background:reordering?T.accentDim:T.surface2,border:`1.5px solid ${reordering?T.accent:T.border}`,color:reordering?T.accent:T.dim,padding:"6px 10px",borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:T.font,fontWeight:500}}>{reordering?"Done":"⇅"}</button>
              </div>
            </div>
            {/* Progress */}
            <div style={{padding:"12px 20px",borderBottom:`1px solid ${T.border}`,background:T.surface}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.dim,marginBottom:6,fontWeight:500}}><span>Progress</span><span>{doneCount}/{allExercises.length}</span></div>
              <div style={{height:4,background:T.surface3,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${allExercises.length>0?(doneCount/allExercises.length*100):0}%`,background:`linear-gradient(90deg, ${T.accent}, #ef4444)`,transition:"width .4s ease",borderRadius:3,boxShadow:"0 0 8px #dc262640"}} /></div>
            </div>

            {/* Exercises */}
            {allExercises.map((ex,exIdx)=>{
              const exSets=sets[ex.name]||[],isActive=activeEx===ex.name,isDone=done[ex.name],targetMet=exSets.length>=ex.sets,lastSession=findLastExercise(ex.name),isCustom=ex.custom;
              var exVol=exSets.reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0);
              if(isDone&&!isActive&&!reordering) return (
                <div key={ex.name+exIdx} ref={el=>{exRefs.current[ex.name]=el;}} onClick={()=>toggleDone(ex.name)} style={{borderBottom:"1px solid "+T.border,padding:"10px 20px",background:T.surface,opacity:0.5,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:20,height:20,borderRadius:6,background:T.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:12,color:"#fff"}}>✓</span></div>
                    <span style={{fontSize:13,color:T.sub}}>{getDisplayName(ex)}</span>
                  </div>
                  <span style={{fontSize:12,color:T.dim}}>{exSets.length} sets · {exVol.toLocaleString()} lb</span>
                </div>
              );
              return (
                <div key={ex.name+exIdx} ref={el=>{exRefs.current[ex.name]=el;}} onClick={e=>{if(reordering||e.target.closest("[data-no-row-click]"))return;openExercise(ex.name);}} style={{borderBottom:`1px solid ${T.border}`,padding:"16px 20px",background:isActive?T.accentLight:T.surface,borderLeft:`3px solid ${isActive?T.accent:isCustom?T.yellow:"transparent"}`,opacity:isDone&&!reordering?0.4:1,cursor:reordering?"default":"pointer"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                        {!reordering&&<button data-no-row-click onClick={e=>{e.stopPropagation();toggleDone(ex.name);}} style={{width:20,height:20,borderRadius:6,border:`1.5px solid ${isDone?T.green:T.border2}`,background:isDone?T.green:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{isDone&&<span style={{fontSize:12,color:"#fff",lineHeight:1}}>✓</span>}</button>}
                        {reordering&&<div style={{display:"flex",flexDirection:"column",gap:2,flexShrink:0}}><button onClick={()=>moveExercise(exIdx,-1)} disabled={exIdx===0} style={{background:"none",border:"none",color:exIdx===0?T.border:T.sub,fontSize:13,cursor:exIdx===0?"default":"pointer",padding:0,lineHeight:1}}>▲</button><button onClick={()=>moveExercise(exIdx,1)} disabled={exIdx===allExercises.length-1} style={{background:"none",border:"none",color:exIdx===allExercises.length-1?T.border:T.sub,fontSize:13,cursor:exIdx===allExercises.length-1?"default":"pointer",padding:0,lineHeight:1}}>▼</button></div>}
                        {renamingEx===ex.name?(<div data-no-row-click onClick={e=>e.stopPropagation()} style={{display:"flex",gap:4,flex:1}}><input ref={renameRef} type="text" value={renameValue} onChange={e=>setRenameValue(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")renameExercise(ex.name,renameValue);if(e.key==="Escape")setRenamingEx(null);}} style={{flex:1,background:T.surface2,border:"1.5px solid "+T.accent,color:T.text,padding:"4px 8px",borderRadius:6,fontSize:13,fontFamily:T.font,outline:"none"}}/><button onClick={()=>renameExercise(ex.name,renameValue)} style={{background:T.accent,color:"#fff",border:"none",padding:"4px 10px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:T.font}}>✓</button></div>):(<><span style={{fontSize:14,fontWeight:500,color:isCustom?T.yellow:T.text,lineHeight:1.3}}>{getDisplayName(ex)}{isCustom&&<span style={{fontSize:10,color:T.dim,marginLeft:6,fontWeight:400}}>added</span>}</span>{isActive&&!reordering&&<button data-no-row-click onClick={e=>{e.stopPropagation();setRenamingEx(ex.name);setRenameValue(getDisplayName(ex));setTimeout(()=>{if(renameRef.current)renameRef.current.focus();},80);}} style={{background:"none",border:"none",color:T.dim,fontSize:13,cursor:"pointer",padding:"0 0 0 6px",fontFamily:T.font}}>✏️</button>}</>)}
                      </div>
                      {!reordering&&<>
                        <div style={{paddingLeft:30,display:"flex",alignItems:"center",gap:8,marginBottom:exSets.length>0?10:0}}>
                          <span style={{fontSize:12,color:T.dim}}>{ex.sets}×{ex.reps}</span>
                          {exSets.length>0&&<span style={{fontSize:12,color:targetMet?T.green:T.accent,fontWeight:600}}>{exSets.length}/{ex.sets}{targetMet?" ✓":""}</span>}
                          {!exSets.length&&lastSession&&<span style={{fontSize:12,color:T.dim,fontStyle:"italic"}}>last: {lastSession.weight}×{lastSession.reps}</span>}
                          {!exSets.length&&(function(){var tgt=getSessionTarget(ex.name);return tgt?<div style={{marginTop:4,fontSize:11,color:T.accent,fontWeight:500}}>{"\ud83c\udfaf Target: "+tgt.weight+"lb \u00d7 "+tgt.reps+" \u2014 "+tgt.note}</div>:null;})()}
                        </div>
                        {exSets.length>0&&(
                          <div style={{paddingLeft:30,display:"flex",flexWrap:"wrap",gap:5}}>
                            {exSets.map((s,i)=>{const df=s.diff?DIFF[s.diff]:null; return (
                              <span key={i} data-no-row-click onClick={e=>{e.stopPropagation();startEditSet(ex.name,i);}} style={{display:"inline-flex",alignItems:"center",gap:4,background:editIdx===i&&activeEx===ex.name?T.accentDim:df?df.bg+"88":T.surface2,border:`1.5px solid ${editIdx===i&&activeEx===ex.name?T.accent:df?df.color+"33":T.border}`,borderRadius:8,padding:"5px 10px",fontSize:13,cursor:"pointer"}}>
                                <span style={{fontWeight:700,color:T.text,fontFamily:T.mono}}>{s.weight}</span>
                                <span style={{color:T.dim,fontSize:11}}>×</span>
                                <span style={{fontWeight:600,color:T.text,fontFamily:T.mono}}>{s.reps}</span>
                                {df&&<span style={{fontSize:10,color:df.color,fontWeight:600,marginLeft:2}}>{df.label==="Just Right"?"👌":df.label==="Easy"?"🟢":"🔴"}</span>}
                                <button onClick={e=>{e.stopPropagation();removeSet(ex.name,i);}} style={{background:"none",border:"none",color:T.dim,fontSize:11,padding:"0 0 0 4px",cursor:"pointer",fontFamily:T.font}}>✕</button>
                              </span>);})}
                          </div>
                        )}
                      </>}
                    </div>
                    {!reordering&&<div style={{display:"flex",gap:4,flexShrink:0}}>
                      {isCustom&&<button data-no-row-click onClick={e=>{e.stopPropagation();removeCustomExercise(customExercises.findIndex(c=>c.name===ex.name));}} style={{background:"none",border:`1.5px solid ${T.red}22`,color:T.red,padding:"6px 10px",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:T.font,opacity:0.7}}>✕</button>}
                      <button data-no-row-click onClick={e=>{e.stopPropagation();openExercise(ex.name);}} style={{background:isActive?T.accentDim:T.surface,border:`1.5px solid ${isActive?T.accent:T.border}`,color:isActive?T.accent:T.sub,padding:"6px 14px",borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>{isActive?"Close":"+ Set"}</button>
                    </div>}
                  </div>

                  {isActive&&!reordering&&(
                    <div data-no-row-click onClick={e=>e.stopPropagation()} style={{paddingLeft:30,marginTop:14}}>
                      {suggestion&&editIdx===null&&<div style={{marginBottom:8,fontSize:12,color:T.accent,fontWeight:500,animation:"fadeIn .3s"}}>{"💡 "+suggestion.reason}</div>}
                      <div style={{display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap",animation:"slideIn .2s ease"}}>
                        <div><div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:4}}>Weight</div><input ref={weightRef} type="number" inputMode="decimal" step="any" value={weight} onChange={e=>setWeight(e.target.value)} onFocus={e=>e.target.select()} onKeyDown={e=>{if(e.key==="Enter")repsRef.current?.focus();}} placeholder="0" style={{background:T.surface2,border:`1.5px solid ${T.border}`,color:T.text,padding:"11px 8px",width:80,borderRadius:8,textAlign:"center",fontSize:20,fontWeight:700,fontFamily:T.mono,outline:"none"}} /></div>
                        <div><div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:4}}>Reps</div><input ref={repsRef} type="number" inputMode="numeric" value={reps} onChange={e=>setReps(e.target.value)} onFocus={e=>e.target.select()} onKeyDown={e=>{if(e.key==="Enter")addOrUpdateSet();}} placeholder="0" style={{background:T.surface2,border:`1.5px solid ${T.border}`,color:T.text,padding:"11px 8px",width:72,borderRadius:8,textAlign:"center",fontSize:20,fontWeight:700,fontFamily:T.mono,outline:"none"}} /></div>
                        {editIdx!==null&&<button onClick={()=>setEditIdx(null)} style={{background:T.surface,border:`1.5px solid ${T.border}`,color:T.dim,padding:"11px 14px",borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>}
                        {editIdx===null&&exSets.length>0&&<span style={{fontSize:12,color:T.dim,alignSelf:"center",fontWeight:500}}>Set {exSets.length+1}/{ex.sets}</span>}
                      </div>
                      {/* Difficulty + Log in one row */}
                      <div style={{marginTop:10,display:"flex",alignItems:"center",gap:6}}>
                        <div style={{display:"flex",borderRadius:8,overflow:"hidden",border:`1.5px solid ${T.border}`}}>
                          {Object.entries(DIFF).map(([k,v])=>(
                            <button key={k} onClick={()=>setSelectedDiff(k)} style={{padding:"7px 12px",fontSize:12,fontWeight:selectedDiff===k?700:400,cursor:"pointer",fontFamily:T.font,background:selectedDiff===k?v.bg:T.surface,color:selectedDiff===k?v.color:T.dim,border:"none",borderRight:`1px solid ${T.border}`}}>{v.label==="Just Right"?"👌 Right":v.label==="Easy"?"🟢 Easy":"🔴 Hard"}</button>
                          ))}
                        </div>
                        <button onClick={addOrUpdateSet} disabled={!weight||!reps} style={{background:(!weight||!reps)?T.surface3:T.accent,color:(!weight||!reps)?T.dim:"#fff",border:"none",padding:"7px 20px",borderRadius:8,fontSize:14,fontWeight:700,cursor:(!weight||!reps)?"default":"pointer",fontFamily:T.font,marginLeft:"auto"}}>{editIdx!==null?"Update":"Log"}</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add exercise */}
            {!reordering&&(<>
              {!showAddEx?(
                <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.border}`,background:T.surface}}>
                  <button onClick={()=>{setShowAddEx(true);setTimeout(()=>addExFormRef.current?.scrollIntoView({behavior:"smooth",block:"nearest"}),150);}} style={{width:"100%",padding:"14px 0",background:T.bg,border:`1.5px dashed ${T.border2}`,borderRadius:10,color:T.sub,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    <span style={{fontSize:20,color:T.accent,fontWeight:300}}>+</span> Add Exercise
                  </button>
                </div>
              ):(
                <div ref={addExFormRef} style={{padding:"16px 20px",borderBottom:`1px solid ${T.border}`,background:T.accentLight,animation:"slideIn .2s ease"}}>
                  <div style={{fontSize:12,color:T.accent,fontWeight:600,marginBottom:10}}>Add Exercise</div>
                  <div style={{marginBottom:8}}><ExercisePicker value={newExName} onChange={setNewExName} onSelect={(name)=>setNewExName(name)} catalog={exerciseCatalog} placeholder="Exercise name" /></div>
                  <div style={{display:"flex",gap:8,marginBottom:8}}>
                    <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:3}}>Sets</div><input type="number" inputMode="numeric" value={newExSets} onChange={e=>setNewExSets(e.target.value)} style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"9px",borderRadius:8,fontSize:14,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                    <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,fontWeight:500,marginBottom:3}}>Rep range</div><input type="text" value={newExReps} onChange={e=>setNewExReps(e.target.value)} placeholder="10-12" style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"9px",borderRadius:8,fontSize:14,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={addCustomExercise} disabled={!newExName.trim()} style={{flex:1,padding:"11px 0",background:!newExName.trim()?T.surface3:T.accent,color:!newExName.trim()?T.dim:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:!newExName.trim()?"default":"pointer",fontFamily:T.font}}>Add</button>
                    <button onClick={()=>{setShowAddEx(false);setNewExName("");}} style={{flex:1,padding:"11px 0",background:T.surface,border:`1.5px solid ${T.border}`,color:T.dim,borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                  </div>
                </div>
              )}
            </>)}

            {totalSets>0&&!reordering&&(
              <div style={{padding:20,borderTop:`1px solid ${T.border}`,background:T.surface}}>
                <button onClick={()=>{setShowFinishModal(true);setFinishEnergy(0);setFinishSleep(0);setFinishWeight("");setFinishNotes("");}} style={{width:"100%",padding:16,background:`linear-gradient(135deg, ${T.accent}, #991b1b)`,color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:T.font,boxShadow:"0 4px 24px #dc262640"}}>Finish & Analyze</button>
                <div style={{display:"flex",justifyContent:"center",marginTop:10}}><button onClick={clearToday} style={{background:"none",border:"none",color:T.dim,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Clear all</button></div>
              </div>
            )}
          </>)}
        </>)}

        {view==="edit"&&(
          <div style={{padding:"16px 20px"}}>
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
                  <button onClick={function(){saveDayMeta(day,editLabel,editSub);}} style={{flex:1,padding:"9px",background:T.accent,color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Save</button>
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
                    <button onClick={function(){updateTemplateExercise(day,i,editExName,editExSets,editExReps);}} style={{flex:1,padding:"9px",background:T.accent,color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Save</button>
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
                <div style={{marginBottom:6}}><ExercisePicker value={newTemplateName} onChange={setNewTemplateName} onSelect={(name)=>setNewTemplateName(name)} catalog={exerciseCatalog} placeholder="Exercise name" /></div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,marginBottom:3}}>Sets</div><input type="number" inputMode="numeric" value={newTemplateSets} onChange={function(e){setNewTemplateSets(e.target.value);}} style={{width:"100%",background:T.surface,border:"1.5px solid "+T.border,color:T.text,padding:"7px",borderRadius:8,fontSize:13,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                  <div style={{flex:1}}><div style={{fontSize:10,color:T.dim,marginBottom:3}}>Reps</div><input type="text" value={newTemplateReps} onChange={function(e){setNewTemplateReps(e.target.value);}} style={{width:"100%",background:T.surface,border:"1.5px solid "+T.border,color:T.text,padding:"7px",borderRadius:8,fontSize:13,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={function(){if(!newTemplateName.trim())return;addTemplateExercise(day,newTemplateName,newTemplateSets,newTemplateReps);addToCatalog(newTemplateName,"Other");setShowAddTemplate(false);setNewTemplateName("");setNewTemplateSets("3");setNewTemplateReps("10-12");}} disabled={!newTemplateName.trim()} style={{flex:1,padding:"9px",background:!newTemplateName.trim()?T.surface3:T.accent,color:!newTemplateName.trim()?T.dim:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:!newTemplateName.trim()?"default":"pointer",fontFamily:T.font}}>Add</button>
                  <button onClick={function(){setShowAddTemplate(false);}} style={{flex:1,padding:"9px",background:T.surface,border:"1.5px solid "+T.border,color:T.dim,borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
                </div>
              </div>
            )}
            </>)}
            {customWorkouts&&customWorkouts[day]&&<button onClick={function(){resetTemplate(day);}} style={{width:"100%",marginTop:10,padding:"10px",background:"transparent",border:"1.5px solid "+T.red+"33",color:T.red,borderRadius:10,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Reset to Default</button>}
          </div>
        )}
        {view==="history"&&<HistoryView history={history} onDelete={deleteHistoryEntry} onClearAll={clearAllHistory} />}
      </div>
    </div>
    </>
  );
}

// ─── EXERCISE PICKER ─────────────────────────────────────────────────────────
function ExercisePicker({value, onChange, onSelect, catalog, placeholder}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const query = (value || "").toLowerCase();
  const filtered = query.length > 0
    ? catalog.filter(e => e.name.toLowerCase().includes(query) || e.category.toLowerCase().includes(query)).slice(0, 25)
    : catalog.slice(0, 25);
  const groups = {};
  filtered.forEach(e => { if(!groups[e.category]) groups[e.category] = []; groups[e.category].push(e); });
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
        <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:100,background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:10,marginTop:4,maxHeight:240,overflowY:"auto",boxShadow:"0 8px 24px rgba(0,0,0,0.4)"}}>
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
function HistoryView({history, onDelete, onClearAll}) {
  const histEntries = Object.entries(history).map(([key, val]) => ({key, ...val})).sort((a,b) => new Date(b.date)-new Date(a.date));
  const [expanded,setExpanded]=useState(null);
  const [hv,setHv]=useState("sessions");
  const [confirmClear,setConfirmClear]=useState(false);
  const [copiedKey,setCopiedKey]=useState(null);
  function exportHistory() {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `workout-history-${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  }
  function getWeekly(){const w={};histEntries.forEach(e=>{if(!e.date)return;const parts=e.date.split('-');const d=parts.length===3?new Date(Number(parts[0]),Number(parts[1])-1,Number(parts[2])):new Date(e.date);if(isNaN(d))return;const sun=new Date(d);sun.setDate(d.getDate()-d.getDay());if(isNaN(sun))return;const k=`${sun.getFullYear()}-${String(sun.getMonth()+1).padStart(2,'0')}-${String(sun.getDate()).padStart(2,'0')}`;if(!w[k])w[k]={sessions:0,volume:0,sets:0};w[k].sessions++;w[k].sets+=Object.values(e.sets||{}).reduce((a,b)=>a+b.length,0);w[k].volume+=Object.values(e.sets||{}).flat().reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0);});return Object.entries(w).sort(([a],[b])=>b.localeCompare(a)).map(([k,v])=>{const[sy,sm,sd]=k.split('-').map(Number);const s=new Date(sy,sm-1,sd);if(isNaN(s))return null;const en=new Date(s);en.setDate(s.getDate()+6);const f=d=>d.toLocaleDateString("en-US",{month:"short",day:"numeric"});return{key:k,label:`${f(s)} – ${f(en)}`,...v};}).filter(Boolean);}
  const weekly=getWeekly(),maxVol=Math.max(...weekly.map(w=>w.volume),1);
  if(!histEntries.length) return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px",textAlign:"center"}}><div style={{fontSize:40,opacity:0.6,marginBottom:12}}>📋</div><div style={{fontSize:20,fontWeight:700,color:T.dim}}>No history yet</div><div style={{fontSize:13,color:T.dim,marginTop:8}}>Finish a workout to see it here</div></div>;
  return (
    <div style={{padding:"12px 0"}}>
      <div style={{display:"flex",margin:"0 20px 14px",border:`1.5px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
        {[["sessions","Sessions"],["weekly","Weekly Vol"]].map(([v,l])=>(<button key={v} onClick={()=>setHv(v)} style={{flex:1,padding:"9px 0",background:hv===v?T.accent:T.surface,color:hv===v?"#fff":T.sub,border:"none",fontSize:12,fontWeight:hv===v?600:400,cursor:"pointer",fontFamily:T.font}}>{l}</button>))}
      </div>
      {hv==="weekly"&&<div style={{padding:"0 20px"}}>{weekly.map((wk,i)=>(<div key={wk.key} style={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.sub,marginBottom:6}}><span>{wk.label}</span><span>{wk.sessions} sessions · {wk.sets} sets</span></div><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{flex:1,height:22,background:T.surface2,borderRadius:6,overflow:"hidden"}}><div style={{height:"100%",width:`${(wk.volume/maxVol)*100}%`,background:`linear-gradient(90deg, ${T.accent}, #ef4444)`,borderRadius:6}} /></div><span style={{fontSize:13,fontWeight:600,color:T.text,minWidth:60,textAlign:"right"}}>{(wk.volume/1000).toFixed(1)}k</span></div></div>))}</div>}
      {hv==="sessions"&&(<>
        {histEntries.map((entry,idx)=>{const isOpen=expanded===idx;const ts=Object.values(entry.sets||{}).reduce((a,b)=>a+b.length,0);const tv=Object.values(entry.sets||{}).flat().reduce((a,s)=>a+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0);return(<div key={entry.key} style={{borderBottom:`1px solid ${T.border}`}}>
          <div onClick={()=>setExpanded(isOpen?null:idx)} style={{padding:"16px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:isOpen?T.accentLight:T.surface}}>
            <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:16,fontWeight:700}}>{entry.label}</span><span style={{fontSize:12,color:T.dim}}>{entry.day}</span></div><div style={{fontSize:13,color:T.sub}}>{entry.dateLabel||entry.date}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:13,color:T.sub,fontWeight:500}}>{ts} sets</div>{tv>0&&<div style={{fontSize:12,color:T.dim,marginTop:2}}>{tv.toLocaleString()} lb</div>}</div>
          </div>
          {isOpen&&<div style={{padding:"0 20px 16px",background:T.accentLight}}>
            {Object.entries(entry.sets||{}).map(([exName,exSets])=>(<div key={exName} style={{padding:"10px 0",borderTop:`1px solid ${T.border}`}}><div style={{fontSize:13,fontWeight:500,color:T.text,marginBottom:6}}>{exName}</div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{exSets.map((s,i)=>{const df=s.diff?DIFF[s.diff]:null;return <span key={i} style={{background:df?df.bg:T.surface,border:`1.5px solid ${df?df.color+"33":T.border}`,borderRadius:8,padding:"4px 10px",fontSize:12,color:T.sub,fontWeight:500}}>{s.weight} × {s.reps}{df&&<span style={{marginLeft:4,fontSize:10,color:df.color}}>{df.label==="Just Right"?"👌":df.label==="Easy"?"🟢":"🔴"}</span>}</span>;})}</div></div>))}
            {entry.logText&&<div style={{marginTop:10,borderTop:`1px solid ${T.border}`,paddingTop:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:12,color:T.dim,fontWeight:500}}>Copy to Claude</span><button onClick={()=>{navigator.clipboard.writeText(entry.logText).then(()=>{setCopiedKey(entry.key);setTimeout(()=>setCopiedKey(null),2000);}).catch(()=>{});}} style={{padding:"4px 12px",background:copiedKey===entry.key?T.greenBg:"transparent",border:`1.5px solid ${copiedKey===entry.key?T.green:T.border}`,color:copiedKey===entry.key?T.green:T.sub,borderRadius:8,fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>{copiedKey===entry.key?"Copied!":"Copy"}</button></div><pre style={{margin:0,background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",fontSize:11,color:T.dim,overflowX:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word",maxHeight:160,overflowY:"auto",fontFamily:T.mono}}>{entry.logText}</pre></div>}
            <button onClick={()=>{onDelete(entry.key);setExpanded(null);}} style={{marginTop:10,padding:"8px 16px",background:"transparent",border:`1.5px solid ${T.red}33`,color:T.red,borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Delete this session</button>
          </div>}
        </div>);})}
        <div style={{padding:"16px 20px",display:"flex",justifyContent:"center",alignItems:"center",gap:20}}>
          <button onClick={exportHistory} style={{background:"none",border:"none",color:T.sub,fontSize:12,cursor:"pointer",fontFamily:T.font}}>⬇ Export JSON</button>
          {!confirmClear ? (
            <button onClick={()=>setConfirmClear(true)} style={{background:"none",border:"none",color:T.dim,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Clear all history</button>
          ) : (
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:12,color:T.red,fontWeight:500}}>Delete everything?</span>
              <button onClick={()=>{onClearAll();setConfirmClear(false);setExpanded(null);}} style={{padding:"6px 16px",background:T.red,color:"#000",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Yes</button>
              <button onClick={()=>setConfirmClear(false)} style={{padding:"6px 16px",background:T.surface,border:`1.5px solid ${T.border}`,color:T.sub,borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:T.font}}>No</button>
            </div>
          )}
        </div>
      </>)}
    </div>
  );
}


// ─── FINISH MODAL ────────────────────────────────────────────────────────────
function FinishModal({energy,setEnergy,sleep,setSleep,bodyweight,setBodyweight,notes,setNotes,onConfirm,onSkip,onCancel}) {
  const labels={1:"Dead",2:"Low",3:"OK",4:"Good",5:"Great"};
  const rb=(val,cur,setter,col)=>(<button key={val} onClick={()=>setter(val)} style={{width:44,height:44,borderRadius:10,background:cur===val?col:T.surface,border:`1.5px solid ${cur===val?col:T.border}`,color:cur===val?"#fff":T.sub,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center"}}>{val}</button>);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeIn .2s"}}>
      <div style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"30px 24px",width:"100%",maxWidth:380}}>
        <div style={{fontSize:22,fontWeight:800,color:T.accent,marginBottom:4}}>Post-Workout</div>
        <div style={{fontSize:13,color:T.dim,marginBottom:24}}>Quick check-in before saving</div>
        <div style={{marginBottom:22}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:12,color:T.sub,fontWeight:500}}>Energy Level</span>{energy>0&&<span style={{fontSize:12,color:T.accent,fontWeight:600}}>{labels[energy]}</span>}</div><div style={{display:"flex",gap:8}}>{[1,2,3,4,5].map(v=>rb(v,energy,setEnergy,T.accent))}</div></div>
        <div style={{marginBottom:22}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:12,color:T.sub,fontWeight:500}}>Sleep Quality</span>{sleep>0&&<span style={{fontSize:12,color:T.green,fontWeight:600}}>{labels[sleep]}</span>}</div><div style={{display:"flex",gap:8}}>{[1,2,3,4,5].map(v=>rb(v,sleep,setSleep,T.green))}</div></div>
        <div style={{marginBottom:16}}><div style={{fontSize:12,color:T.sub,fontWeight:500,marginBottom:6}}>Bodyweight (lb) — optional</div><input type="number" inputMode="decimal" step="0.1" value={bodyweight} onChange={e=>setBodyweight(e.target.value)} placeholder="e.g. 210" style={{width:"100%",background:T.bg,border:`1.5px solid ${T.border}`,color:T.text,padding:"12px 14px",borderRadius:10,fontSize:16,fontFamily:T.font,outline:"none",textAlign:"center"}} /></div>
        <div style={{marginBottom:24}}><div style={{fontSize:12,color:T.sub,fontWeight:500,marginBottom:6}}>Notes — optional</div><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Felt strong, shoulder tight, etc." rows={2} style={{width:"100%",background:T.bg,border:`1.5px solid ${T.border}`,color:T.text,padding:"12px 14px",borderRadius:10,fontSize:14,fontFamily:T.font,outline:"none",resize:"vertical"}} /></div>
        <button onClick={onConfirm} style={{width:"100%",padding:14,background:`linear-gradient(135deg, ${T.accent}, #991b1b)`,color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:T.font,marginBottom:8}}>Save Workout</button>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onSkip} style={{flex:1,padding:12,background:T.surface2,border:`1.5px solid ${T.border}`,color:T.sub,borderRadius:10,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Skip check-in</button>
          <button onClick={onCancel} style={{flex:1,padding:12,background:"transparent",border:`1.5px solid ${T.border}`,color:T.dim,borderRadius:10,fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
