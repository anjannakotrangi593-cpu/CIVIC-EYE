import React from 'react';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { AppNotification } from '../../types';

interface Props {
  notifications: AppNotification[];
  onBack: () => void;
  onMarkAllRead: () => void;
  onSelectNotification: (item: AppNotification) => void;
}

export const Screen12_Notifications: React.FC<Props> = ({
  notifications,
  onBack,
  onMarkAllRead,
  onSelectNotification
}) => {
  const getIconForType = (type: string, title: string) => {
    if (title.toLowerCase().includes('completed') || title.toLowerCase().includes('resolved')) {
      return (
        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      );
    }
    if (title.toLowerCase().includes('in progress')) {
      return (
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      );
    }
    if (title.toLowerCase().includes('pending') || title.toLowerCase().includes('submitted')) {
      return (
        <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
      );
    }
    if (type === 'announcement' || type === 'urgent_hazard') {
      return (
        <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
        <Sparkles className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/70 justify-between overflow-hidden">
      <div>
        {/* Header */}
        <div className="bg-white px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-base text-slate-800">Notifications</h2>
          </div>

          <button
            onClick={onMarkAllRead}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            title="Mark all as read"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-2.5 overflow-y-auto max-h-[calc(100vh-180px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <Bell className="w-10 h-10 mb-2 stroke-[1.5]" />
              <p className="text-xs font-semibold">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                  notif.read
                    ? 'bg-white border-slate-200/80 hover:bg-slate-50/80'
                    : 'bg-blue-50/50 border-blue-200 hover:bg-blue-50/80 shadow-xs'
                }`}
              >
                {getIconForType(notif.type, notif.title)}

                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center justify-between gap-1">
                    <h4
                      className={`text-xs truncate ${
                        notif.read ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" title="Unread" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    {new Date(notif.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-4 bg-white border-t border-slate-100">
        <button
          onClick={onMarkAllRead}
          className="w-full py-2.5 text-center text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
};
