'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useEffect, useRef, useState } from 'react';

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void;
  onError?: () => void;
}

export function GoogleSignInButton({
  onSuccess,
  onError,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState(400);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncWidth = () => {
      setButtonWidth(Math.min(400, Math.floor(container.clientWidth)));
    };

    syncWidth();
    const observer = new ResizeObserver(syncWidth);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex min-h-11 w-full items-center justify-center overflow-hidden"
    >
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            onSuccess(credentialResponse.credential);
          }
        }}
        onError={() => {
          onError?.();
        }}
        type="standard"
        theme="outline"
        size="large"
        text="signin_with"
        shape="rectangular"
        logo_alignment="left"
        width={buttonWidth}
        useOneTap
      />
    </div>
  );
}
