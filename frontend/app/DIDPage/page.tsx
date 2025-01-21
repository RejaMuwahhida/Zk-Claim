"use client";

import { useSearchParams } from 'next/navigation';
import QRCode from 'react-qr-code';

export default function DIDPage() {
  const searchParams = useSearchParams();
  const did = searchParams.get('did');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-2xl font-semibold text-sky-700">Your DID</h1>
      {did ? (
        <>
          <p className="text-lg text-gray-700">{did}</p>
          <div className="mt-4">
            <QRCode value={did} />
          </div>
          <button
            className="mt-6 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow-md"
            onClick={() => navigator.clipboard.writeText(did)}
          >
            Copy DID
          </button>
        </>
      ) : (
        <p className="text-red-500">No DID found. Please try again.</p>
      )}
    </div>
  );
}
