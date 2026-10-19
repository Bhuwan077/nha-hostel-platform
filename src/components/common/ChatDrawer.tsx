import React, { useState } from 'react';
import { X, Send, MessageSquare, ShieldCheck, User, Building, Clock } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  branchId?: string;
  defaultParticipantName?: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  branchId,
  defaultParticipantName = 'Guest Prospective Student',
}) => {
  const {
    chatThreads,
    sendChatMessage,
    startOrGetChatThread,
    branches,
    currentRole,
  } = usePlatform();

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  // Auto-select or create thread if branchId is provided
  const currentBranch = branches.find((b) => b.id === branchId) || branches[0];
  const targetThreadId =
    activeThreadId ||
    chatThreads.find((t) => t.branchId === currentBranch.id)?.id ||
    startOrGetChatThread(currentBranch.id, defaultParticipantName, 'prospective');

  const activeThread = chatThreads.find((t) => t.id === targetThreadId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    let senderRole: 'prospective' | 'student' | 'parent' | 'warden' = 'prospective';
    let senderName = defaultParticipantName;

    if (currentRole === 'warden') {
      senderRole = 'warden';
      senderName = `${currentBranch.wardenName} (Warden)`;
    } else if (currentRole === 'student') {
      senderRole = 'student';
      senderName = 'Aarav Shrestha (Resident)';
    } else if (currentRole === 'parent') {
      senderRole = 'parent';
      senderName = 'Rameshwor Shrestha (Parent)';
    }

    sendChatMessage(activeThread.id, inputText.trim(), senderRole, senderName);
    setInputText('');

    // If prospective or student sent message and role is not warden, simulate a warden auto-acknowledgement after 1.5s
    if (senderRole !== 'warden') {
      setTimeout(() => {
        sendChatMessage(
          activeThread.id,
          `Namaste! Warden ${currentBranch.wardenName} has received your inquiry and will follow up shortly. You may also contact our branch front-desk at ${currentBranch.contactPhone}.`,
          'warden',
          `${currentBranch.wardenName} (Warden)`
        );
      }, 1500);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] animate-in slide-in-from-bottom-6 duration-200">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs truncate max-w-[190px]">
              {activeThread?.branchName || currentBranch.name}
            </h4>
            <div className="flex items-center space-x-1 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Warden Online • Live Assistance</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
        <div className="bg-blue-50/80 border border-blue-200 text-blue-900 p-2.5 rounded-xl text-[11px] leading-relaxed">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700 inline mr-1" />
          <strong>NHA Official Channel:</strong> Pre-enrollment & resident queries are logged under NHA audit standards.
        </div>

        {activeThread?.messages.map((msg) => {
          const isMe =
            (currentRole === 'warden' && msg.senderRole === 'warden') ||
            (currentRole !== 'warden' && msg.senderRole !== 'warden');

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-slate-400 mb-0.5 px-1 font-medium">
                {msg.senderName}
              </span>
              <div
                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl ${
                  isMe
                    ? 'bg-blue-900 text-white rounded-br-none shadow-sm'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <span
                  className={`text-[9px] block text-right mt-1 font-mono ${
                    isMe ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask warden about rooms, food, gate curfew..."
          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          className="p-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl transition-colors shadow-sm disabled:opacity-50"
          disabled={!inputText.trim()}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
