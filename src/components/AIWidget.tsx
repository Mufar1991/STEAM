import { useEffect, useRef, useState } from 'react';
import { Bot, Send, X, Zap } from 'lucide-react';
import type { AIContext, ChatMessage } from '@/lib/ai';
import { getAIResponse, getQuickPrompts } from '@/lib/ai';

interface AIWidgetProps {
  context: AIContext;
}

function welcomeMessage(role: 'siswa' | 'guru'): string {
  if (role === 'guru') {
    return 'Halo, Bapak/Ibu! Aku asisten pedagogis STEM. Aku siap membantu menyusun modul, strategi diferensiasi, dan analisis rubrik. Apa yang bisa aku bantu?';
  }
  return 'Halo! Aku mentor STEM-mu. Aku di sini untuk membantumu berpikir kritis, bukan memberi jawaban langsung. Apa yang sedang kamu kerjakan?';
}

export function AIWidget({ context }: AIWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = getQuickPrompts(context.role);

  useEffect(() => {
    setMessages([
      { id: crypto.randomUUID(), role: 'ai', text: welcomeMessage(context.role), timestamp: Date.now() },
    ]);
  }, [context.role]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);
    try {
      const response = await getAIResponse(text, context);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'ai', text: response, timestamp: Date.now() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'ai', text: 'Maaf, aku mengalami kendala. Coba lagi ya!', timestamp: Date.now() },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="no-print fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-3 text-xs font-bold text-white shadow-2xl transition active:scale-95 sm:right-6"
        >
          <Bot className="h-5 w-5" />
          <span className="hidden sm:inline">Ask STEM AI</span>
          <span className="sm:hidden">AI</span>
        </button>
      )}

      {open && (
        <div className="no-print fixed inset-x-3 bottom-24 z-50 sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-96">
          <div className="flex h-[60vh] max-h-[480px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-amber-500">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold">STEM AI Assistant</p>
                  <p className="text-[10px] text-slate-300">
                    {context.role === 'guru' ? 'AI Pedagogical Assistant' : 'Socrates STEM Tutor'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-300 transition hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-950/50 p-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-800/40 text-slate-200 border border-white/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl bg-slate-800/40 px-3 py-2.5 border border-white/10">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-rose-400" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: '300ms' }} />
                    <span className="ml-1 text-[10px] text-slate-400">AI sedang berpikir...</span>
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-1.5 border-t border-white/10 bg-slate-900/40 px-3 py-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    disabled={thinking}
                    className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-slate-300 transition hover:bg-white/20 disabled:opacity-50 border border-white/10"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/10 bg-slate-900/40 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={context.role === 'guru' ? 'Tanya sesuatu tentang pengajaran...' : 'Tanya sesuatu tentang proyekmu...'}
                className="flex-1 rounded-full bg-slate-800/40 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-rose-300 border border-white/10 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={thinking || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white transition active:scale-90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}