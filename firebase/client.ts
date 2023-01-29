import { initializeApp, getApps } from "firebase/app";

// 必要な機能をインポート
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

if (!getApps()?.length) {
  // Firebaseアプリの初期化
  initializeApp(firebaseConfig);
}

// 他ファイルで使うために機能をエクスポート
export const analytics = isSupported().then((yes) =>
  yes ? getAnalytics() : null
);
export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
export const funcions = getFunctions();
