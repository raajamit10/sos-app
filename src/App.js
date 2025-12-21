import SOSButton from "./components/SOSButton";

function App() {

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        reject
      );
    });
  };

  const recordAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    mediaRecorder.start();
    console.log("🎙️ Recording started");

    mediaRecorder.ondataavailable = e => chunks.push(e.data);

    setTimeout(() => {
      mediaRecorder.stop();
    }, 30000); // 30 seconds

    return new Promise((resolve) => {
      mediaRecorder.onstop = () => {
        console.log("🛑 Recording stopped");
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        resolve(audioBlob);
      };
    });
  };

  const handleSOS = async () => {
    try {
      const location = await getLocation();
      const audio = await recordAudio();

      console.log("📍 Location:", location);
      console.log("🎧 Audio Blob:", audio);

      alert("SOS captured! Check console.");
    } catch (err) {
      alert("Permission denied or error occurred");
      console.error(err);
    }
  };

  return <SOSButton onSOS={handleSOS} />;
}

export default App;
