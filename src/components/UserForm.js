import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./UserForm.css";

function UserForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    guardianPhone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.guardianPhone
    ) {
      alert("Please fill all fields");
      return;
    }

    const userId = form.phone; // phone as unique ID

    await setDoc(doc(db, "users", userId), {
      ...form,
      createdAt: new Date(),
    });

    localStorage.setItem("userId", userId);
    onSuccess();
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>🧍 User Details</h2>

        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="phone" placeholder="Mobile Number" onChange={handleChange} />
        <input
          name="guardianPhone"
          placeholder="Guardian Mobile Number"
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Address"
          onChange={handleChange}
        />

        <button type="submit">Save & Continue</button>
      </form>
    </div>
  );
}
export default UserForm;

