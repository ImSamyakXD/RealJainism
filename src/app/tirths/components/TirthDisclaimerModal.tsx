'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export const TIRTH_DISCLAIMER_STORAGE_KEY = 'realjainism_tirth_disclaimer_accepted_v1';

interface TirthDisclaimerModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export default function TirthDisclaimerModal({
  forceOpen = false,
  onClose,
}: TirthDisclaimerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [hasPreviouslyAccepted, setHasPreviouslyAccepted] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(TIRTH_DISCLAIMER_STORAGE_KEY) === 'true';
      setHasPreviouslyAccepted(accepted);

      if (forceOpen) {
        setIsOpen(true);
        setAgreed(true);
      } else if (!accepted) {
        setIsOpen(true);
        setAgreed(false);
      }
    } catch {
      if (!forceOpen) {
        setIsOpen(true);
      }
    }
  }, [forceOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleProceed = () => {
    if (!agreed) return;
    try {
      localStorage.setItem(TIRTH_DISCLAIMER_STORAGE_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleDismiss = () => {
    if (hasPreviouslyAccepted) {
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tirth-disclaimer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div className="relative w-full max-w-lg my-auto rounded-3xl bg-card border border-border text-foreground shadow-2xl overflow-hidden">
        {/* Subtle top accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="p-6 sm:p-8">
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-[10px] font-black uppercase tracking-widest">
              <span>🙏</span>
              <span>Notice</span>
            </div>

            {hasPreviouslyAccepted && (
              <button
                type="button"
                onClick={handleDismiss}
                className="w-8 h-8 rounded-full bg-secondary/80 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                title="Close"
                aria-label="Close disclaimer"
              >
                <Icon name="XMarkIcon" size={16} />
              </button>
            )}
          </div>

          {/* Title */}
          <h2
            id="tirth-disclaimer-title"
            className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground"
          >
            Tirth Directory Notice
          </h2>
          <p className="text-xs text-primary font-medium mt-1">
            तीर्थ दर्शन विनम्र निवेदन एवं सूचना
          </p>

          {/* Description */}
          <div className="mt-5 space-y-3.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <p>
              Managing and verifying hundreds of sacred <strong className="text-foreground font-semibold">Digambar Jain Tirths</strong>, Siddh Kshetras, Atishay Kshetras, darshan timings, trustee contacts, and GPS coordinates across Bharat is an immense undertaking.
            </p>

            <p>
              Despite sincere research and continuous community verification, <strong className="text-foreground font-semibold">unintentional mistakes, outdated contact numbers, or road discrepancies may occur</strong>.
            </p>

            {/* Report Banner */}
            <div className="p-3.5 rounded-xl bg-secondary/60 border border-border text-xs space-y-1">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <Icon name="InformationCircleIcon" size={15} className="text-primary flex-shrink-0" />
                <span>Found any discrepancy or outdated info?</span>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                Please report it so our team can investigate and update the directory promptly.
              </p>
              <div className="pt-1">
                <Link
                  href="/tirths/report"
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-accent transition-colors"
                >
                  <Icon name="PencilSquareIcon" size={13} />
                  <span>Report an Issue / त्रुटि सूचित करें &rarr;</span>
                </Link>
              </div>
            </div>

            {/* Uttam Kshama Quote (Hero section style) */}
            <div className="border-l-2 border-primary pl-4 py-1.5 my-3">
              <p className="text-xs sm:text-sm font-semibold text-primary leading-relaxed">
                &ldquo;यदि संकलन में अनजाने में कोई त्रुटि या भूल रह गई हो, तो हृदय से &lsquo;उत्तम क्षमा&rsquo;&rdquo;
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                We humbly seek Uttam Kshama for any inadvertent error.
              </p>
            </div>
          </div>

          {/* Checkbox Section */}
          <div className="mt-5 pt-4 border-t border-border">
            <label
              htmlFor="disclaimer-checkbox"
              className="flex items-start gap-3 cursor-pointer select-none group"
            >
              <input
                id="disclaimer-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-border bg-input text-primary accent-[#C8965A] focus:ring-primary cursor-pointer"
              />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                I understand that managing this vast directory is an ongoing effort and mistakes may occur. If I find any mistake, I will report it. <strong className="text-foreground font-semibold">I agree to proceed.</strong>
              </span>
            </label>
          </div>

          {/* Action Button */}
          <div className="mt-5">
            <button
              type="button"
              disabled={!agreed}
              onClick={handleProceed}
              className={`w-full py-3.5 px-6 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
                agreed
                  ? 'bg-primary text-primary-foreground hover:bg-accent shadow-lg shadow-primary/20 active:scale-[0.99] cursor-pointer'
                  : 'bg-muted text-muted-foreground/40 border border-border cursor-not-allowed'
              }`}
            >
              <Icon name="CheckCircleIcon" size={16} />
              <span>I Agree & Proceed • दर्शन जारी रखें</span>
            </button>
            {!agreed && (
              <p className="text-center text-[10px] text-muted-foreground/70 mt-2">
                Please check the agreement box above to continue to the Tirth directory.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
