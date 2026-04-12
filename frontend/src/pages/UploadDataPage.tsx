import { useState, useRef } from "react";
import { getFreshJwt } from "../lib/getFreshJWT";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UploadDataPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (f: File) => {
        if (f.type !== 'text/csv' && !f.name.endsWith('.csv')) {
            alert('Only CSV files are accepted');
            return;
        }
        setFile(f);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) handleFile(dropped);
    };

    const handleUpload = async () => {
        if (!file) return;
        if (import.meta.env.DEV) return;

        const token = await getFreshJwt();
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_BASE_URL}/api/market/upload-data`, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${token}`},
            body: formData
        });

        if (!res.ok) throw new Error('Upload Failed');
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) handleFile(selected);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <nav className="w-screen bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900">Car Market</h1>
                    <button onClick={() => window.history.back()} className="text-sm text-gray-900 hover:text-gray-600 transition-colors cursor-pointer">Back</button>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-12 max-w-lg">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Upload Data</h2>
                <p className="text-gray-400 text-sm mb-10">Upload a CSV file to import market data</p>

                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl px-8 py-16 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                        dragging ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                    }`}
                >
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    {file ? (
                        <p className="text-gray-900 font-medium text-sm">{file.name}</p>
                    ) : (
                        <>
                            <p className="text-gray-900 font-medium text-sm">Drop your CSV here</p>
                            <p className="text-gray-400 text-xs">or click to browse</p>
                        </>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <button
                        onClick={() => setFile(null)}
                        disabled={!file}
                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:invisible"
                    >
                        Remove
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!file}
                        className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadDataPage;
