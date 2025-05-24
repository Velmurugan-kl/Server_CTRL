import React from "react";

const Layout = ({ children, onRefresh, onSignIn, onSignOut, isAuthenticated }) => {
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#0f0f0f",
        display: "flex",
        flexDirection: "column",
        color: "#f0f0f0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
      tabIndex={0}
    >
      {/* Header */}
      <header
        style={{
          height: "64px",
          backgroundColor: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          borderBottom: "1px solid #333",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: "1.2rem",
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          Home Control Dashboard
        </h1>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={isAuthenticated ? onSignOut : onSignIn}
            title={isAuthenticated ? "Sign Out" : "Sign In"}
            style={{
              padding: "8px 16px",
              background: "#2a2a2a",
              borderRadius: "8px",
              border: "1px solid #444",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#444")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#2a2a2a")}
          >
            {isAuthenticated ? "Sign Out" : "Sign In"}
          </button>

          <button
            onClick={onRefresh}
            disabled={!isAuthenticated}
            title="Refresh"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              fontSize: "1.2rem",
              background: isAuthenticated ? "#2a2a2a" : "#3a3a3a",
              color: isAuthenticated ? "#fff" : "#777",
              cursor: isAuthenticated ? "pointer" : "not-allowed",
              transition: "all 0.2s ease-in-out",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseOver={(e) => {
              if (isAuthenticated) e.currentTarget.style.background = "#444";
            }}
            onMouseOut={(e) => {
              if (isAuthenticated) e.currentTarget.style.background = "#2a2a2a";
            }}
          >
            🔄
          </button>
        </div>
      </header>

      {/* Content Grid */}
      <main
        style={{
          flex: 1,
          padding: "16px",
          margin: "0 auto",
          width: "100%",
          maxWidth: "1400px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "12px",
          overflowY: "auto",
        }}
      >
        {React.Children.map(children, (child, index) => (
          <div tabIndex={index === 0 || index === 2 ? 0 : undefined}>
            {child}
          </div>
        ))}
      </main>
    </div>
  );
};

export default Layout;
