const SOSButton = ({ onSOS, recording, progress }) => {
  return (
    <div className="sos-wrapper">
      <svg className="progress-ring" width="180" height="180">
        <circle
          className="progress-ring-bg"
          cx="90"
          cy="90"
          r="80"
        />
        <circle
          className="progress-ring-fill"
          cx="90"
          cy="90"
          r="80"
          style={{
            strokeDashoffset: 502 - (502 * progress) / 100,
          }}
        />
      </svg>

      <button
        className={`sos-button ${recording ? "active" : ""}`}
        onClick={onSOS}
        disabled={recording}
      >
        SOS
      </button>
    </div>
  );
};

export default SOSButton;
