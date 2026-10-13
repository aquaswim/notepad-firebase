import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';

const env = import.meta.env;

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_APIKEY,
    authDomain: env.VITE_FIREBASE_AUTHDOMAIN,
    databaseURL: env.VITE_FIREBASE_DATABASEURL,
    projectId: env.VITE_FIREBASE_PROJECTID,
    storageBucket: env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: env.VITE_FIREBASE_APPID,
    measurementId: env.VITE_FIREBASE_MEASUREMENTID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
