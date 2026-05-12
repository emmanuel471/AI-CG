import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js";
import { CloudSun, LucideIcon, Moon, Sun } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ENCRYPTION_KEY = "28714072bac75525f1cda05666b7397e43d38ef7957ded0b7a9369a2e2e1717f";

export const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

export const decryptData = (cipher: string) => {
  const bytes = CryptoJS.AES.decrypt(cipher, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const getGreeting = (): { text: string; Icon: LucideIcon } => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return { text: "Good morning", Icon: Sun };
    } else if (hour < 18) {
      return { text: "Good afternoon", Icon: CloudSun };
    } else {
      return { text: "Good evening", Icon: Moon };
    }
  };

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
};  

export function daysLeft(iso: string) {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
