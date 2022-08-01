import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDNJBu35AtCGHca_zcMSWo3Jd2rmAetE8o',
  authDomain: 'isow-d3770.firebaseapp.com',
  projectId: 'isow-d3770',
  storageBucket: 'isow-d3770.appspot.com',
  messagingSenderId: '256221181436',
  appId: '1:256221181436:web:37a816bcbc10b5946cae79',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
