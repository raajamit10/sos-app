import { useState } from "react";
import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import "./Login.css";

function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔐 Setup reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA solved");
          },
        },
        auth
      );
    }
  };

  // 📲 Send OTP
  const sendOTP = async () => {
    if (!phone.startsWith("+")) {
      alert("Use format +91XXXXXXXXXX");
      return;
    }

    try {
      setLoading(true);
      setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
      );

      setConfirmation(result);
      alert("✅ OTP Sent");
    } catch (err) {
      console.error(err);
      alert(err.message || "❌ OTP failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔢 Verify OTP
  const verifyOTP = async () => {
    try {
      setLoading(true);
      const result = await confirmation.confirm(otp);

      const uid = result.user.uid;
      localStorage.setItem("userId", uid);

      onLogin(uid);
    } catch {
      alert("❌ Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>📱 SOS Login</h2>

        {!confirmation ? (
          <>
            <input
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button onClick={sendOTP} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOTP} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* REQUIRED */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}

export default Login;
