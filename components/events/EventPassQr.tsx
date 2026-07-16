'use client';

import { QRCodeSVG } from 'qrcode.react';

export default function EventPassQr({
  passUrl,
  size = 180,
}: {
  passUrl: string;
  size?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <QRCodeSVG value={passUrl} size={size} level="M" includeMargin />
      </div>
      <p className="text-center text-xs text-gray-500 max-w-[220px]">
        Show this QR at the venue for entry verification
      </p>
    </div>
  );
}