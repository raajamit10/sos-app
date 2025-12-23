import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import "./Dashboard.css";

function Dashboard() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "sos_alerts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlerts(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard">
      <h1>🚨 SOS Receiver Dashboard</h1>

      {alerts.length === 0 && <p>No SOS alerts yet.</p>}

      <div className="alert-list">
        {alerts.map((alert) => (
          <div className="alert-card" key={alert.id}>
            <h3>🧍 {alert.name}</h3>

            <p><strong>📞 Phone:</strong> {alert.phone}</p>
            <p><strong>👨‍👩‍👧 Guardian:</strong> {alert.guardianPhone}</p>
            <p><strong>🏠 Address:</strong> {alert.address}</p>

            <p>
              <strong>📍 Location:</strong>{" "}
              {alert.latitude}, {alert.longitude}
            </p>

            {alert.audioURL && (
              <audio controls src={alert.audioURL}></audio>
            )}

            <p className="status">
              <strong>Status:</strong> {alert.status || "active"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
