import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function ProfileForm({ phone, onDone }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const saveProfile = async () => {
    await setDoc(doc(db, "users", phone), {
      name,
      phone,
      address,
      createdAt: new Date(),
    });
    onDone();
  };

  return (
    <div className="login">
      <h2>User Details</h2>

      <input
        placeholder="Full Name"
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        placeholder="Full Address"
        onChange={(e) => setAddress(e.target.value)}
      />

      <button onClick={saveProfile}>Continue</button>
    </div>
  );
}

export default ProfileForm;
