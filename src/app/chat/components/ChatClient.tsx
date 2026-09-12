'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

const TOPICS = [
  { icon: '🕉️', label: 'पंच महाव्रत', question: 'पंच महाव्रत क्या हैं?' },
  { icon: '☸️', label: 'अनेकांतवाद', question: 'अनेकांतवाद का सिद्धांत क्या है?' },
  { icon: '📿', label: 'Karma Theory', question: 'What is the concept of Karma in Jainism?' },
  { icon: '🙏', label: 'तीर्थंकर', question: 'चौबीस तीर्थंकर कौन हैं?' },
  { icon: '🕊️', label: 'Ahimsa', question: 'What is Ahimsa according to Jain philosophy?' },
];

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textOverride?: string) => {
    const question = (textOverride || input).trim();
    if (!question || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: question,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textOverride) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      });

      const data = await res.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.answer || 'Apologies, no response was generated. Please try again.',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: '❌ Unable to connect to the server.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      await fetch('/api/chat/clear', { method: 'POST' });
    } catch (e) {
      console.warn('Memory clear error:', e);
    }
    setMessages([]);
    setInput('');
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

  const formatAnswer = (text: string) => {
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e0c087">$1</strong>');
    formatted = formatted.replace(/^### (.*)$/gm, '<h4 style="color:#e0c087; margin: 12px 0 4px 0;">$1</h4>');
    formatted = formatted.replace(/^## (.*)$/gm, '<h3 style="color:#e0c087; margin: 14px 0 6px 0;">$1</h3>');
    formatted = formatted.replace(/^# (.*)$/gm, '<h2 style="color:#e0c087; margin: 16px 0 8px 0;">$1</h2>');
    formatted = formatted.replace(/^\s*(\d+)\.\s+(.*)$/gm, '<div style="margin: 4px 0; padding-left: 4px;"><b>$1.</b> $2</div>');
    formatted = formatted.replace(/^\s*[-*]\s+(.*)$/gm, '<div style="margin: 4px 0; padding-left: 4px;">• $1</div>');
    formatted = formatted.replace(/^---$/gm, '<hr style="border: none; border-top: 1px solid rgba(202, 160, 87, 0.18); margin: 14px 0;" />');
    formatted = formatted.replace(/\n/g, '<br />');

    return { __html: formatted };
  };

  return (
    <div className="jain-gpt-wrapper">
      {/* SCOPED CSS MATCHING JAIN-RAG EXACTLY */}
      <style jsx global>{`
        .jain-gpt-wrapper {
          --bg: #0d0a08;
          --bg-panel: #17120c;
          --bg-panel-2: #1c150e;
          --gold: #caa057;
          --gold-light: #e0c087;
          --gold-dim: rgba(202, 160, 87, 0.25);
          --cream: #f5f0e6;
          --text-muted: #b8ab98;
          --border: rgba(202, 160, 87, 0.18);

          background: radial-gradient(120% 90% at 85% 0%, #2a1d0e 0%, #0d0a08 45%, #0d0a08 100%);
          color: var(--cream);
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          min-height: 100vh;
        }

        .jg-topnav {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(13, 10, 8, 0.85);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
        }

        .jg-topnav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .jg-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--cream);
        }

        .jg-brand-text {
          font-weight: 800;
          font-size: 18px;
          letter-spacing: 0.02em;
        }

        .jg-accent {
          color: var(--gold);
        }

        .jg-brand-tag {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          border-left: 1px solid var(--border);
          padding-left: 16px;
          margin-left: 2px;
        }

        .jg-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          border: 1px solid transparent;
          transition: transform 0.15s ease, opacity 0.15s ease;
          white-space: nowrap;
        }

        .jg-btn-outline {
          background: transparent;
          border-color: var(--gold-dim);
          color: var(--gold-light);
        }

        .jg-btn-outline:hover {
          border-color: var(--gold);
          background: rgba(202, 160, 87, 0.08);
          transform: translateY(-1px);
        }

        .jg-app {
          display: grid;
          grid-template-columns: 280px 1fr;
          max-width: 1200px;
          margin: 0 auto;
          min-height: calc(100vh - 68px);
        }

        @media (max-width: 860px) {
          .jg-app {
            grid-template-columns: 1fr;
          }
          .jg-sidebar {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
        }

        .jg-sidebar {
          padding: 28px 20px;
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
        }

        .jg-eyebrow {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 700;
          margin: 0 0 12px 0;
        }

        .jg-new-chat {
          width: 100%;
          padding: 12px 16px;
          border-radius: 999px;
          background: linear-gradient(145deg, var(--gold-light), var(--gold));
          color: #16110a;
          border: none;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.02em;
          cursor: pointer;
          margin-bottom: 28px;
          transition: transform 0.15s ease;
        }

        .jg-new-chat:hover {
          transform: translateY(-1px);
        }

        .jg-topics {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .jg-topic {
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
          padding: 12px 14px;
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--cream);
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }

        .jg-topic:hover {
          border-color: var(--gold-dim);
          background: var(--bg-panel-2);
        }

        .jg-sidebar-footer {
          margin-top: auto;
          padding-top: 24px;
          font-size: 12px;
          line-height: 1.6;
          color: var(--text-muted);
        }

        .jg-main {
          display: flex;
          flex-direction: column;
          padding: 28px 32px;
          min-height: calc(100vh - 68px);
        }

        .jg-welcome {
          padding: 40px 0 24px 0;
        }

        .jg-welcome h1 {
          font-size: 44px;
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.01em;
          margin: 6px 0 16px 0;
          text-transform: uppercase;
        }

        .jg-welcome-sub {
          font-size: 15px;
          line-height: 1.6;
          color: var(--text-muted);
          max-width: 520px;
        }

        .jg-messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 8px 0 24px 0;
        }

        .jg-message {
          display: flex;
        }

        .jg-message.user {
          justify-content: flex-end;
        }

        .jg-message.bot {
          justify-content: flex-start;
        }

        .jg-user-bubble {
          background: linear-gradient(145deg, var(--gold-light), var(--gold));
          color: #16110a;
          padding: 12px 18px;
          border-radius: 16px 16px 4px 16px;
          max-width: 72%;
          font-size: 14.5px;
          font-weight: 500;
          line-height: 1.5;
        }

        .jg-bot-bubble {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          padding: 16px 20px;
          border-radius: 4px 16px 16px 16px;
          max-width: 78%;
          font-size: 14.5px;
          line-height: 1.65;
          position: relative;
        }

        .jg-bot-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .jg-bot-title {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 700;
        }

        .jg-copy-btn {
          background: transparent;
          border: none;
          color: var(--gold-light);
          cursor: pointer;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 4px;
          opacity: 0.8;
          transition: opacity 0.15s;
        }

        .jg-copy-btn:hover {
          opacity: 1;
          text-decoration: underline;
        }

        .jg-input-area {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 10px 10px 10px 18px;
        }

        .jg-input-area textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          color: var(--cream);
          font-family: inherit;
          font-size: 14.5px;
          line-height: 1.5;
          max-height: 140px;
          padding: 8px 0;
        }

        .jg-input-area textarea::placeholder {
          color: var(--text-muted);
        }

        .jg-send {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(145deg, var(--gold-light), var(--gold));
          color: #16110a;
          border: none;
          font-size: 16px;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.15s ease;
        }

        .jg-send:hover {
          transform: translateY(-1px) scale(1.03);
        }

        .jg-send:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .jg-footer-text {
          text-align: center;
          font-size: 11.5px;
          color: var(--text-muted);
          margin: 14px 0 0 0;
        }
      `}</style>

      {/* TOP NAV */}
      <header className="jg-topnav">
        <div className="jg-topnav-inner">
          <Link href="/" className="jg-brand">
            {/* Website Logo replacing Swastik in Top Bar */}
            <AppLogo src="/assets/images/logo-1784737155365.png" size={34} />
            <span className="jg-brand-text">
              Jain<span className="jg-accent">GPT</span>
            </span>
          </Link>

          <span className="jg-brand-tag hidden sm:inline-block">A Real Jainism Product</span>

          {/* Development Phase Notice Tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-medium ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Development Phase · <Link href="/#contact" className="underline hover:text-amber-200">Report Errors</Link></span>
          </div>

          <Link href="/" className="jg-btn jg-btn-outline ml-auto">
            Visit Real Jainism →
          </Link>
        </div>
      </header>

      <div className="jg-app">
        {/* SIDEBAR */}
        <aside className="jg-sidebar">
          <p className="jg-eyebrow">Explore</p>

          <button onClick={handleNewChat} className="jg-new-chat">
            + New Chat
          </button>

          <div className="jg-topics">
            {TOPICS.map((t) => (
              <button
                key={t.label}
                onClick={() => handleSend(t.question)}
                className="jg-topic"
              >
                <span className="text-base">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div className="jg-sidebar-footer">
            Answers are grounded only in the scripture knowledge base — Hindi or English, matched to your question.
          </div>
        </aside>

        {/* MAIN */}
        <main className="jg-main">
          {messages.length === 0 && (
            <div className="jg-welcome">
              <p className="jg-eyebrow">जय जिनेन्द्र</p>

              <h1>
                Everything <span className="jg-accent">Jain</span>,<br />
                answered.
              </h1>

              <p className="jg-welcome-sub">
                Ask JainGPT about scriptures, philosophy, and practice — in Hindi or English. Grounded in the Agams and Sutras, not guesswork.
              </p>
            </div>
          )}

          {/* MESSAGES STREAM */}
          <div className="jg-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`jg-message ${msg.sender}`}>
                {msg.sender === 'user' ? (
                  <div className="jg-user-bubble">{msg.text}</div>
                ) : (
                  <div className="jg-bot-bubble">
                    <div className="jg-bot-header">
                      <div className="jg-bot-title">JainGPT</div>
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="jg-copy-btn"
                        title="Copy Answer"
                      >
                        <Icon name={copiedId === msg.id ? 'CheckIcon' : 'DocumentDuplicateIcon'} size={13} />
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div
                      dangerouslySetInnerHTML={formatAnswer(msg.text)}
                    />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="jg-message bot">
                <div className="jg-bot-bubble">
                  <div className="jg-bot-title">JainGPT</div>
                  <div className="text-sm text-amber-200/80 animate-pulse">Thinking...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="jg-input-area"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="पंच महाव्रत के बारे में पूछें... / Ask about Jain philosophy..."
              rows={1}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="jg-send"
              aria-label="Send message"
            >
              ➤
            </button>
          </form>

          <p className="jg-footer-text">
            JainGPT — A Real Jainism Product · Answers drawn from scripture knowledge base. <span className="opacity-80">⚠️ JainGPT is in development phase and may occasionally show errors. You can report errors in the <Link href="/#contact" className="underline hover:text-amber-300">Contact Section</Link>.</span>
          </p>
        </main>
      </div>
    </div>
  );
}
