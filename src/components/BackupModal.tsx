import React, { useRef } from 'react';
import { AppData } from '../types';
import { exportDataAsJSON } from '../utils/storage';
import { X, Download, Upload, AlertTriangle, RotateCcw } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  appData: AppData;
  onRestoreData: (restored: AppData) => void;
  onFullReset: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  appData,
  onRestoreData,
  onFullReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportDataAsJSON(appData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as AppData;
        if (parsed.standards && parsed.schoolInfo) {
          if (confirm('શું તમે આ બેકઅપ ફાઇલમાંથી ડેટા રિસ્ટોર કરવા માંગો છો?')) {
            onRestoreData(parsed);
            alert('ડેટા સફળતાપૂર્વક રિસ્ટોર થયો છે!');
            onClose();
          }
        } else {
          alert('અમાન્ય બેકઅપ ફાઇલ ફોર્મેટ.');
        }
      } catch (err) {
        alert('ફાઇલ વાંચવામાં ક્ષતિ આવી.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">ડેટા બેકઅપ અને સુરક્ષા</h3>
              <p className="text-xs text-slate-500">બધો લેસન રેકોર્ડ સુરક્ષિત રાખો</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60">
            <h4 className="text-xs font-bold text-blue-900 mb-1">૧. બેકઅપ ડાઉનલોડ કરો</h4>
            <p className="text-xs text-blue-700/80 mb-3">
              બધા ધોરણ, વિદ્યાર્થીઓ અને ૭ વિષયોનું લેસન સ્ટેટસ એક ફાઇલમાં સેવ કરો.
            </p>
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>JSON બેકઅપ ડાઉનલોડ કરો</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <h4 className="text-xs font-bold text-slate-800 mb-1">૨. પહેલાં લીધેલ બેકઅપ રિસ્ટોર કરો</h4>
            <p className="text-xs text-slate-500 mb-3">
              અગાઉ ડાઉનલોડ કરેલી JSON બેકઅપ ફાઇલ અપલોડ કરો.
            </p>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>બેકઅપ ફાઇલ અપલોડ કરો</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                બધો ડેટા સાફ કરવો:
              </span>
              <button
                onClick={() => {
                  if (confirm('ચેતવણી: શું તમે બધો જ લેસન ડેટા ડિલીટ કરી મૂળ સ્થિતિમાં લાવવા માંગો છો?')) {
                    onFullReset();
                    onClose();
                  }
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
              >
                સંપૂર્ણ રીસેટ
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition"
          >
            બંધ કરો
          </button>
        </div>
      </div>
    </div>
  );
};
