import React, { useState } from 'react';
import JSZip from 'jszip';
import { Icon } from './icons';

interface SystemZipExporterProps {
  buttonText?: string;
  variant?: 'primary' | 'secondary' | 'badge' | 'menu' | 'state';
  className?: string;
  stateFilter?: string;
}

export function SystemZipExporter({
  buttonText = '📦 Export Research Data Vault (.ZIP)',
  variant = 'primary',
  className = ''
}: SystemZipExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateZip = async () => {
    setIsExporting(true);
    setExportProgress('Reading data/ vault tree directly from disk...');

    try {
      const zip = new JSZip();

      // Fetch the real data/ files from server API /api/data-files
      const response = await fetch('/api/data-files');
      if (!response.ok) {
        throw new Error(`Failed to read data files from server: ${response.statusText}`);
      }

      const { files }: { files: { path: string; content: string }[] } = await response.json();

      setExportProgress(`Packing ${files.length} real disk files into data/ ZIP tree...`);

      const dataFolder = zip.folder('data');

      files.forEach((file) => {
        if (dataFolder) {
          dataFolder.file(file.path, file.content);
        }
      });

      // Manifest file
      const rootManifest = {
        archiveDate: new Date().toISOString(),
        repository: 'aijaraix/CivicsLenZz',
        status: 'UNTRUSTED_RESEARCH_ONLY',
        sourceOfTruth: 'aijaraix/CivicLenZ',
        totalCommittedFiles: files.length,
        dataIntegrity: 'Disk file copy of data/ directory (+ data/REALITY.md). Generator disabled.'
      };

      zip.file('MANIFEST.json', JSON.stringify(rootManifest, null, 2));

      setExportProgress('Compressing data/ directory into ZIP archive...');
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      const fileName = `CivicsLenZz_Data_Vault_${new Date().toISOString().slice(0, 10)}.zip`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExportProgress('Archive Generated and Downloaded Successfully!');
      setTimeout(() => {
        setIsExporting(false);
        setIsModalOpen(false);
      }, 1500);
    } catch (err: any) {
      console.error('ZIP Export Error:', err);
      setExportProgress(`Export Failed: ${err.message || err}`);
      setTimeout(() => setIsExporting(false), 3000);
    }
  };

  const ModalProgressOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Icon name="download" size={24} className={isExporting ? 'animate-bounce' : ''} />
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-2">Exporting Research Data Vault</h3>
        <p className="text-sm text-slate-400 mb-4">{exportProgress}</p>

        {isExporting && (
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
            <div className="bg-amber-400 h-full w-full animate-pulse"></div>
          </div>
        )}

        {!isExporting && (
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold"
          >
            Close Window
          </button>
        )}
      </div>
    </div>
  );

  if (variant === 'menu') {
    return (
      <>
        <button
          onClick={() => {
            setIsModalOpen(true);
            handleGenerateZip();
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition cursor-pointer ${className}`}
        >
          <Icon name="download" size={14} className="text-amber-400" />
          <span>{buttonText}</span>
        </button>

        {isModalOpen && <ModalProgressOverlay />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          setIsModalOpen(true);
          handleGenerateZip();
        }}
        disabled={isExporting}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/10 transition cursor-pointer disabled:opacity-50 ${className}`}
      >
        <Icon name="download" size={16} />
        <span>{buttonText}</span>
      </button>

      {isModalOpen && <ModalProgressOverlay />}
    </>
  );
}
