import { useState } from "react";
import SOSButton from "./components/SOSButton";
import "./App.css";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "./firebase";

function App() {
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  // 📍 Get Location
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        reject
      );
    });
  };

  // 🎙️ Record Audio
  const recordAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    mediaRecorder.start();

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

    setTimeout(() => {
      mediaRecorder.stop();
    }, 30000);

    return new Promise((resolve) => {
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        resolve(audioBlob);
      };
    });
  };

  // ☁️ Upload Audio
  const uploadAudioToFirebase = async (audioBlob) => {
    const audioRef = ref(
      storage,
      `sos-audio/audio-${Date.now()}.webm`
    );
    await uploadBytes(audioRef, audioBlob);
    return await getDownloadURL(audioRef);
  };

  // 🧾 Save to Firestore
  const saveSOStoFirestore = async ({ location, audioURL }) => {
    await addDoc(collection(db, "sos_alerts"), {
      latitude: location.lat,
      longitude: location.lng,
      audioURL,
      createdAt: serverTimestamp(),
      status: "active",
    });
  };

  // ⏳ Progress Ring
  const startProgress = () => {
    let time = 0;
    setProgress(0);

    const interval = setInterval(() => {
      time++;
      setProgress((time / 30) * 100);
      if (time >= 30) clearInterval(interval);
    }, 1000);
  };

  // 🚨 SOS Handler
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
