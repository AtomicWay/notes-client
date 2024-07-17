import firebase from 'firebase/app';
import 'firebase/auth'; // Include any other Firebase services you plan to use

// Firebase configuration
const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain',
  projectId: 'enotes-storage',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;