import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallState {
  supported: boolean;
  prompt: (() => Promise<void>) | null;
  dismissed: boolean;
  dismiss: () => void;
}

export function usePWAInstall(): PWAInstallState {
  const [supported, setSupported] = useState(false);
  const [prompt, setPrompt] = useState<(() => Promise<void>) | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      const deferred = event as BeforeInstallPromptEvent;
      setSupported(true);
      setPrompt(() => async () => {
        await deferred.prompt();
      });
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  return {
    supported,
    prompt,
    dismissed,
    dismiss,
  };
}
