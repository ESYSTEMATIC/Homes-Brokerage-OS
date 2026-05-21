// ═══════════════════════════════════════════════════════════════════════
// PipelineNotes — stage-tagged notes threads + audit timeline
// ───────────────────────────────────────────────────────────────────────
// SME feedback (May 2026):
//   • Recruiters need to add notes for every stage of a pipeline record
//     (candidate pipeline + onboarding pipeline) — kept as a running thread.
//   • The candidate drawer needs a visible audit trail of every action and
//     status change, sourced from the global audit log.
//
// StageNotesThread       — composer + thread, stored on record.notes[].
// AuditTimeline          — read-only activity feed from the audit log.
// CandidatePipelinePanel — tabbed Notes / Activity panel for the candidate
//                          drawer; re-derives data from context so it's live.
// ═══════════════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Clock, Send } from 'lucide-react';

const fmtTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? String(iso) : d.toLocaleString();
};

// ─── StageNotesThread ───────────────────────────────────────────────────
// Running, stage-tagged notes for a pipeline record. Every note records the
// stage the record was in when written, plus author + timestamp. Callers
// must pass `record` looked up fresh from context so the thread stays live.
export const StageNotesThread = ({ slice, record, stageField = 'stage', field = 'stageNotes', module }) => {
  const { updateItem, persona } = useApp();
  const [draft, setDraft] = useState('');

  if (!record) return null;
  // Dedicated `stageNotes` array — kept separate from any legacy free-text
  // `notes` string the record may already carry (e.g. onboarding records).
  const notes = [...(record[field] || [])].sort((a, b) => new Date(b.at) - new Date(a.at));
  const currentStage = record[stageField] || '—';

  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    const entry = {
      id: `NOTE-${Date.now()}`,
      stage: currentStage,
      text,
      by: persona?.label || 'User',
      at: new Date().toISOString(),
    };
    updateItem(slice, record.id, { [field]: [...(record[field] || []), entry] }, {
      action: 'Pipeline Note Added',
      module: module || (slice === 'onboarding' ? 'Backoffice' : 'Recruitment'),
      target: record.id,
      detail: `Note added at stage "${currentStage}"`,
    });
    setDraft('');
  };

  return (
    <div>
      {/* Composer */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 12, background: '#fafbfc', marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <MessageSquare size={12} /> Add a note · tagged to stage &ldquo;{currentStage}&rdquo;
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a note for this stage…"
          rows={3}
          style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 12.5, fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="btn btn-primary btn-sm" onClick={addNote} disabled={!draft.trim()}>
            <Send size={12} /> Add note
          </button>
        </div>
      </div>

      {/* Thread */}
      {notes.length === 0 ? (
        <div style={{ padding: '24px 14px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 12, background: '#fafbfc', border: '1px dashed var(--border)', borderRadius: 10 }}>
          No notes yet. Notes you add are tagged with the current stage and kept as a thread.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notes.map((n) => (
            <div key={n.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--brand)', background: 'var(--brand-tint)', borderRadius: 4, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '.05em' }}>{n.stage}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{n.by}</span>
                <span style={{ fontSize: 10, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>{fmtTime(n.at)}</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{n.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── AuditTimeline ──────────────────────────────────────────────────────
// Read-only activity feed for a record, sourced from the global audit log
// (entries whose target === recordId). The audit log is newest-first.
export const AuditTimeline = ({ entries }) => {
  const list = [...(entries || [])];
  if (!list.length) {
    return (
      <div style={{ padding: '24px 14px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 12, background: '#fafbfc', border: '1px dashed var(--border)', borderRadius: 10 }}>
        No recorded activity yet.
      </div>
    );
  }
  return (
    <div style={{ position: 'relative', paddingLeft: 24 }}>
      <div style={{ position: 'absolute', left: 9, top: 6, bottom: 6, width: 1, background: 'var(--border)' }} />
      {list.map((e, i) => (
        <div key={e.id || i} style={{ position: 'relative', marginBottom: 16 }}>
          <div style={{ position: 'absolute', left: -22, top: 2, width: 18, height: 18, borderRadius: '50%', background: 'var(--brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxShadow: '0 0 0 1px var(--border)' }}>
            <Clock size={10} />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>{e.action}</div>
            <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{e.timestamp} · {e.actor}{e.module ? ` · ${e.module}` : ''}</div>
            {e.detail && <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 4, padding: '6px 10px', background: '#f8fafc', borderRadius: 6 }}>{e.detail}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── CandidatePipelinePanel ─────────────────────────────────────────────
// Tabbed Notes / Activity panel embedded in the candidate drawer. Re-derives
// the candidate + audit log from context so both tabs update live.
export const CandidatePipelinePanel = ({ candidateId }) => {
  const { state } = useApp();
  const [tab, setTab] = useState('notes');
  const candidate = (state.candidates || []).find((c) => c.id === candidateId);
  if (!candidate) return null;
  const auditEntries = (state.audit || []).filter((e) => e.target === candidateId);

  const tabs = [
    ['notes', 'Notes', MessageSquare, (candidate.stageNotes || []).length],
    ['activity', 'Activity', Clock, auditEntries.length],
  ];

  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
        {tabs.map(([k, label, Icon, count]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              padding: '9px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: 'transparent', border: 'none',
              color: tab === k ? 'var(--brand)' : 'var(--text-secondary)',
              borderBottom: tab === k ? '2px solid var(--brand)' : '2px solid transparent',
              marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <Icon size={13} /> {label}
            <span style={{ fontSize: 10, fontWeight: 700, color: tab === k ? 'var(--brand)' : 'var(--text-tertiary)', background: tab === k ? 'var(--brand-tint)' : '#f1f5f9', borderRadius: 999, padding: '1px 7px' }}>{count}</span>
          </button>
        ))}
      </div>
      {tab === 'notes' && <StageNotesThread slice="candidates" record={candidate} stageField="stage" module="Recruitment" />}
      {tab === 'activity' && <AuditTimeline entries={auditEntries} />}
    </div>
  );
};
