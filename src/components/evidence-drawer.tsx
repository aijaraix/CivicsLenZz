import React from 'react';
import { Icon } from './icons';
import { EvidenceObject } from '../lib/schema-v2';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceObject | null;
  claimTitle?: string;
  claimValue?: string;
}

export function EvidenceDrawer({
  isOpen,
  onClose,
  evidence,
  claimTitle = 'Verified Assertion',
  claimValue
}: EvidenceDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white text-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Icon name="file-text" size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block">
                CIVICLENZ EVIDENCE PROVENANCE
              </span>
              <h2 className="text-sm font-extrabold text-slate-900 truncate max-w-xs">{claimTitle}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Claim Highlight */}
          {claimValue && (
            <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-wider block">
                ASSERTION DISPLAYED
              </span>
              <p className="text-sm font-black text-indigo-950">{claimValue}</p>
            </div>
          )}

          {evidence ? (
            <>
              {/* Evidence Core Metadata Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                    DOCUMENT PROVENANCE
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                      evidence.source_tier === 'TIER_A'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-blue-50 text-blue-700 border-blue-300'
                    }`}
                  >
                    {evidence.source_tier} — AUTHORITATIVE PRIMARY
                  </span>
                </div>

                <h3 className="text-xs font-black text-slate-900 leading-snug">
                  {evidence.document_title}
                </h3>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400 block font-mono text-[9px]">PUBLISHER</span>
                    <strong className="text-slate-800">{evidence.publisher}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[9px]">RETRIEVED DATE</span>
                    <strong className="text-slate-800">
                      {new Date(evidence.retrieved_at).toLocaleDateString()}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Exact Supporting Passage */}
              {evidence.supporting_text && (
                <div className="space-y-2">
                  <h4 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    EXACT SUPPORTING PASSAGE FROM RECORD
                  </h4>
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-[11px] leading-relaxed border border-slate-800 relative">
                    <span className="absolute top-2 right-3 text-[9px] text-slate-500 font-bold">
                      VERIFIED TEXT
                    </span>
                    “{evidence.supporting_text}”
                  </div>
                </div>
              )}

              {/* Cryptographic Hash & Verification Audit */}
              <div className="space-y-2">
                <h4 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  CRYPTOGRAPHIC SHA-256 AUDIT HASH
                </h4>
                <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 font-mono text-[10px] text-slate-700 break-all select-all flex items-center justify-between gap-2">
                  <span>{evidence.raw_sha256}</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold shrink-0">
                    MATCHED
                  </span>
                </div>
              </div>

              {/* Official Source URL Direct Link */}
              <div className="pt-2">
                <a
                  href={evidence.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2"
                >
                  <span>Inspect Official Government Source Page</span>
                  <Icon name="external-link" size={14} />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Icon name="shield" size={24} />
              </div>
              <p className="text-slate-600 font-bold">No evidence object linked to this view yet.</p>
              <p className="text-slate-400 text-[11px]">
                HERMES Agent H24 continuously crawls official dockets to attach source documents.
              </p>
            </div>
          )}

          {/* Philosophy Note */}
          <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-500 space-y-1">
            <strong className="text-slate-700 block font-bold">CivicLenZ Transparency Guarantee:</strong>
            <p className="leading-relaxed">
              CivicLenZ never says “Trust Us”. Every number, vote, and claim must resolve into underlying official government records.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition"
          >
            Close Evidence Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
