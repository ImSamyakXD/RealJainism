'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  source?: string;
}

const QUICK_PROMPTS = [
  'Jai Jinendra',
  'पंच महाव्रत',
  'अनेकांतवाद',
  'Karma Theory',
];

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Jai Jinendra! 🙏 I am JainGPT, your scriptural AI assistant. I can answer your questions on Jainism, Agams, philosophy, and daily practice grounded in authentic scriptures!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Hide floating widget if already on the standalone full-page JainGPT route (/chat)
  if (pathname === '/chat') {
    return null;
  }

  const handleSend = async (textOverride?: string) => {
    const query = (textOverride || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textOverride) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.answer || 'Apologies, no response was generated. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat submit error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Unable to connect to the server right now. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearMemory = async () => {
    try {
      await fetch('/api/chat/clear', { method: 'POST' });
    } catch (e) {
      console.error('Failed to clear backend memory:', e);
    }
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Conversation history cleared. Jai Jinendra! How can I assist you with Jain scriptures today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const copyToClipboard = (text: string, id: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }).catch(() => fallbackCopy(text, id));
    } else {
      fallbackCopy(text, id);
    }
  };

  const fallbackCopy = (text: string, id: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Fallback copy error:', err);
    }
    document.body.removeChild(textarea);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pb-[env(safe-area-inset-bottom)]">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-[94vw] sm:w-[420px] h-[520px] max-h-[75dvh] sm:max-h-[82vh] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 mb-3">
          
          {/* Chat Header */}
          <div className="bg-primary/10 border-b border-border p-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black text-base shadow-md">
                卐
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-foreground tracking-wide">Jain<span className="text-amber-500">GPT</span></h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active RAG Service" />
                </div>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">A Real Jainism Product</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearMemory}
                title="Clear Chat Memory"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Icon name="ArrowPathIcon" size={18} />
              </button>

              <Link
                href="/chat"
                onClick={() => setIsOpen(false)}
                title="Full Page Mode"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Icon name="ArrowsPointingOutIcon" size={18} />
              </Link>
              
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Icon name="XMarkIcon" size={18} />
              </button>
            </div>
          </div>

          {/* Development Phase Notice Tag */}
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-1 text-[10px] text-amber-300 flex items-center justify-between font-medium flex-shrink-0">
            <span>⚠️ In Development Phase · May show errors</span>
            <Link href="/#contact" onClick={() => setIsOpen(false)} className="underline hover:text-amber-200">Report</Link>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-muted/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-end gap-2 max-w-[88%]">
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] flex-shrink-0 mb-1">
                      🪷
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none shadow-md font-medium'
                        : 'bg-card text-card-foreground border border-border/80 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    
                    {/* Bot Actions / Timestamp */}
                    <div className="mt-1 flex items-center justify-between gap-3 text-[10px] opacity-70 border-t border-border/30 pt-1">
                      <span>{msg.time}</span>
                      {msg.sender === 'bot' && (
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Icon name={copiedId === msg.id ? 'CheckIcon' : 'DocumentDuplicateIcon'} size={12} />
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading typing indicator */}
            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">
                  🪷
                </div>
                <div className="bg-card border border-border p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <span className="text-xs text-muted-foreground ml-1.5">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-background border-t border-border/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-semibold bg-muted/60 hover:bg-primary/20 text-muted-foreground hover:text-foreground transition-all duration-150 border border-border/50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-background border-t border-border flex items-center gap-2 flex-shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask JainGPT..."
              disabled={loading}
              className="flex-1 bg-muted/40 text-foreground text-xs sm:text-sm px-3 py-2 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/70"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-all shadow-md flex-shrink-0"
            >
              <Icon name="PaperAirplaneIcon" size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button (Swastik icon retained as requested) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 transition-all duration-300 ring-4 ring-primary/20"
        aria-label="Open JainGPT Chatbot"
      >
        <span className="text-xl sm:text-2xl transition-transform group-hover:rotate-12">
          {isOpen ? '❌' : '卐'}
        </span>

        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-background" />
          </span>
        )}
      </button>
    </div>
  );
}
