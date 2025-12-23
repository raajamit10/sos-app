import { useState } from "react";
import "./App.css";

import SOSButton from "./components/SOSButton";
import UserForm from "./components/UserForm";
import Dashboard from "./components/Dashboard";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { storage, db } from "./firebase";

function App() {
  /* ---------------- ADMIN MODE ---------------- */
  // 🔴 Set this to true ONLY for receiver/admin
  const isAdmin = false;

  /* ---------------- USER REGISTRATION ---------------- */
  const [isRegistered, setIsRegistered] = useState(
    !!localStorage.getItem("userId")
  );

  /* ---------------- SOS STATES ---------------- */
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  /* ---------------- ADMIN DASHBOARD ---------------- */
  if (isAdmin) {
    return <Dashboard />;
  }

  /* ---------------- USER FORM ---------------- */
  if (!isRegistered) {
    return <UserForm onSuccess={() => setIsRegistered(true)} />;
  }

  /* ---------------- LOCATION ---------------- */
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        reject
      );
    });
  };

  /* ---------------- AUDIO RECORDING ---------------- */
  const recordAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    mediaRecorder.start();
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

    setTimeout(() => mediaRecorder.stop(), 30000);

    return new Promise((resolve) => {
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        resolve(new Blob(chunks, { type: "audio/webm" }));
      };
    });
  };

  /* ---------------- AUDIO UPLOAD ---------------- */
  const uploadAudioToFirebase = async (audioBlob) => {
    const audioRef = ref(storage, `sos-audio/audio-${Date.now()}.webm`);
    await uploadBytes(audioRef, audioBlob);
    return await getDownloadURL(audioRef);
  };

  /* ---------------- SAVE SOS ---------------- */
  const saveSOStoFirestore = async ({ location, audioURL }) => {
    const userId = localStorage.getItem("userId");
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data();

    await addDoc(collection(db, "sos_alerts"), {
      name: userData.name,
      phone: userData.phone,
      address: userData.address,
      guardianPhone: userData.guardianPhone,

      latitude: location.lat,
      longitude: location.lng,
      audioURL,

      createdAt: serverTimestamp(),
      status: "active",
    });
  };

  /* ---------------- PROGRESS ---------------- */
  const startProgress = () => {
    let time = 0;
    setProgress(0);

    const interval = setInterval(() => {
      time++;
      setProgress((time / 30) * 100);
      if (time >= 30) clearInterval(interval);
    }, 1000);
  };

  /* ---------------- SOS HANDLER ---------------- */
  const handleSOS = async () => {
    try {
      setRecording(true);
      setMessage("🎙️ Recording audio...");
      startProgress();

      const location = await getLocation();
      const audioBlob = await recordAudio();
      const audioURL = await uploadAudioToFirebase(audioBlob);

      await saveSOStoFirestore({ location, audioURL });

      setMessage("✅ SOS Sent Successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ SOS Failed");
    } finally {
      setRecording(false);
      setProgress(0);
    }
  };

  /* ---------------- USER UI ---------------- */
  return (
    <div className="app">
      <SOSButton
        onSOS={handleSOS}
        recording={recording}
        progress={progress}
      />
      {message && <div className="popup">{message}</div>}
    </div>
  );
}

export default App;
