import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBx8SYxScfrSRYIpShgkv0IO8ind9QnpgQ",
    authDomain: "firenote-18b62.firebaseapp.com",
    databaseURL: "https://firenote-18b62.firebaseio.com",
    projectId: "firenote-18b62",
    storageBucket: "firenote-18b62.appspot.com",
    messagingSenderId: "834865327455",
    appId: "1:834865327455:web:4000e4c3740cb0f31c5aea",
    measurementId: "G-Z3J7CY9PC5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
