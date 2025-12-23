import { useState } from "react";
import "./App.css";

import Login from "./components/Login";
import UserForm from "./components/UserForm";
import SOSButton from "./components/SOSButton";

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
  /* ---------------- AUTH ---------------- */
  const userId = localStorage.getItem("userId"); // phone number
  const [isRegistered, setIsRegistered] = useState(false);

  /* ---------------- SOS STATES ---------------- */
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  /* ---------------- LOGIN ---------------- */
  if (!userId) {
    return <Login />;
  }

  /* ---------------- PROFILE FORM ---------------- */
  if (!isRegistered) {
    return <UserForm onSuccess={() => setIsRegistered(true)} />;
  }

  /* ---------------- LOCATION ---------------- */
  const getLocation = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => reject("Location permission denied")
      );
    });

  /* ---------------- AUDIO RECORD ---------------- */
  const recordAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    let chunks = [];

    recorder.start();
    recorder.ondataavailable = (e) => chunks.push(e.data);

    setTimeout(() => recorder.stop(), 30000);

    return new Promise((resolve) => {
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        resolve(new Blob(chunks, { type: "audio/webm" }));
      };
    });
  };

  /* ---------------- AUDIO UPLOAD ---------------- */
  const uploadAudio = async (blob) => {
    const audioRef = ref(storage, `sos-audio/${Date.now()}.webm`);
    await uploadBytes(audioRef, blob);
    return await getDownloadURL(audioRef);
  };

  /* ---------------- SAVE SOS ---------------- */
  const saveSOS = async ({ location, audioURL }) => {
    const userSnap = await getDoc(doc(db, "users", userId));

    if (!userSnap.exists()) {
      throw new Error("User profile not found");
    }

    const user = userSnap.data();

    await addDoc(collection(db, "sos_alerts"), {
      // user info
      name: user.name,
      phone: user.phone,
      address: user.address,
      guardianPhone: user.guardianPhone,

      // sos info
      latitude: location.lat,
      longitude: location.lng,
      audioURL,

      status: "active",
      createdAt: serverTimestamp(),
    });
  };

  /* ---------------- PROGRESS BAR ---------------- */
  const startProgress = () => {
    let t = 0;
    setProgress(0);

    const timer = setInterval(() => {
      t++;
      setProgress((t / 30) * 100);
      if (t >= 30) clearInterval(timer);
    }, 1000);
  };

  /* ---------------- SOS HANDLER ---------------- */
  const handleSOS = async () => {
    try {
      setRecording(true);
      setMessage("🚨 Recording SOS...");
      startProgress();

      const location = await getLocation();
      const audioBlob = await recordAudio();
      const audioURL = await uploadAudio(audioBlob);

      await saveSOS({ location, audioURL });

      setMessage("✅ SOS sent successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ SOS failed. Check permissions.");
    } finally {
      setRecording(false);
      setProgress(0);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  /* ---------------- UI ---------------- */
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
