type TelegramWebApp = {
  initData?: string;
  colorScheme?: "light" | "dark";
  ready?: () => void;
  expand?: () => void;
  HapticFeedback?: {
    impactOccurred?: (style: "light" | "medium" | "heavy") => void;
    notificationOccurred?: (type: "success" | "warning" | "error") => void;
  };
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function getTelegramWebApp() {
  if (typeof window === "undefined") return undefined;
  return window.Telegram?.WebApp;
}

export function bootTelegramShell() {
  const webApp = getTelegramWebApp();
  webApp?.ready?.();
  webApp?.expand?.();
  return webApp;
}
