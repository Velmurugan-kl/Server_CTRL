import React from "react";

const Layout = ({ children, onRefresh, onSignIn, isAuthenticated }) => {
  return (
    <div
      style={{
        width: "100vw",             // Full viewport width
        minHeight: "100vh",         // Full height
        backgroundColor: "#101010",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      tabIndex={0}
    >
      {/* Header */}
      <div
  style={{
    minHeight: "72px",
    backgroundColor: "#1E1E1E",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    width: "100%",
    boxSizing: "border-box", // important for padding
    overflow: "visible",     // so buttons aren't clipped
  }}
>
  ...
  <div style={{ display: "flex", gap: "10px", marginTop: "8px", minWidth: 0 }}>
    <button
      onClick={onSignIn}
      style={{
        height: "40px",
        backgroundColor: "#333",
        border: "none",
        borderRadius: "8px",
        padding: "0 12px",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        flexShrink: 0,         // prevent shrinking
      }}
      title="Sign In"
    >
      Sign In
    </button>

    <button
      onClick={onRefresh}
      disabled={!isAuthenticated}
      style={{
        width: "40px",
        height: "40px",
        backgroundColor: !isAuthenticated ? "#555" : "#333",
        border: "none",
        borderRadius: "8px",
        padding: "8px",
        cursor: !isAuthenticated ? "not-allowed" : "pointer",
        color: !isAuthenticated ? "#888" : "#fff",
        flexShrink: 0,       // prevent shrinking
      }}
      title="Refresh"
    >
      🔄
    </button>
  </div>
</div>


      {/* Grid Content */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          padding: "16px",
          overflowY: "auto",
          width: "100%",
        }}
      >
        {React.Children.map(children, (child, index) => (
          <div
            tabIndex={index === 0 || index === 2 ? 0 : undefined}
            style={{ width: "100%" }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Layout;
