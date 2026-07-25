'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, string | number>,
          ) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void;
  onError?: () => void;
}


export function GoogleSignInButton({
  onSuccess,
  onError,
}: GoogleSignInButtonProps) {
 
  return (
   <GoogleLogin
      onSuccess={(credentialResponse) => {
        if(credentialResponse.credential) {
         onSuccess(credentialResponse.credential);
        }
      }}
      onError={() => {
        onError?.();
      }}
      useOneTap
    />
  );
}