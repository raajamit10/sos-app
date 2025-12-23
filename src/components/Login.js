import { useState } from "react";
import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Correct reCAPTCHA setup (WORKS ON VERCEL)
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "normal", // 👈 IMPORTANT (not invisible)
        },
        auth
      );
    }
  };

  const sendOTP = async () => {
    if (!phone.startsWith("+")) {
      alert("Use +91XXXXXXXXXX format");
      return;
    }

    try {
      setLoading(true);
      setupRecaptcha();

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );

      setConfirmation(confirmationResult);
      alert("OTP sent");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);
      const result = await confirmation.confirm(otp);

      const uid = result.user.uid;
      localStorage.setItem("userId", uid);
      onLogin(uid);
    } catch (error) {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        {!confirmation ? (
          <>
            <input
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div id="recaptcha-container"></div>
            <button onClick={sendOTP} disabled={loading}>
              Send OTP
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
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
