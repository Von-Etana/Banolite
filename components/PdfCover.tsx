'use client';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker path to local if needed or cdn
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export const PdfCover = ({ file, alt }: { file: string, alt: string }) => {
    const [numPages, setNumPages] = useState<number | null>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden bg-[#F9F9F9]">
            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <div className="w-full h-full flex items-center justify-center text-brand-muted">
                        Loading cover...
                    </div>
                }
                error={
                    <div className="w-full h-full flex flex-col items-center justify-center text-brand-muted text-center p-4">
                        <span className="text-sm">Unable to load PDF cover.</span>
                    </div>
                }
            >
                <Page 
                    pageNumber={1} 
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="flex justify-center transition-transform duration-500 group-hover:scale-105" 
                    width={300} // adjust scale to fit within aspect ratio roughly
                />
            </Document>
        </div>
    );
};
