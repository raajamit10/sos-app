export default function SOSButton({ onSOS }) {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <button
        onClick={onSOS}
        style={{
          backgroundColor: "red",
          color: "white",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          fontSize: "28px",
          border: "none",
          cursor: "pointer"
        }}
      >
        🚨 SOS
      </button>
    </div>
  );
}
