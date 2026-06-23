import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  ExternalLink 
} from 'lucide-react';
import QRCode from 'qrcode';

interface QrCodeHubProps {
  isDarkMode: boolean;
  triggerToast: (msg: string) => void;
}

function QuickQRPreview({ url }: { url: string }) {
  const [dataUrl, setDataUrl] = useState('');
  useEffect(() => {
    QRCode.toDataURL(url || 'https://wow-burger.com', { width: 128, margin: 1 }, (err, res) => {
      if (!err) {
        setDataUrl(res);
      }
    });
  }, [url]);

  if (!dataUrl) {
    return <div className="w-20 h-20 bg-gray-200 animate-pulse rounded" />;
  }
  return <img src={dataUrl} alt="Quick QR Code" className="w-20 h-20 object-contain selection:background-transparent" />;
}

export default function QrCodeHub({
  isDarkMode,
  triggerToast
}: QrCodeHubProps) {
  const [qrBaseUrlInput, setQrBaseUrlInput] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  });
  const [qrTableLabel, setQrTableLabel] = useState('Table 01');
  const [qrSubtitle, setQrSubtitle] = useState('Bole Branch HQ');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrMargin, setQrMargin] = useState(2);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  const getQRFullUrl = () => {
    const base = qrBaseUrlInput || (typeof window !== 'undefined' ? window.location.origin : '');
    if (!qrTableLabel.trim()) return base;
    const cleanLabel = encodeURIComponent(qrTableLabel.trim());
    return `${base}?table=${cleanLabel}`;
  };

  // Generate QR Code data URL dynamically when input changes
  useEffect(() => {
    const targetUrl = getQRFullUrl();
    QRCode.toDataURL(
      targetUrl,
      {
        width: 512,
        margin: qrMargin,
        color: {
          dark: qrColor,
          light: '#FFFFFF'
        }
      },
      (err, url) => {
        if (!err) {
          setQrCodeDataUrl(url);
        } else {
          console.error(err);
        }
      }
    );
  }, [qrBaseUrlInput, qrTableLabel, qrColor, qrMargin]);

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    const cleanLabel = qrTableLabel.trim().toLowerCase().replace(/\s+/g, '_') || 'shop';
    link.download = `wow_burger_qr_${cleanLabel}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('QR code downloaded successfully!');
  };

  const handlePrintQR = () => {
    const printStyle = document.createElement('style');
    printStyle.innerHTML = `
      @media print {
        body {
          background: white !important;
          color: black !important;
        }
        #wow-burger-app, #admin-panel-container, .admin-sidebar, #admin-sidebar, #admin-workspace > *:not(#admin-qr-code-section) {
          display: none !important;
        }
        #admin-qr-code-section > *:not(.flex):not(.grid) {
          display: none !important;
        }
        #admin-qr-code-section .grid > *:not(#printed-qr-standee-container) {
          display: none !important;
        }
        #printed-qr-standee-container {
          display: block !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
        }
        #printed-qr-standee {
          display: flex !important;
          margin: 40px auto !important;
          border: 4px solid black !important;
          box-shadow: none !important;
          width: 320px !important;
          max-width: 320px !important;
        }
      }
    `;
    document.head.appendChild(printStyle);
    
    const standeeEl = document.getElementById('printed-qr-standee');
    const parentEl = standeeEl?.parentElement;
    if (parentEl) {
      parentEl.setAttribute('id', 'printed-qr-standee-container');
    }

    setTimeout(() => {
      window.print();
      document.head.removeChild(printStyle);
      if (parentEl) {
        parentEl.removeAttribute('id');
      }
    }, 150);
  };

  const labelClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-650';
  const cardBg = isDarkMode ? 'bg-[#1A1A1A] border-gray-800' : 'bg-white border-gray-200 shadow-sm';
  const inputBg = isDarkMode ? 'bg-[#121212] text-white border-gray-800' : 'bg-white text-gray-900 border-gray-300';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-left"
      id="admin-qr-code-section"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-black uppercase tracking-tight ${labelClass}`}>Digital QR Menu Hub</h2>
          <p className={`text-xs ${textMuted}`}>Create shareable table-side & countertop QR codes for customers</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const url = getQRFullUrl();
              navigator.clipboard.writeText(url);
              triggerToast('Menu URL with parameters copied!');
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-white text-black px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-y-px transition-all cursor-pointer font-sans"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Table URL</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Settings Column */}
        <div className={`lg:col-span-7 rounded-2xl border-[3px] border-black p-5 space-y-5 ${cardBg}`}>
          <div className="border-b border-dashed border-gray-400/20 pb-3">
            <h3 className={`text-xs font-black uppercase tracking-widest ${labelClass}`}>
              QR Customize Panel
            </h3>
          </div>

          <div className="space-y-4">
            {/* Input 1: Menu base URL */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">
                Base Web URL
              </label>
              <input 
                type="text" 
                value={qrBaseUrlInput}
                onChange={(e) => setQrBaseUrlInput(e.target.value)}
                placeholder="e.g. http://localhost:3000"
                className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#E63946]"
              />
            </div>

            {/* Inputs 2: Subtitle & Table ID */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">
                  Spot Number/Table ID
                </label>
                <input 
                  type="text" 
                  value={qrTableLabel}
                  onChange={(e) => setQrTableLabel(e.target.value)}
                  placeholder="e.g. Table 15"
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#E63946]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">
                  Subtitle readout
                </label>
                <input 
                  type="text" 
                  value={qrSubtitle}
                  onChange={(e) => setQrSubtitle(e.target.value)}
                  placeholder="e.g. Floor 2 VIP"
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#E63946]"
                />
              </div>
            </div>

            {/* Custom colors & paddings */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">
                  QR Fill Color
                </label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="h-10 w-12 rounded border-2 border-black bg-transparent cursor-pointer shrink-0"
                  />
                  <input 
                    type="text" 
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2 text-xs font-bold text-gray-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">
                  Quiet Zone Padding
                </label>
                <select
                  value={qrMargin}
                  onChange={(e) => setQrMargin(parseInt(e.target.value))}
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#E63946]"
                >
                  <option value="1">Narrow (1px padding)</option>
                  <option value="2">Standard (2px padding)</option>
                  <option value="3">Comfortable (3px padding)</option>
                  <option value="4">Wide Cushion (4px padding)</option>
                </select>
              </div>
            </div>

            {/* Appended link preview readout */}
            <div className="rounded-xl border border-black/10 bg-black/5 p-3.5 space-y-1">
              <span className="text-[9px] font-mono uppercase font-black tracking-wide text-gray-400">
                Generated Real-Time Endpoint URL Target:
              </span>
              <div className="flex items-center justify-between gap-2 overflow-hidden text-left">
                <span className="font-mono text-[11px] font-bold text-[#E63946] select-all truncate">
                  {getQRFullUrl()}
                </span>
                <a 
                  href={getQRFullUrl()} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-gray-400 hover:text-black shrink-0"
                  title="Open links in new tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Built-in quick Table presets list */}
          <div className="border-t border-dashed border-gray-400/20 pt-4 text-left">
            <span className="block text-[10px] font-black uppercase tracking-widest text-[#E63946] mb-2.5">
              Quick Restaurant Floor Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {['Table 01', 'Table 02', 'Table 05', 'Table 10', 'VIP Lounge', 'Bar Counter', 'Takeout Kiosk'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setQrTableLabel(preset);
                    triggerToast(`Configured for: ${preset}`);
                  }}
                  className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border-2 border-black transition-all shadow-[1.5px_1.5px_0px_0px_black] active:translate-y-px active:shadow-none bg-white text-black hover:bg-[#E63946] hover:text-white cursor-pointer`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Mock Standee Visualization Column */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
          
          {/* Standee graphic preview card */}
          <div 
            id="printed-qr-standee"
            className="relative w-full max-w-[290px] rounded-2xl border-[4px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center text-black font-sans flex flex-col items-center justify-between"
          >
            {/* Brand Banner Header of Standee */}
            <div className="w-full">
              <div className="flex justify-center items-center gap-1 mb-1">
                <span className="font-sans font-black text-[#E63946] uppercase tracking-tighter text-lg leading-none">WOW</span>
                <span className="font-sans font-black text-black uppercase tracking-tight text-lg leading-none">BURGER</span>
              </div>
              <div className="h-1.5 w-full bg-[#E63946] rounded-full border border-black mb-2 shadow-sm" />
              
              {qrSubtitle && (
                <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 line-clamp-1 truncate">
                  {qrSubtitle}
                </span>
              )}
            </div>

            {/* QR Code Graphic Frame */}
            <div className="my-4 p-4 rounded-xl border-[3.5px] border-black bg-white shadow-md relative group select-none">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="WOW Burger Live Digital Menu QR Code" 
                  className="w-40 h-40 object-contain block mx-auto selection:background-transparent"
                />
              ) : (
                <div className="w-40 h-40 bg-gray-100 flex items-center justify-center text-gray-300 font-mono text-[9px]">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Spot Number / Stand Label Footer */}
            <div className="w-full">
              <span className="block text-[10px] font-black uppercase tracking-widest text-[#E63946] mb-1">
                SCAN TO VIEW MENU
              </span>
              {qrTableLabel ? (
                <div className="inline-block rounded-lg border-2 border-black bg-amber-400 px-4 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_black]">
                  {qrTableLabel}
                </div>
              ) : (
                <div className="inline-block rounded-lg border-2 border-black bg-gray-100 px-4 py-1 text-xs font-black uppercase tracking-wider text-gray-400">
                  Primary QR menu
                </div>
              )}
            </div>
          </div>

          {/* Standee Action Links */}
          <div className="w-full max-w-[290px] flex gap-2">
            <button
              onClick={handleDownloadQR}
              disabled={!qrCodeDataUrl}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-[#E63946] text-white py-2.5 text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_black] active:translate-y-px active:shadow-none transition-all disabled:opacity-40 cursor-pointer font-sans"
            >
              <Download className="h-4 w-4" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={handlePrintQR}
              className="inline-flex items-center justify-center rounded-xl border-2 border-black bg-white text-black p-2.5 shadow-[2.5px_2.5px_0px_0px_black] hover:bg-gray-100 active:translate-y-px active:shadow-none transition-all cursor-pointer"
              title="Print standalone menu card"
            >
              <Printer className="h-4.5 w-4.5" />
            </button>
          </div>

          <p className="text-[9px] text-center max-w-[280px] font-bold uppercase leading-normal text-gray-400">
            Tip: Click "Download" to save high-res transparent QR to place on print menus!
          </p>
        </div>

      </div>
    </motion.div>
  );
}
