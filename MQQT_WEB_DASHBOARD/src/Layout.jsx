import React from "react";

const Layout = ({ children, onRefresh, onSignIn, isAuthenticated }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
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
          height: "72px",
          backgroundColor: "#1E1E1E",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "26px",
            fontWeight: 600,
            color: "#fff",
            fontFamily: "sans-serif",
          }}
        >
          Server Control
        </h1>

        {/* Right-side buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
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
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          padding: "16px",
          marginTop: "28px",
          overflowY: "auto",
        }}
      >
        {React.Children.map(children, (child, index) => (
          <div
            tabIndex={index === 0 || index === 2 ? 0 : undefined}
            autoFocus={index === 2}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Layout;
