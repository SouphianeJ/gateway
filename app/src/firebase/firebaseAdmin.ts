import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_ADMIN_CREDENTIALS_JSON!
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const adminAuth = admin.auth();
export const db = admin.firestore();