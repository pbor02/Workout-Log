import { useState, useMemo } from 'react';
import {
  LineChart, BarChart, ComposedChart, Area, Line, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { COLORS, MG_COLORS } from '../theme/colors.js';
import { computeAnalytics } from '../lib/analytics.js';

const F = {
  display: "'Bebas Neue', 'Oswald', Impact, sans-serif",
  body: "'Inter Tight', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// Common chart props
const GRID = <CartesianGrid strokeDasharray="2 4" stroke={COLORS.shadow} strokeOpacity={0.15} />;
const axisProps = { fontSize: 10, fontFamily: F.mono, fill: COLORS.shadow, tick: { fontFamily: F.mono, fill: COLORS.shadow } };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: COLORS.ink, border: `1px solid ${COLORS.blood}`, padding: '8px 12px', fontFamily: F.mono, fontSize: 11 }}>
      <div style={{ color: COLORS.paper, marginBottom: 4, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || COLORS.paper }}>
          {p.name}: {typeof p.value === 'number' && p.value > 999 ? `${(p.value / 1000).toFixed(1)}k` : p.value}
        </div>
      ))}
    </div>
  );
}

const CAT_COLORS = { legs: COLORS.rust, arms: COLORS.gold, push: COLORS.moss, pull: '#3d5a6c', other: COLORS.shadow };
const LINE_COLORS = [COLORS.blood, COLORS.gold, COLORS.moss, '#3d5a6c'];

// Section header component
function SectionHeader({ n, title, sub }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <span style={{ fontFamily: F.mono, fontSize: 11, color: COLORS.blood, letterSpacing: 1 }}>§ {n.toString().padStart(2, '0')} </span>
      <span style={{ fontFamily: F.display, fontSize: 22, color: COLORS.ink, letterSpacing: 1 }}>{title}</span>
      {sub && <div style={{ fontFamily: F.mono, fontSize: 11, color: COLORS.shadow, fontStyle: 'italic', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ borderLeft: `3px solid ${accent || COLORS.blood}`, paddingLeft: 8, minWidth: 0 }}>
      <div style={{ fontFamily: F.display, fontSize: 22, color: COLORS.ink, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: F.mono, fontSize: 9, color: COLORS.shadow }}>{sub}</div>}
      <div style={{ fontFamily: F.mono, fontSize: 9, color: COLORS.shadow, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function LeaderRow({ rank, name, deltaPct, lastE1RM, isGrower }) {
  const color = isGrower ? COLORS.moss : COLORS.blood;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: `1px solid ${COLORS.bone}` }}>
      <span style={{ fontFamily: F.mono, fontSize: 10, color: COLORS.shadow, width: 16, flexShrink: 0 }}>{rank}</span>
      <span style={{ fontFamily: F.body, fontSize: 12, color: COLORS.ink, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
      <span style={{ fontFamily: F.mono, fontSize: 11, color: color, fontWeight: 600, flexShrink: 0 }}>
        {isGrower ? '+' : ''}{deltaPct}%
      </span>
      <span style={{ fontFamily: F.mono, fontSize: 10, color: COLORS.shadow, flexShrink: 0 }}>{lastE1RM}lb</span>
    </div>
  );
}

export default function LedgerView({ history }) {
  const [inspectorEx, setInspectorEx] = useState(null);

  const data = useMemo(() => computeAnalytics(history), [history]);

  const cardStyle = {
    background: COLORS.bone,
    border: `1px solid ${COLORS.ink}`,
    padding: '16px',
    marginBottom: 0,
    borderRadius: 0,
  };

  const dotGrid = {
    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)`,
    backgroundSize: '20px 20px',
  };

  if (!data) {
    return (
      <div style={{ ...dotGrid, background: COLORS.paper, minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: F.display, fontSize: 32, color: COLORS.ink, letterSpacing: 2 }}>NO DATA</div>
          <div style={{ fontFamily: F.mono, fontSize: 12, color: COLORS.shadow, marginTop: 8 }}>Log some sessions first.</div>
        </div>
      </div>
    );
  }

  const { dateRange, sessionCount, totalVolume, totalSets, totalReps, distinctLifts, avgSetsPerSession,
    growers, trailers, top4Trend, top4Names, exercises: inspectorExercises,
    weeklyVolume, weeklyHardSets, weekKeys, sessionVolumes, dayOfWeek, effortMix, MG_KEYS } = data;

  const peakVol = Math.max(...sessionVolumes.map(s => s.vol), 1);
  const maxDow = Math.max(...dayOfWeek.map(d => d.count), 1);

  const inspectorData = inspectorEx
    ? (inspectorExercises.find(e => e.name === inspectorEx)?.sessions || [])
    : [];

  // Format week label as "MMM D"
  const fmtWeek = (w) => {
    const [y, m, d] = w.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const weeklyVolumeDisplay = weeklyVolume.map(w => ({ ...w, week: fmtWeek(w.week) }));
  const weeklyHardDisplay = weeklyHardSets.map(w => ({ ...w, week: fmtWeek(w.week) }));

  return (
    <div style={{ ...dotGrid, background: COLORS.paper, fontFamily: F.body, color: COLORS.ink, paddingBottom: 80 }}>

      {/* ── MASTHEAD ── */}
      <div style={{ background: COLORS.ink, color: COLORS.paper, padding: '20px 16px 16px', borderBottom: `2px solid ${COLORS.blood}` }}>
        <div style={{ fontFamily: F.display, fontSize: 36, letterSpacing: 3, lineHeight: 1 }}>
          THE <em style={{ color: COLORS.blood, fontStyle: 'italic' }}>POWER</em> LEDGER
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10 }}>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: COLORS.bone, opacity: 0.7 }}>
            {dateRange.startLabel} — {dateRange.endLabel}
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: COLORS.blood, fontWeight: 600 }}>
            {sessionCount} SESSIONS
          </div>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div style={{ ...cardStyle, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 12px', borderTop: 'none' }}>
        <StatCard label="Volume" value={`${(totalVolume / 1000).toFixed(0)}K`} sub="lb total" accent={COLORS.blood} />
        <StatCard label="Sets" value={totalSets.toLocaleString()} accent={COLORS.rust} />
        <StatCard label="Reps" value={totalReps > 999 ? `${(totalReps / 1000).toFixed(1)}K` : totalReps} accent={COLORS.gold} />
        <StatCard label="Sessions" value={sessionCount} accent={COLORS.moss} />
        <StatCard label="Lifts" value={distinctLifts} sub="distinct" accent={COLORS.shadow} />
        <StatCard label="Sets/Session" value={avgSetsPerSession} accent={COLORS.rust} />
      </div>

      {/* ── GROWERS / TRAILERS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderTop: `1px solid ${COLORS.ink}` }}>
        <div style={{ ...cardStyle, borderRight: `1px solid ${COLORS.ink}` }}>
          <div style={{ fontFamily: F.display, fontSize: 14, color: COLORS.moss, letterSpacing: 1, marginBottom: 8 }}>▲ GROWERS</div>
          {growers.map((e, i) => (
            <LeaderRow key={e.name} rank={i + 1} name={e.name} deltaPct={e.deltaPct} lastE1RM={e.lastE1RM} isGrower={true} />
          ))}
          {!growers.length && <div style={{ fontFamily: F.mono, fontSize: 11, color: COLORS.shadow }}>Not enough data</div>}
        </div>
        <div style={{ ...cardStyle, borderLeft: 'none' }}>
          <div style={{ fontFamily: F.display, fontSize: 14, color: COLORS.blood, letterSpacing: 1, marginBottom: 8 }}>▼ TRAILING</div>
          {trailers.map((e, i) => (
            <LeaderRow key={e.name} rank={i + 1} name={e.name} deltaPct={e.deltaPct} lastE1RM={e.lastE1RM} isGrower={false} />
          ))}
          {!trailers.length && <div style={{ fontFamily: F.mono, fontSize: 11, color: COLORS.shadow }}>Nothing trailing</div>}
        </div>
      </div>

      {/* ── §01 TOP GROWERS TREND ── */}
      {top4Trend.length > 1 && (
        <div style={{ ...cardStyle, borderTop: `1px solid ${COLORS.ink}` }}>
          <SectionHeader n={1} title="MOMENTUM ARC" sub="top 4 growers — estimated 1RM (lb)" />
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={top4Trend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              {GRID}
              <XAxis dataKey="date" {...axisProps} tickFormatter={d => d.slice(5)} interval="preserveStartEnd" />
              <YAxis {...axisProps} />
              <Tooltip content={<CustomTooltip />} />
              {top4Names.map((name, i) => (
                <Line key={name} type="monotone" dataKey={name} stroke={LINE_COLORS[i]} strokeWidth={2}
                  dot={false} connectNulls activeDot={{ r: 3, fill: LINE_COLORS[i] }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', marginTop: 8 }}>
            {top4Names.map((name, i) => (
              <span key={name} style={{ fontFamily: F.mono, fontSize: 10, color: LINE_COLORS[i] }}>■ {name}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── §02 EXERCISE INSPECTOR ── */}
      {inspectorExercises.length > 0 && (
        <div style={{ ...cardStyle, borderTop: `1px solid ${COLORS.ink}` }}>
          <SectionHeader n={2} title="EXERCISE INSPECTOR" sub="select a lift — estimated 1RM arc" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {inspectorExercises.map(ex => (
              <button key={ex.name} onClick={() => setInspectorEx(ex.name === inspectorEx ? null : ex.name)}
                style={{ fontFamily: F.mono, fontSize: 10, padding: '4px 8px', border: `1px solid ${inspectorEx === ex.name ? COLORS.blood : COLORS.ink}`,
                  background: inspectorEx === ex.name ? COLORS.blood : 'transparent',
                  color: inspectorEx === ex.name ? COLORS.paper : COLORS.ink, cursor: 'pointer', borderRadius: 0 }}>
                {ex.name}
              </button>
            ))}
          </div>
          {inspectorData.length > 1 && (
            <ResponsiveContainer width="100%" height={160}>
              <ComposedChart data={inspectorData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                {GRID}
                <XAxis dataKey="date" {...axisProps} tickFormatter={d => d.slice(5)} interval="preserveStartEnd" />
                <YAxis {...axisProps} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="e1rm" fill={`${COLORS.blood}18`} stroke={COLORS.blood} strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
          {!inspectorEx && <div style={{ fontFamily: F.mono, fontSize: 11, color: COLORS.shadow, textAlign: 'center', padding: '16px 0' }}>Select an exercise above</div>}
        </div>
      )}

      {/* ── §03 WEEKLY VOLUME BY MG ── */}
      {weeklyVolumeDisplay.length > 0 && (
        <div style={{ ...cardStyle, borderTop: `1px solid ${COLORS.ink}` }}>
          <SectionHeader n={3} title="WEEKLY VOLUME" sub="lb by muscle group — last 12 weeks" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyVolumeDisplay} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              {GRID}
              <XAxis dataKey="week" {...axisProps} interval="preserveStartEnd" />
              <YAxis {...axisProps} tickFormatter={v => v > 999 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              {MG_KEYS.filter(mg => weeklyVolumeDisplay.some(w => w[mg] > 0)).map(mg => (
                <Bar key={mg} dataKey={mg} stackId="a" fill={MG_COLORS[mg]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── §04 WEEKLY HARD SETS ── */}
      {weeklyHardDisplay.length > 0 && (
        <div style={{ ...cardStyle, borderTop: `1px solid ${COLORS.ink}` }}>
          <SectionHeader n={4} title="HARD SETS / WEEK" sub="near-failure stimulus — hard + just-right rated sets" />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyHardDisplay} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              {GRID}
              <XAxis dataKey="week" {...axisProps} interval="preserveStartEnd" />
              <YAxis {...axisProps} />
              <Tooltip content={<CustomTooltip />} />
              {MG_KEYS.filter(mg => weeklyHardDisplay.some(w => w[mg] > 0)).map(mg => (
                <Bar key={mg} dataKey={mg} stackId="a" fill={MG_COLORS[mg]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── §05 SESSION VOLUMES ── */}
      {sessionVolumes.length > 0 && (
        <div style={{ ...cardStyle, borderTop: `1px solid ${COLORS.ink}` }}>
          <SectionHeader n={5} title="SESSION VOLUMES" sub="lb per session — peak highlighted" />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={sessionVolumes} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              {GRID}
              <XAxis dataKey="label" {...axisProps} interval="preserveStartEnd" />
              <YAxis {...axisProps} tickFormatter={v => v > 999 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="vol" radius={0}>
                {sessionVolumes.map((s, i) => (
                  <Cell key={i} fill={s.vol === peakVol ? COLORS.blood : (CAT_COLORS[s.cat] || COLORS.shadow)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 6 }}>
            {Object.entries(CAT_COLORS).map(([cat, color]) => (
              <span key={cat} style={{ fontFamily: F.mono, fontSize: 10, color }}>■ {cat}</span>
            ))}
            <span style={{ fontFamily: F.mono, fontSize: 10, color: COLORS.blood }}>■ peak</span>
          </div>
        </div>
      )}

      {/* ── §06 DAY OF WEEK ── */}
      <div style={{ ...cardStyle, borderTop: `1px solid ${COLORS.ink}` }}>
        <SectionHeader n={6} title="DAY DISTRIBUTION" sub="sessions logged per day of week" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {dayOfWeek.map(({ day, count }) => {
            const pct = maxDow > 0 ? (count / maxDow) * 100 : 0;
            const isPeak = count > 0 && count === maxDow;
            return (
              <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: F.mono, fontSize: 11, color: COLORS.shadow, width: 28, flexShrink: 0 }}>{day}</span>
                <div style={{ flex: 1, height: 14, background: COLORS.paper, border: `1px solid ${COLORS.ink}`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${pct}%`, background: isPeak ? COLORS.blood : COLORS.shadow, opacity: isPeak ? 1 : 0.5 }} />
                </div>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: isPeak ? COLORS.blood : COLORS.shadow, width: 16, textAlign: 'right', flexShrink: 0 }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── §07 EFFORT MIX ── */}
      {effortMix.length > 0 && effortMix.some(e => e.easy + e.just_right + e.hard > 0) && (
        <div style={{ ...cardStyle, borderTop: `1px solid ${COLORS.ink}` }}>
          <SectionHeader n={7} title="EFFORT MIX" sub="top 10 lifts — easy / just right / hard ratio" />
          <div style={{ display: 'flex', gap: 12, marginBottom: 8, fontFamily: F.mono, fontSize: 10 }}>
            <span style={{ color: COLORS.moss }}>■ easy</span>
            <span style={{ color: COLORS.gold }}>■ just right</span>
            <span style={{ color: COLORS.blood }}>■ hard</span>
            <span style={{ color: COLORS.shadow }}>■ untagged</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {effortMix.map(({ name, easy, just_right, hard, untagged, total }) => {
              if (!total) return null;
              return (
                <div key={name}>
                  <div style={{ fontFamily: F.mono, fontSize: 10, color: COLORS.shadow, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                  <div style={{ height: 12, display: 'flex', border: `1px solid ${COLORS.ink}`, overflow: 'hidden' }}>
                    {easy > 0 && <div style={{ width: `${(easy / total) * 100}%`, background: COLORS.moss }} />}
                    {just_right > 0 && <div style={{ width: `${(just_right / total) * 100}%`, background: COLORS.gold }} />}
                    {hard > 0 && <div style={{ width: `${(hard / total) * 100}%`, background: COLORS.blood }} />}
                    {untagged > 0 && <div style={{ width: `${(untagged / total) * 100}%`, background: COLORS.bone }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div style={{ background: COLORS.ink, color: COLORS.paper, padding: '16px', marginTop: 0, borderTop: `2px solid ${COLORS.blood}` }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: COLORS.bone, opacity: 0.6, marginBottom: 6 }}>
          {dateRange.startLabel} — {dateRange.endLabel} · {(totalVolume / 1000).toFixed(1)}K lb
        </div>
        <div style={{ fontFamily: F.display, fontSize: 18, letterSpacing: 2, color: COLORS.blood }}>
          NO BARBELL. NO EXCUSES.
        </div>
      </div>
    </div>
  );
}
