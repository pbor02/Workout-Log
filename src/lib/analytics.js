// Exercise name normalization — collapses variant names to canonical names
const NORM_MAP = {
  'cable single-arm front raise': 'Cable Front Raise',
  'cable front raise — single arm': 'Cable Front Raise',
  'cable single-arm lateral raise': 'Cable Lateral Raise',
  'cable lateral raise — single arm': 'Cable Lateral Raise',
  'lateral raise machine (home)': 'Lateral Raise Machine',
  'pec deck — chest fly': 'Pec Deck Chest',
  'pec deck — rear delt': 'Pec Deck Rear Delt',
  'cable crossover low-to-high': 'Cable Crossover',
  'cable tricep pushdown — rope': 'Cable Tricep Pushdown',
  'ez bar pushdown': 'EZ Bar Pushdown',
  'cable curl — single arm': 'Cable Curl',
  'cable curl — single arm (supinated)': 'Cable Curl',
  'cable hammer curl (rope)': 'Cable Hammer Curl',
  'overhead cable tricep extension': 'Overhead Cable Extension',
  'overhead cable extension — single arm': 'Overhead Cable Extension SA',
  'cable single-arm rear delt pull': 'Rear Delt Pull',
  'single-arm cable row': 'Single-Arm Cable Row',
  'seated leg curl — drop set': 'Seated Leg Curl',
  'leg press — close feet high reps': 'Leg Press',
  'incline neutral-grip db curl': 'Incline DB Curl',
};

export function normalizeName(name) {
  const lower = name.toLowerCase().trim();
  return NORM_MAP[lower] || name.trim();
}

export function getMuscleGroup(name) {
  const n = name.toLowerCase();
  if (/curl|preacher|incline.*db curl/.test(n)) return 'biceps';
  if (/tricep|pushdown|overhead.*ext|ez bar push/.test(n)) return 'triceps';
  if (/rear delt|face pull/.test(n)) return 'rear_delts';
  if (/lateral|front raise|shoulder press|delt.*press|overhead press|arnold/.test(n)) return 'delts';
  if (/chest|pec.*chest|pec deck(?!.*rear)|bench|incline.*press|decline.*press|chest fly/.test(n)) return 'chest';
  if (/row|pulldown|pull.up|chin.up|straight.arm|rack pull|deadlift/.test(n)) return 'back';
  if (/calf|calves/.test(n)) return 'calves';
  if (/leg press|squat|leg ext|leg curl|lunge|rdl|hamstring|glute|hip thrust/.test(n)) return 'legs';
  return 'other';
}

export function epley1RM(weight, reps) {
  const w = parseFloat(weight) || 0;
  const r = parseInt(reps) || 0;
  if (!w || !r || r > 30) return w;
  return Math.round(w * (1 + r / 30));
}

// Monday-anchored week start
export function getWeekStart(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dow = date.getDay(); // 0=Sun
  const diff = dow === 0 ? -6 : 1 - dow;
  const mon = new Date(date);
  mon.setDate(date.getDate() + diff);
  return mon.toISOString().slice(0, 10);
}

export function computeAnalytics(history) {
  if (!history) return null;
  const entries = Object.values(history)
    .filter(e => e.date && e.sets && Object.keys(e.sets).length)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  if (!entries.length) return null;

  const dateRange = {
    start: entries[0].date,
    end: entries[entries.length - 1].date,
    startLabel: entries[0].dateLabel || entries[0].date,
    endLabel: entries[entries.length - 1].dateLabel || entries[entries.length - 1].date,
  };

  // Flatten all rows
  const rows = [];
  entries.forEach(entry => {
    Object.entries(entry.sets || {}).forEach(([exName, sets]) => {
      if (!Array.isArray(sets)) return;
      sets.forEach(s => {
        if (!s || typeof s !== 'object') return;
        const w = parseFloat(s.weight) || 0;
        const r = parseInt(s.reps) || 0;
        rows.push({
          date: entry.date,
          day: entry.day,
          exName,
          normName: normalizeName(exName),
          weight: w,
          reps: r,
          diff: s.diff || null,
          mg: getMuscleGroup(exName),
          e1rm: epley1RM(w, r),
        });
      });
    });
  });

  const totalVolume = rows.reduce((a, r) => a + r.weight * r.reps, 0);
  const totalSets = rows.length;
  const totalReps = rows.reduce((a, r) => a + r.reps, 0);
  const sessionCount = entries.length;
  const distinctLifts = new Set(rows.map(r => r.normName)).size;
  const avgSetsPerSession = sessionCount ? +(totalSets / sessionCount).toFixed(1) : 0;

  // Top e1RM per (date, normName)
  const topByDateEx = {};
  rows.forEach(r => {
    if (!r.e1rm) return;
    const key = `${r.date}||${r.normName}`;
    if (!topByDateEx[key] || r.e1rm > topByDateEx[key]) topByDateEx[key] = r.e1rm;
  });

  // Per-exercise session list
  const exMap = {};
  Object.entries(topByDateEx).forEach(([key, e1rm]) => {
    const [date, normName] = key.split('||');
    if (!exMap[normName]) exMap[normName] = [];
    exMap[normName].push({ date, e1rm });
  });
  Object.values(exMap).forEach(pts => pts.sort((a, b) => new Date(a.date) - new Date(b.date)));

  function deltaPct(pts) {
    if (pts.length < 2) return 0;
    const n = Math.min(2, pts.length);
    const first2 = pts.slice(0, n).reduce((a, p) => a + p.e1rm, 0) / n;
    const last2 = pts.slice(-n).reduce((a, p) => a + p.e1rm, 0) / n;
    return first2 > 0 ? Math.round(((last2 - first2) / first2) * 100) : 0;
  }

  const exercises = Object.entries(exMap)
    .filter(([, pts]) => pts.length >= 2)
    .map(([name, pts]) => ({
      name,
      sessions: pts,
      deltaPct: deltaPct(pts),
      lastE1RM: pts[pts.length - 1].e1rm,
      sessionCount: pts.length,
      mg: getMuscleGroup(name),
    }))
    .sort((a, b) => b.deltaPct - a.deltaPct);

  const growers = exercises.filter(e => e.deltaPct > 0).slice(0, 5);
  const trailers = [...exercises].filter(e => e.deltaPct < 0)
    .sort((a, b) => a.deltaPct - b.deltaPct).slice(0, 5);

  const inspectorExercises = exercises.filter(e => e.sessionCount >= 4);

  // Top 4 growers combined trend
  const top4 = growers.slice(0, 4);
  const trendDates = [...new Set(top4.flatMap(e => e.sessions.map(s => s.date)))].sort();
  const top4Trend = trendDates.map(date => {
    const pt = { date };
    top4.forEach(ex => {
      const s = ex.sessions.find(s => s.date === date);
      if (s) pt[ex.name] = s.e1rm;
    });
    return pt;
  });

  // Weekly aggregates by muscle group
  const weekVolByMG = {};
  const weekHardByMG = {};
  rows.forEach(r => {
    const week = getWeekStart(r.date);
    if (!weekVolByMG[week]) weekVolByMG[week] = {};
    weekVolByMG[week][r.mg] = (weekVolByMG[week][r.mg] || 0) + r.weight * r.reps;
    if (r.diff === 'hard' || r.diff === 'just_right') {
      if (!weekHardByMG[week]) weekHardByMG[week] = {};
      weekHardByMG[week][r.mg] = (weekHardByMG[week][r.mg] || 0) + 1;
    }
  });

  const MG_KEYS = ['chest', 'back', 'delts', 'rear_delts', 'biceps', 'triceps', 'legs', 'calves', 'other'];
  const weekKeys = [...new Set([...Object.keys(weekVolByMG), ...Object.keys(weekHardByMG)])].sort().slice(-12);

  const weeklyVolume = weekKeys.map(week => {
    const r = { week };
    MG_KEYS.forEach(mg => { r[mg] = Math.round(weekVolByMG[week]?.[mg] || 0); });
    return r;
  });

  const weeklyHardSets = weekKeys.map(week => {
    const r = { week };
    MG_KEYS.forEach(mg => { r[mg] = weekHardByMG[week]?.[mg] || 0; });
    return r;
  });

  // Per-session volumes
  const sessionVolumes = entries.map(entry => {
    const vol = Object.values(entry.sets || {}).flat()
      .reduce((a, s) => a + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0), 0);
    const l = (entry.label || '').toLowerCase();
    let cat = 'other';
    if (/leg/.test(l)) cat = 'legs';
    else if (/push|chest|shoulder/.test(l)) cat = 'push';
    else if (/pull|back/.test(l)) cat = 'pull';
    else if (/arm/.test(l)) cat = 'arms';
    return { date: entry.date, label: entry.dateLabel || entry.date, vol: Math.round(vol), cat };
  });

  // Day-of-week
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dowCounts = new Array(7).fill(0);
  entries.forEach(e => {
    if (!e.date) return;
    const [y, m, d] = e.date.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (!isNaN(date)) dowCounts[date.getDay()]++;
  });
  const dayOfWeek = DOW.map((day, i) => ({ day, count: dowCounts[i] }));

  // Effort mix — top 10 most-frequent exercises
  const exFreq = {};
  rows.forEach(r => { exFreq[r.normName] = (exFreq[r.normName] || 0) + 1; });
  const top10names = Object.entries(exFreq).sort(([, a], [, b]) => b - a).slice(0, 10).map(([n]) => n);
  const effortMix = top10names.map(name => {
    const exRows = rows.filter(r => r.normName === name);
    const total = exRows.length;
    const easy = exRows.filter(r => r.diff === 'easy').length;
    const just_right = exRows.filter(r => r.diff === 'just_right').length;
    const hard = exRows.filter(r => r.diff === 'hard').length;
    return { name, easy, just_right, hard, untagged: total - easy - just_right - hard, total };
  });

  return {
    dateRange, sessionCount, totalVolume, totalSets, totalReps,
    distinctLifts, avgSetsPerSession,
    growers, trailers,
    top4Trend, top4Names: top4.map(e => e.name),
    exercises: inspectorExercises,
    weeklyVolume, weeklyHardSets, weekKeys,
    sessionVolumes, dayOfWeek, effortMix,
    MG_KEYS,
  };
}
