import React from "react";

const StatusButtonCard = ({
  label = "Device",
  status = "Loading...",
  onPowerClick,
  buttonLabel = "Power",
  style = {},
  disabled = false,
}) => {
  return (
    <div
      style={{
        width: "100%", // 👈 make it flexible
        maxWidth: "200px", // 👈 optional limit
        height: "150px",
        margin: "5px auto", // 👈 center if smaller than full width
        padding: "24px",
        backgroundColor: "#1e1e1e",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <span
        style={{
          fontSize: "12px",
          color: "#AAAAAA",
          marginBottom: "4px",
          textAlign: "center",
        }}
        aria-label="Card label"
      >
        {label}
      </span>

      <span
        style={{
          fontSize: "10px",
          color: "#FFFFFF",
          marginBottom: "24px",
          textAlign: "center",
        }}
        aria-label="Current status"
      >
        {status}
      </span>

      <button
        onClick={onPowerClick}
        disabled={disabled}
        style={{
          width: "80px",
          padding: "6px 4px",
          backgroundColor: disabled ? "#555" : "#6200EE",
          color: disabled ? "#aaa" : "#000",
          border: "none",
          borderRadius: "6px",
          cursor: disabled ? "not-allowed" : "pointer",
          fontWeight: "bold",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          transition: "background-color 0.3s ease",
        }}
        aria-label="Power button"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default StatusButtonCard;
