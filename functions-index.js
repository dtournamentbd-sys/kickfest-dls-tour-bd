// এই ফাইলের নাম হবে: functions/index.js
// Firebase CLI দিয়ে আপনার নিজের প্রজেক্টে ডিপ্লয় করতে হবে (নিচে ধাপ দেখুন)।
//
// দুইটা ফাংশন আছে:
//
// 1) subscribeTokenToTopic
//    যখনই কোনো ইউজারের ডিভাইস টোকেন সেভ হয় (users/{phone}/fcmToken),
//    এটা সেই টোকেনকে "all_users" নামের একটা টপিকে সাবস্ক্রাইব করে দেয়।
//
// 2) sendBroadcastPush
//    এডমিন প্যানেল থেকে যখনই notifications/broadcast/{id} এ নতুন নোটিফিকেশন
//    লেখা হয়, এটা "all_users" টপিকে একবারে পুশ পাঠিয়ে দেয় — অর্থাৎ যত ইউজারই
//    থাকুক না কেন, একটা মাত্র কল-এ সবার কাছে পৌঁছে যাবে।

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const TOPIC = "all_users";

exports.subscribeTokenToTopic = functions.database
  .ref("/users/{phone}/fcmToken")
  .onWrite(async (change, context) => {
    const newToken = change.after.val();
    const oldToken = change.before.val();

    // পুরনো টোকেন থাকলে এবং বদলে গেলে, পুরনোটাকে আনসাবস্ক্রাইব করে দেই যাতে ডুপ্লিকেট না হয়
    if (oldToken && oldToken !== newToken) {
      try { await admin.messaging().unsubscribeFromTopic(oldToken, TOPIC); }
      catch (err) { console.log("Unsubscribe old token failed (ignorable):", err.message); }
    }

    if (!newToken) return null; // টোকেন মুছে ফেলা হয়েছে

    try {
      await admin.messaging().subscribeToTopic(newToken, TOPIC);
      console.log(`Subscribed token for ${context.params.phone} to ${TOPIC}`);
    } catch (err) {
      console.error("Subscribe failed:", err);
    }
    return null;
  });

exports.sendBroadcastPush = functions.database
  .ref("/notifications/broadcast/{notifId}")
  .onCreate(async (snapshot) => {
    const notif = snapshot.val();

    const message = {
      topic: TOPIC,
      notification: {
        title: notif.title || "DLS Tour BD",
        body: notif.body || ""
      }
    };

    try {
      await admin.messaging().send(message);
      console.log("Broadcast push sent to topic:", TOPIC);
    } catch (err) {
      console.error("Broadcast push failed:", err);
    }
    return null;
  });

// এডমিন প্যানেল থেকে সবাইকে নোটিফিকেশন পাঠাতে শুধু এইটুকু লিখলেই হবে,
// আর কিছু করা লাগবে না — উপরের ফাংশন দুইটা বাকি কাজ নিজে থেকেই করবে:
//
//   db.ref('notifications/broadcast').push({
//     title: 'ম্যাচ শুরু হচ্ছে!',
//     body: 'আজ রাত ৮টায় নতুন ম্যাচ শুরু হবে।',
//     createdAt: firebase.database.ServerValue.TIMESTAMP
//   });
