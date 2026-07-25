'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/mjgnbael', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-16 sm:py-24 px-4" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Info */}
          <div className="reveal">
            <p className="text-motto text-primary mb-3 opacity-70">Get in Touch</p>
            <h2 className="text-section-xl text-foreground uppercase mb-6">
              Contact <br />
              <span className="gold-gradient-text">Us.</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base font-medium leading-relaxed mb-8 max-w-md">
              Have a suggestion, report an issue, or want to collaborate? We&apos;d love to hear from you.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:contact.realjainism@gmail.com"
                className="flex items-center gap-4 p-4 border border-border rounded-xl hover:border-primary/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Icon name="EnvelopeIcon" size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</p>
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    contact.realjainism@gmail.com
                  </p>
                </div>
              </a>
              <a
                href="https://t.me/real_jainism_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 border border-border rounded-xl hover:border-primary/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Icon name="PaperAirplaneIcon" size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Telegram Bot</p>
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    t.me/real_jainism_bot
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="reveal reveal-delay-2 bg-card border border-border rounded-2xl p-6 sm:p-8">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="CheckCircleIcon" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground">Message Sent!</h3>
                <p className="text-sm text-muted-foreground">We&apos;ll get back to you soon. Jai Jinendra!</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4 text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2" htmlFor="contact-name">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Rahul Jain"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2" htmlFor="contact-email">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="rahul@example.com"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Your message..."
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                {status === 'error' && (
                  <p className="text-xs font-bold text-red-400">Something went wrong. Please try again.</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent transition-all duration-200 disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}