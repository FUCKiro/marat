import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  pdfUrl: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ pdfUrl }) => {
  return (
    <div className="mt-12 text-center">
      {pdfUrl !== "#" && pdfUrl !== "" && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center px-6 py-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#654321] transition-all duration-700 hover:shadow-lg transform hover:-translate-y-1"
        >
          <Download className="h-5 w-5 mr-2" />
          Scarica PDF
        </a>
      )}
    </div>
  );
}

export default DownloadButton;