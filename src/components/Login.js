import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function Login() {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user to Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      localStorage.setItem("uid", user.uid);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Google Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>SOS Login</h2>
      <button onClick={handleGoogleLogin} style={styles.btn}>
        Sign in with Google
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0a",
    color: "#fff",
  },
  btn: {
    padding: "12px 18px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    background: "#4285F4",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Login;
