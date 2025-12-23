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

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha",
        { size: "invisible" }
      );
    }
  };

  const sendOTP = async () => {
    try {
      setLoading(true);
      setupRecaptcha();
      const result = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      setConfirmation(result);
      alert("OTP sent");
    } catch (err) {
      alert("Failed to send OTP");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);
      const result = await confirmation.confirm(otp);
      const userId = result.user.phoneNumber;
      localStorage.setItem("userId", userId);
      onLogin(userId);
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <h2>Login with Phone</h2>

      {!confirmation ? (
        <>
          <input
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
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

      <div id="recaptcha"></div>
    </div>
  );
}

export default Login;
