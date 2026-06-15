/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Instagram, 
  Facebook, 
  CheckCircle,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { CommentFeedback } from '../types';

interface ContactViewProps {
  isDarkMode: boolean;
  onSubmitComment: (cf: CommentFeedback) => void;
  feedbacks: CommentFeedback[];
}

export default function ContactView({ isDarkMode, onSubmitComment, feedbacks }: ContactViewProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !phone.trim() || !comment.trim()) {
      setErrorMsg('All fields (Name, Phone, and Comment) are strictly mandatory!');
      return;
    }

    const newFeedback: CommentFeedback = {
      id: 'fb-' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      comment: comment.trim(),
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    onSubmitComment(newFeedback);

    // Reset fields
    setName('');
    setPhone('');
    setComment('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3500);
  };

  // Google Maps address link helper
  const mapSearchUrl = "https://www.google.com/maps/search/?api=1&query=Wow+Burger,+Bole,+adjacent+to+Edna+Mall,+Cameroon+St,+Addis+Ababa,+Ethiopia";
  
  // Custom encoded iframe for precise central Addis embedding 
  const embedMapUrl = "https://maps.google.com/maps?q=Bole,%20adjacent%20to%20Edna%20Mall,%20Cameroon%20St,%20Addis%20Ababa,%20Ethiopia&t=&z=16&ie=UTF8&iwloc=&output=embed";

  const cardBgClass = isDarkMode ? 'bg-[#1A1A1A] text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200 shadow-md';
  const textMutedClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const subHeadingClass = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6" id="contact-page-container">
      
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#E63946] border border-[#E63946]/30 bg-[#E63946]/10 rounded px-2.5 py-1">
          Bole Branch HQ, Addis Ababa
        </span>
        <h2 className={`font-sans text-3xl font-black uppercase tracking-tight mt-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Contact & Gourmet Hub
        </h2>
        <p className={`text-xs sm:text-sm font-semibold mt-2 ${textMutedClass}`}>
          Reach us directly at Bole, request custom catering menus, or drop us your valuable local feedback!
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Contact info and Social apps (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`rounded-2xl border-[3px] p-6 transition-all border-[#E63946] shadow-[4px_4px_0px_0px_#E63946] ${cardBgClass}`}>
            <h3 className="text-lg font-black uppercase tracking-tight mb-5 flex items-center gap-2">
              <span className="text-xl">📍</span> Bole Bistro Info
            </h3>

            <div className="space-y-5 text-sm">
              {/* Correct Address Details */}
              <div className="flex gap-3.5 items-start">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E63946] text-white border border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,0.3)]">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-sans font-black text-xs uppercase text-gray-400 tracking-wider">Address</h4>
                  <p className={`text-xs sm:text-sm font-bold mt-0.5 leading-snug ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Bole, adjacent to Edna Mall<br />
                    Cameroon St, Addis Ababa, Ethiopia
                  </p>
                  <a
                    href={mapSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-black text-[#E63946] uppercase tracking-wider hover:opacity-85"
                  >
                    Get Location on Google Maps &gt;
                  </a>
                </div>
              </div>

              {/* Exact Phone number link clickable */}
              <div className="flex gap-3.5 items-start">
                <a 
                  href="tel:+251911234567"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4A261] text-black border border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,0.3)] transition-transform hover:scale-105"
                  title="Make phone call"
                >
                  <Phone className="h-4.5 w-4.5" />
                </a>
                <div>
                  <h4 className="font-sans font-black text-xs uppercase text-gray-400 tracking-wider">Call Directly (Click to Dial)</h4>
                  <p className="mt-0.5">
                    <a href="tel:+251911234567" className={`text-sm font-mono font-black hover:text-[#E63946] transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      +251 911 234567
                    </a>
                  </p>
                  <span className="text-[10px] text-gray-500 font-semibold">Active for takeout & delivery hotline</span>
                </div>
              </div>

              {/* Exact Gmail link clickable */}
              <div className="flex gap-3.5 items-start">
                <a 
                  href="mailto:hello@wowburger.et" 
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white border border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,0.3)] transition-transform hover:scale-105"
                  title="Send Email"
                >
                  <Mail className="h-4.5 w-4.5" />
                </a>
                <div>
                  <h4 className="font-sans font-black text-xs uppercase text-gray-400 tracking-wider">Email Inquiry</h4>
                  <p className="mt-0.5">
                    <a href="mailto:hello@wowburger.et" className={`text-sm font-mono font-black hover:text-sky-500 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      hello@wowburger.et
                    </a>
                  </p>
                  <span className="text-[10px] text-gray-500 font-semibold">Catering and partnership opportunities</span>
                </div>
              </div>

              {/* Custom Hours */}
              <div className="flex gap-3.5 items-start border-t border-gray-800/10 pt-4 mt-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white border border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,0.3)]">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-sans font-black text-xs uppercase text-gray-400 tracking-wider">Bole Working Hours</h4>
                  <p className={`text-xs sm:text-sm font-bold mt-0.5 leading-normal ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Monday - Sunday: <strong className="text-emerald-500">10:00 AM - 10:00 PM</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Structured Social Media app redirection icon group */}
            <div className="border-t border-gray-800/25 mt-6 pt-5">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider font-mono mb-3">
                Connect on Social Networks:
              </h4>
              <div className="flex items-center gap-3" id="socials-apps-container">
                {/* Telegram */}
                <a
                  href="https://t.me/wowburger_ethiopia"
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-2 items-center rounded-xl border-2 border-black bg-[#229ED9] text-white px-3.5 py-2 text-xs font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] hover:-translate-y-0.5"
                  title="Open Telegram App"
                >
                  <Send className="h-4 w-4 fill-white/10" />
                  <span>Telegram</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/wowburger.et"
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-2 items-center rounded-xl border-2 border-black bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white px-3.5 py-2 text-xs font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] hover:-translate-y-0.5"
                  title="Open Instagram App"
                >
                  <Instagram className="h-4 w-4" />
                  <span>Insta</span>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/wowburger.et"
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-2 items-center rounded-xl border-2 border-black bg-[#1877F2] text-white px-3.5 py-2 text-xs font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] hover:-translate-y-0.5"
                  title="Open Facebook App"
                >
                  <Facebook className="h-4 w-4 fill-white/10" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Embed Map and Feedback Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Map Frame Card */}
          <div className={`overflow-hidden rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_#E63946] ${cardBgClass}`}>
            <div className="p-4 bg-[#E63946] text-white flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider font-mono">Bole Location Vector</span>
              <a 
                href={mapSearchUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white hover:bg-black/85 border border-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-all"
                id="get-location-btn"
              >
                Open Google Maps App
              </a>
            </div>
            
            {/* Embedded Iframe */}
            <div className="relative w-full h-[230px] bg-slate-100">
              <iframe
                title="Wow Burger Bole Maps Frame"
                src={embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Comment & Feedback Form */}
          <div className={`rounded-2xl border-[3px] border-black p-6 shadow-[5px_5px_0px_0px_#F4A261] ${cardBgClass}`} id="comment-feedback-box">
            <h3 className="text-lg font-black uppercase tracking-tight mb-2 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#F4A261] stroke-[2.5]" />
              Leave Comment or Review
            </h3>
            <p className={`text-xs font-semibold mb-5 ${textMutedClass}`}>
              We love to hear from our Addis Ababa family. Your comments and phone registrations instantly sink to the admin side dashboards for review!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="rounded-xl border-2 border-red-500 bg-red-500/10 p-3 flex items-start gap-2 text-xs font-bold text-red-500">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="rounded-xl border-2 border-emerald-500 bg-emerald-500/10 p-3 flex items-start gap-2 text-xs font-bold text-emerald-500">
                  <CheckCircle className="h-4 w-4 shrink-0 animate-bounce" />
                  <span>Success! Your comment has been registered and sent to Bole Admin terminals.</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abenezer Samson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border-[2px] border-black bg-white px-3.5 py-2.5 text-xs font-bold text-gray-900 shadow-inner outline-none focus:border-[#E63946]"
                    id="feedback-input-name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +251 911 234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border-[2px] border-black bg-white px-3.5 py-2.5 text-xs font-bold text-gray-900 shadow-inner outline-none focus:border-[#E63946]"
                    id="feedback-input-phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">Your Comment *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about your smash burger experience... we love honest comments!"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl border-[2px] border-black bg-white px-3.5 py-2.5 text-xs font-bold text-gray-900 shadow-inner outline-none focus:border-[#E63946]"
                  id="feedback-input-comment"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-black bg-[#E63946] px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px active:scale-95 transition-all"
                  id="submit-feedback-button"
                >
                  Submit Comment to Bole HQ
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
