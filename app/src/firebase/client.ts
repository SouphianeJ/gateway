import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
// let storage; // if using storage

// Initialize Firebase Client SDK only if not already initialized
if (!getApps().length) {
    try {
        app = initializeApp(firebaseConfig);
        console.log("Firebase Client SDK initialized.");
    } catch (error) {
        console.error("Firebase Client SDK Initialization Error:", error);
        // Handle client-side initialization error appropriately
        // Maybe show an error message to the user
        throw error; // Re-throw for now
    }
} else {
    app = getApps()[0];
    // console.log("Firebase Client SDK already initialized."); // Optional debug log
}

// Get Firestore and Auth instances
db = getFirestore(app);
auth = getAuth(app);
// storage = getStorage(app); // if using storage

export { app as firebaseClientApp, db as clientDb, auth as clientAuth };