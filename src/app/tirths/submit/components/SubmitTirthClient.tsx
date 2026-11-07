'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu & Kashmir',
  'Ladakh',
  'Other / Outside India',
];

const CATEGORIES = [
  'Atishay Kshetra',
  'Siddha Kshetra',
  'Kalyanaka Kshetra',
  'Puranic / Ancient Kshetra',
  'Basadi / Historic Temple',
  'Digambar Jain Temple',
  'Other',
];

const TRADITIONS = [
  'Digambar',
  'Digambar (Terapanthi)',
  'Digambar (Bispanthi)',
  'Digambar (Taranpanthi)',
  'Digambar (Kanji Swami Panth)',
  'Other',
];

export default function SubmitTirthClient() {
  const [formData, setFormData] = useState({
    tirthName: '',
    hindiName: '',
    category: 'Atishay Kshetra',
    tradition: 'Digambar',
    moolnayak: '',
    state: '',
    city: '',
    address: '',
    mapsUrl: '',
    description: '',
    timings: '',
    facilities: '',
    contactPhone: '',
    officialWebsite: '',
    photosUrl: '',
    submitterName: '',
    submitterEmail: '',
    submitterPhone: '',
    additionalNotes: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const res = await fetch('https://formspree.io/f/xnpjebbb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `New Tirth Submission: ${formData.tirthName || 'Untitled'} (${formData.state || 'Unknown State'})`,
          ...formData,
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const errorData = await res.json().catch(() => null);
        setStatus('error');
        setErrorMessage(
          errorData?.error || 'Unable to submit the form at this moment. Please try again.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error occurred. Please check your connection and try again.');
    }
  };

  const handleReset = () => {
    setFormData({
      tirthName: '',
      hindiName: '',
      category: 'Atishay Kshetra',
      tradition: 'Digambar',
      moolnayak: '',
      state: '',
      city: '',
      address: '',
      mapsUrl: '',
      description: '',
      timings: '',
      facilities: '',
      contactPhone: '',
      officialWebsite: '',
      photosUrl: '',
      submitterName: '',
      submitterEmail: '',
      submitterPhone: '',
      additionalNotes: '',
    });
    setStatus('idle');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation / Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/tirths"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <Icon name="ArrowLeftIcon" size={15} />
            Back to Tirths Directory
          </Link>

          <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
            Community Contribution
          </span>
        </div>

        {/* Page Header */}
        <div className="text-center sm:text-left mb-10 pb-8 border-b border-border">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-black uppercase tracking-wider mb-4">
            <Icon name="SparklesIcon" size={14} />
            Preserve Jain Heritage
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-4">
            Submit a <span className="gold-gradient-text">Tirth Kshetra.</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed font-medium">
            Know an ancient Digambar Jain Atishay Kshetra, Siddha Kshetra, or basadi that is not yet listed on RealJainism? Submit the details below. Our team verifies the information with temple records and trusts before publishing.
          </p>
        </div>

        {/* Form Container */}
        {status === 'success' ? (
          <div className="bg-card border border-primary/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-6 text-primary">
              <Icon name="CheckCircleIcon" size={44} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground mb-3">
              Jai Jinendra! Tirth Submitted Successfully
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed font-medium mb-8">
              Thank you for contributing to RealJainism. Your submission for{' '}
              <strong className="text-foreground">{formData.tirthName || 'this Tirth'}</strong> has been received. Our team will verify the details and update our directory.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:bg-accent transition-all shadow-md"
              >
                Submit Another Tirth
              </button>
              <Link
                href="/tirths"
                className="px-6 py-3 rounded-full bg-card border border-border text-foreground text-xs font-black uppercase tracking-widest hover:border-primary/40 transition-all"
              >
                Browse All Tirths
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section 1: Tirth Identity */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
                  <Icon name="BuildingLibraryIcon" size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-foreground">
                    1. Tirth Kshetra Identity
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Name and religious classification of the pilgrimage site
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="tirthName"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    Tirth Kshetra Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="tirthName"
                    name="tirthName"
                    type="text"
                    required
                    value={formData.tirthName}
                    onChange={handleChange}
                    placeholder="e.g. Shri Digambar Jain Atishay Kshetra Tijara"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="hindiName"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    Hindi / Local Name (Optional)
                  </label>
                  <input
                    id="hindiName"
                    name="hindiName"
                    type="text"
                    value={formData.hindiName}
                    onChange={handleChange}
                    placeholder="e.g. श्री दिगंबर जैन अतिशय क्षेत्र तिजारा"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="moolnayak"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    Moolnayak Bhagwan (Principal Deity)
                  </label>
                  <input
                    id="moolnayak"
                    name="moolnayak"
                    type="text"
                    value={formData.moolnayak}
                    onChange={handleChange}
                    placeholder="e.g. 8th Tirthankar Bhagwan Chandraprabhu"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    Kshetra Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="tradition"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    Tradition / Sampradaya
                  </label>
                  <select
                    id="tradition"
                    name="tradition"
                    value={formData.tradition}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    {TRADITIONS.map((trad) => (
                      <option key={trad} value={trad}>
                        {trad}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Location & Address */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
                  <Icon name="MapPinIcon" size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-foreground">
                    2. Location & Travel
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Geographic coordinates and reachability details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="state"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    State / UT <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    City / Town / District <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Tijara, Alwar District"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    Full Address & PIN Code (Optional)
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. Post Tijara, Dist. Khairthal-Tijara, Rajasthan — 301411"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="mapsUrl"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    Google Maps Link or GPS Coordinates (Optional)
                  </label>
                  <input
                    id="mapsUrl"
                    name="mapsUrl"
                    type="url"
                    value={formData.mapsUrl}
                    onChange={handleChange}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: History & Facilities */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
                  <Icon name="InformationCircleIcon" size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-foreground">
                    3. History, Timings & Facilities
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Historical significance, dharamshala, bhojanshala, and trust contact
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    History & Sacred Significance <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the discovery, miraculous occurrences (Atishay), ancient idols, architecture, or history of this sacred place..."
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="timings"
                      className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                    >
                      Darshan & Temple Timings
                    </label>
                    <input
                      id="timings"
                      name="timings"
                      type="text"
                      value={formData.timings}
                      onChange={handleChange}
                      placeholder="e.g. 5:30 AM – 8:30 PM (Daily)"
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="facilities"
                      className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                    >
                      Dharamshala & Bhojanshala Details
                    </label>
                    <input
                      id="facilities"
                      name="facilities"
                      type="text"
                      value={formData.facilities}
                      onChange={handleChange}
                      placeholder="e.g. AC/Non-AC rooms, Shuddh Jain Bhojanshala available"
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contactPhone"
                      className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                    >
                      Trust / Committee Phone Number
                    </label>
                    <input
                      id="contactPhone"
                      name="contactPhone"
                      type="text"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="e.g. +91 1469 222123 or mobile number"
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="officialWebsite"
                      className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                    >
                      Official Website or Trust URL
                    </label>
                    <input
                      id="officialWebsite"
                      name="officialWebsite"
                      type="url"
                      value={formData.officialWebsite}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="photosUrl"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    Photos or Google Drive / Cloud Link (Optional)
                  </label>
                  <input
                    id="photosUrl"
                    name="photosUrl"
                    type="url"
                    value={formData.photosUrl}
                    onChange={handleChange}
                    placeholder="Link to photos folder or image on Google Drive / Dropbox"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Submitter Details */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
                  <Icon name="UserIcon" size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-foreground">
                    4. Your Information
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    In case we need to clarify details before publishing
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label
                    htmlFor="submitterName"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="submitterName"
                    name="submitterName"
                    type="text"
                    required
                    value={formData.submitterName}
                    onChange={handleChange}
                    placeholder="Rahul Jain"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="submitterEmail"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    Your Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="submitterEmail"
                    name="submitterEmail"
                    type="email"
                    required
                    value={formData.submitterEmail}
                    onChange={handleChange}
                    placeholder="rahul@example.com"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="submitterPhone"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    WhatsApp / Phone (Optional)
                  </label>
                  <input
                    id="submitterPhone"
                    name="submitterPhone"
                    type="text"
                    value={formData.submitterPhone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="additionalNotes"
                    className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    Additional Notes / Source of Information
                  </label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    rows={2}
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    placeholder="Any reference books, temple committee contacts, or personal experience..."
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-3">
                <Icon name="ExclamationTriangleIcon" size={18} className="flex-shrink-0" />
                <span>{errorMessage || 'Something went wrong while submitting. Please try again.'}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <p className="text-xs text-muted-foreground text-center sm:text-left">
                By submitting, you help preserve and share Digambar Jain tirth information with devotees worldwide.
              </p>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:bg-accent transition-all duration-200 disabled:opacity-60 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                {status === 'sending' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Submitting Tirth...
                  </>
                ) : (
                  <>
                    <Icon name="PaperAirplaneIcon" size={16} />
                    Submit Tirth Kshetra
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
