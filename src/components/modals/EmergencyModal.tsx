import React from 'react';
import { X, PhoneCall, AlertTriangle, ShieldAlert, Phone, Copy, Check } from 'lucide-react';
import { EmergencyContact } from '../../types';

interface Props {
  contacts: EmergencyContact[];
  onClose: () => void;
}

export const EmergencyModal: React.FC<Props> = ({ contacts, onClose }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Emergency Helplines</h3>
              <p className="text-[10px] text-slate-400">Village &amp; Public Safety Desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mandatory Safety Notice per PDF */}
        <div className="my-3 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-red-800 leading-relaxed">
            <strong className="block font-bold">Important Notice:</strong>
            CIVICEYE is a complaint logging and tracking platform, not an emergency dispatch service.
            Submitting a complaint does not replace calling emergency services directly for immediate danger or electrical hazards.
          </p>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                contact.isHazardEmergency
                  ? 'bg-amber-50/60 border-amber-200'
                  : 'bg-slate-50/80 border-slate-200/80'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{contact.title}</h4>
                  {contact.isHazardEmergency && (
                    <span className="text-[9px] font-bold uppercase bg-red-100 text-red-700 px-1.5 py-0.2 rounded">
                      24x7
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  {contact.department}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                  {contact.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleCopy(contact.id, contact.phone)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs"
                  title="Copy number"
                >
                  {copiedId === contact.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={`tel:${contact.phone}`}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
