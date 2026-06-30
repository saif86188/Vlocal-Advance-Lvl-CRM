import { useState } from 'react';
import { useAdminStore } from '@/modules/admin/data/store';
import { MessageSquare, X, Send } from 'lucide-react';
import { toast } from 'sonner';

export function Discussions() {
  const { state, dispatch } = useAdminStore();
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [chatMsg, setChatMsg] = useState('');

  const handleSend = () => {
    if (!chatMsg.trim() || !selectedRoom) return;
    const msg = {
      id: `msg-${Date.now()}`,
      senderId: 'a-1',
      senderRole: 'admin',
      content: chatMsg,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_DISCUSSION_MESSAGE', payload: { discussionId: selectedRoom.id, message: msg } });
    setChatMsg('');
    toast.success('Message sent!');
    // Update local view
    setSelectedRoom((prev: any) => prev ? { ...prev, messages: [...prev.messages, msg], unreads: 0 } : null);
  };

  const discussion = selectedRoom ? state.discussions.find(d => d.id === selectedRoom.id) : null;

  return (
    <div className="flex flex-col gap-[var(--gap-section)] relative">
      <div className="flex items-center justify-between">
        <div>
          <h1>Discussion Rooms</h1>
          <p className="text-[var(--text-secondary)] mt-1">{state.discussions.length} active room{state.discussions.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--gap-card)]">
        {state.discussions.map(room => {
          const lastMsg = room.messages[room.messages.length - 1];
          return (
            <div key={room.id}
              className="glass-card p-5 flex flex-col hover:border-[var(--border-default)] transition-all cursor-pointer group relative"
              onClick={() => setSelectedRoom(room)}>
              {room.unreads > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--accent)] text-white rounded-full flex items-center justify-center text-[11px] font-bold shadow-lg">
                  {room.unreads}
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--accent-dim)] border border-[var(--accent)] flex items-center justify-center">
                  <MessageSquare size={18} className="text-[var(--accent)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px]">
                    {room.clientId === 'u-1' ? 'Apex Corp' : 'Nova Tech'}
                  </h3>
                  <div className="text-[12px] text-[var(--text-secondary)]">Brand Identity • V2</div>
                </div>
              </div>

              <div className="flex-1 bg-[var(--bg-elevated)] rounded-[var(--radius-sm)] p-3 border border-[var(--border-subtle)] mb-4">
                <div className="text-[11px] text-[var(--text-muted)] mb-1">Last message</div>
                {lastMsg ? (
                  <>
                    <div className="text-[13px] text-[var(--text-secondary)] line-clamp-2">
                      "{lastMsg.content}"
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-1">
                      {lastMsg.senderRole === 'admin' ? 'You' : 'Client'} • {new Date(lastMsg.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </>
                ) : (
                  <div className="text-[13px] text-[var(--text-muted)] italic">No messages yet</div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                  <span className="text-[11px] text-[var(--success)]">Active</span>
                </div>
                <span className="text-[12px] text-[var(--accent)] font-medium group-hover:underline">Open Room →</span>
              </div>
            </div>
          );
        })}

        {state.discussions.length === 0 && (
          <div className="col-span-3 glass-card p-12 text-center">
            <MessageSquare size={32} className="text-[var(--text-muted)] mx-auto mb-3" />
            <div className="font-medium text-[15px] text-[var(--text-secondary)]">No discussion rooms yet</div>
            <div className="text-[13px] text-[var(--text-muted)] mt-1">Rooms are created when clients request changes on proposals</div>
          </div>
        )}
      </div>

      {/* Full Chat Slide-over */}
      {selectedRoom && discussion && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]" onClick={() => setSelectedRoom(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] z-[9999] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[15px]">
                  {discussion.clientId === 'u-1' ? 'Apex Corp' : 'Nova Tech'}
                </h3>
                <p className="text-[11.5px] text-[var(--text-secondary)]">Brand Identity + Website • V2</p>
              </div>
              <button onClick={() => setSelectedRoom(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1">
                <X size={18} />
              </button>
            </div>

            {/* System message */}
            <div className="px-4 py-2 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)]">
              <div className="text-center text-[11px] text-[var(--text-muted)] bg-[var(--bg-hover)] rounded-full px-3 py-1 inline-block mx-auto">
                💬 Discussion started for Proposal V2 — May 3, 2025
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {discussion.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-[10px] p-3 text-[13px] leading-relaxed ${
                    msg.senderRole === 'admin'
                      ? 'bg-[var(--accent)] text-white rounded-tr-none'
                      : 'bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] rounded-tl-none'
                  }`}>
                    <div className="text-[11px] opacity-70 mb-1">
                      {msg.senderRole === 'admin' ? 'VLOCAL Team' : 'Client'} • {new Date(msg.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[var(--border-subtle)]">
              <div className="flex gap-2">
                <input
                  className="vlocal-input flex-1 text-[13px]"
                  placeholder="Type a message…"
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                />
                <button onClick={handleSend}
                  className="vlocal-btn bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

