// এই ফাইলটা আপনার সাইটের রুট ফোল্ডারে (home.html, profile.html যেখানে আছে সেখানে) রাখতে হবে।
// URL হতে হবে ঠিক: https://yoursite.com/firebase-messaging-sw.js
// সাবফোল্ডারে রাখলে এটা পুরো সাইট কভার করবে না।

importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDMt3Ra3GMGS4uwn6-LGHwOw4XuFIcR-aE",
  authDomain: "dls-tournament-bd-d8f0a.firebaseapp.com",
  databaseURL: "https://dls-tournament-bd-d8f0a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dls-tournament-bd-d8f0a",
  storageBucket: "dls-tournament-bd-d8f0a.firebasestorage.app",
  messagingSenderId: "705815077213",
  appId: "1:705815077213:web:6e6df3452b17147a3648b4"
});

const messaging = firebase.messaging();

// অ্যাপ বন্ধ থাকলে বা ব্রাউজার ব্যাকগ্রাউন্ডে থাকলে এই হ্যান্ডলার চলবে
// এবং ফোনের সাধারণ (নেটিভ-স্টাইল) নোটিফিকেশন দেখাবে।
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'DLS Tour BD';
  const options = {
    body: (payload.notification && payload.notification.body) || '',
    icon: '/icon-192.png',   // আপনার অ্যাপের একটা 192x192 আইকন এই নামে রুটে রাখুন, না থাকলে এই লাইন বাদ দিন
    badge: '/icon-192.png'
  };
  self.registration.showNotification(title, options);
});
