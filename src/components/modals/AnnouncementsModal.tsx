import React, { useState } from 'react';
import { X, Megaphone, Plus, AlertTriangle, Calendar, ShieldCheck } from 'lucide-react';
import { VillageAnnouncement } from '../../types';
import { storage } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';

interface Props {
  announcements: VillageAnnouncement[];
  onClose: () => void;
}

export const AnnouncementsModal: React.FC<Props> = ({ announcements, onClose }) => {
  const { role, user } = useAuth();
  const isAdmin = role === 'admin';

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'General' | 'Power Outage' | 'Water Supply' | 'Road Work' | 'Health Alert'>('General');
  const [severity, setSeverity] = useState<'info' | 'warning' | 'urgent'>('info');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    storage.addAnnouncement({
      title: title.trim(),
      message: message.trim(),
      category,
      severity,
      publishedBy: user?.name || 'Panchayat Officer'
    });

    setTitle('');
    setMessage('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Village Announcements</h3>
              <p className="text-[10px] text-slate-400">Gram Panchayat Public Notices</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && !isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Notice</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Create Notice Form (Admin only) */}
        {isCreating && isAdmin ? (
          <form onSubmit={handlePublish} className="my-3 p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-900">Draft New Public Notice</span>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500">Notice Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheduled Power Outage / Water Supply Notice"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs mt-0.5 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs mt-0.5 outline-none"
                >
                  <option value="General">General</option>
                  <option value="Power Outage">Power Outage</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Road Work">Road Work</option>
                  <option value="Health Alert">Health Alert</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs mt-0.5 outline-none"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500">Notice Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write message for all village residents..."
                rows={3}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs mt-0.5 outline-none resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-xs"
            >
              Broadcast Notice
            </button>
          </form>
        ) : null}

        {/* Notices List */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
          {announcements.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">
              No active announcements at this time.
            </p>
          ) : (
            announcements.map((ann) => (
              <div
                key={ann.id}
                className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                  ann.severity === 'urgent'
                    ? 'bg-rose-50/70 border-rose-200'
                    : ann.severity === 'warning'
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      ann.severity === 'urgent'
                        ? 'bg-rose-200 text-rose-800'
                        : ann.severity === 'warning'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {ann.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(ann.publishDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-xs leading-snug">{ann.title}</h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">{ann.message}</p>
                <p className="text-[10px] text-slate-400 pt-1">
                  Issued by: <span className="font-semibold text-slate-600">{ann.publishedBy}</span>
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
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
