'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

function ReportContent() {
  const searchParams = useSearchParams();
  const prefilledTirth = searchParams.get('tirth') || '';

  const [form, setForm] = useState({
    tirthName: prefilledTirth,
    issueType: 'Incorrect Information',
    reporterName: '',
    reporterContact: '',
    issueDetails: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const res = await fetch('https://formspree.io/f/xgaoglle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `Tirth Issue Report: ${form.tirthName || 'General Report'}`,
          ...form,
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json().catch(() => null);
        setStatus('error');
        setErrorMessage(data?.error || 'Failed to submit report. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error occurred. Please check your connection and try again.');
    }
  };

  const handleReset = () => {
    setForm({
      tirthName: '',
      issueType: 'Incorrect Information',
      reporterName: '',
      reporterContact: '',
      issueDetails: '',
    });
    setStatus('idle');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/tirths"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <Icon name="ArrowLeftIcon" size={15} />
            Back to Tirths
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-wider">
            <Icon name="ExclamationCircleIcon" size={13} />
            Report Issue
          </span>
        </div>

        {/* Header */}
        <div className="text-center sm:text-left mb-8 pb-6 border-b border-border">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground mb-3">
            Report a <span className="text-red-400">Problem.</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
            Found incorrect phone numbers, outdated darshan timings, inaccurate map coordinates, or an issue with a sacred Jain Tirth Kshetra? Let us know so we can verify and fix it.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-card border border-red-500/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-6 text-primary">
              <Icon name="CheckCircleIcon" size={38} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-3">
              Report Submitted · Jai Jinendra!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
              Thank you for keeping sacred Digambar Tirth data authentic. Our team will review your report and update the listing promptly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all"
              >
                Submit Another Report
              </button>
              <Link
                href="/tirths"
                className="px-6 py-2.5 rounded-full bg-card border border-border text-foreground text-xs font-black uppercase tracking-widest hover:border-primary/40 transition-all"
              >
                Return to Directory
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <label
                htmlFor="tirthName"
                className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
              >
                Tirth Kshetra Name / Location <span className="text-red-400">*</span>
              </label>
              <input
                id="tirthName"
                name="tirthName"
                type="text"
                required
                value={form.tirthName}
                onChange={handleChange}
                placeholder="e.g. Antariksh Parshvanath (Shirpur, Maharashtra)"
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/60 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="issueType"
                className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
              >
                Issue Category <span className="text-red-400">*</span>
              </label>
              <select
                id="issueType"
                name="issueType"
                value={form.issueType}
                onChange={handleChange}
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-red-500/60 transition-colors"
              >
                <option value="Incorrect Information">Incorrect Temple / Idol Details</option>
                <option value="Wrong Contact Phone / Office Details">Wrong Contact Phone / Committee Office</option>
                <option value="Wrong Timings / Dharamshala / Bhojanshala">Outdated Timings / Dharamshala / Bhojanshala</option>
                <option value="Incorrect Location / Map Coordinates">Incorrect Location / Map Coordinates</option>
                <option value="Temple Condition / Upkeep Issue">Temple Condition / Sanctity / Upkeep Issue</option>
                <option value="Other Problem">Other Problem / Suggestion</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="reporterName"
                  className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                >
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="reporterName"
                  name="reporterName"
                  type="text"
                  required
                  value={form.reporterName}
                  onChange={handleChange}
                  placeholder="Rahul Jain"
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/60 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="reporterContact"
                  className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                >
                  Email or WhatsApp <span className="text-red-400">*</span>
                </label>
                <input
                  id="reporterContact"
                  name="reporterContact"
                  type="text"
                  required
                  value={form.reporterContact}
                  onChange={handleChange}
                  placeholder="rahul@example.com or phone"
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="issueDetails"
                className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
              >
                Describe the Issue / Correction Details <span className="text-red-400">*</span>
              </label>
              <textarea
                id="issueDetails"
                name="issueDetails"
                required
                rows={5}
                value={form.issueDetails}
                onChange={handleChange}
                placeholder="Explain the problem in detail (e.g. correct telephone number, updated trust office details, correct pin code, darshan timings)..."
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/60 transition-colors resize-none"
              />
            </div>

            {status === 'error' && (
              <p className="text-xs font-bold text-red-400">{errorMessage || 'Something went wrong.'}</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-60 shadow-lg shadow-red-900/20"
            >
              {status === 'sending' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <Icon name="ExclamationCircleIcon" size={16} />
                  Submit Report
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ReportTirthClient() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center">Loading...</div>}>
      <ReportContent />
    </Suspense>
  );
}
