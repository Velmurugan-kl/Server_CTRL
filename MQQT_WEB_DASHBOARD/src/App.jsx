import { useEffect, useRef, useState, useMemo } from "react";
import Layout from "./Layout";
import StatusTextCard from "./StatusTextCard";
import StatusButtonCard from "./StatusButtonCard";
import { connectMQTT } from "./mqttService";
import PasswordModal from "./PasswordModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const clientRef = useRef(null);
  const timeoutRef = useRef(null);
  const responseReceivedRef = useRef(false);

  const [serverStatus, setServerStatus] = useState("Loading...");
  const [routerStatus, setRouterStatus] = useState("Loading...");
  const [pingStatus, setPingStatus] = useState("Checking...");
  const [powerStatus, setPowerStatus] = useState("Checking...");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const normalizedServerStatus = useMemo(
    () => serverStatus.trim().toLowerCase(),
    [serverStatus]
  );
  const normalizedRouterStatus = useMemo(
    () => routerStatus.trim().toLowerCase(),
    [routerStatus]
  );
  const normalizedPowerStatus = useMemo(
    () => powerStatus.trim().toLowerCase(),
    [powerStatus]
  );

  const serverPower = useMemo(
    () => (normalizedServerStatus === "on" ? "Power OFF" : "Power ON"),
    [normalizedServerStatus]
  );
  const routerPower = useMemo(
    () => (normalizedRouterStatus === "on" ? "Power OFF" : "Power ON"),
    [normalizedRouterStatus]
  );
  const powerCurrent = useMemo(
    () => (normalizedPowerStatus === "on" ? "Power OFF" : "Power ON"),
    [normalizedPowerStatus]
  );

  const serverCommand = useMemo(
    () => (normalizedServerStatus === "on" ? "NAS_OFF" : "NAS_ON"),
    [normalizedServerStatus]
  );
  const routerCommand = useMemo(
    () => (normalizedRouterStatus === "on" ? "ROUTER_OFF" : "ROUTER_ON"),
    [normalizedRouterStatus]
  );
  const powerCommand = useMemo(
    () => (normalizedPowerStatus === "on" ? "PWR_OFF" : "PWR_ON"),
    [normalizedPowerStatus]
  );

  useEffect(() => {
    const client = connectMQTT();
    clientRef.current = client;

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(import.meta.env.VITE_SERVER_PATH);
      client.subscribe(import.meta.env.VITE_ROUTER_PATH);
      client.subscribe(import.meta.env.VITE_NAS_PATH);
      client.subscribe(import.meta.env.VITE_PWR_STATUS_PATH);
      handleRefresh();
    });

    client.on("message", (topic, message) => {
      const msg = message.toString();
      console.log(`[MQTT RECEIVED] Topic: ${topic} | Message: ${msg}`);
      responseReceivedRef.current = true;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        setRefreshing(false);
      }

      if (topic === import.meta.env.VITE_PWR_STATUS_PATH) {
        setPowerStatus(msg);
      } else if (topic === import.meta.env.VITE_SERVER_PATH) {
        setServerStatus(msg);
      } else if (topic === import.meta.env.VITE_ROUTER_PATH) {
        setRouterStatus(msg);
      } else if (topic === import.meta.env.VITE_NAS_PATH) {
        setPingStatus(msg);
      }
    });

    return () => {
      if (client && client.connected) {
        client.end();
      }
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const expiry = parseInt(localStorage.getItem("auth_expiry"), 10);
    if (isNaN(expiry)) {
      setIsAuthenticated(false);
      return;
    }

    const timeLeft = expiry - Date.now();

    if (timeLeft <= 0) {
      // Expired already
      handleLogout();
      return;
    }

    const timeout = setTimeout(() => {
      handleLogout();
      toast.info("Session expired, please sign in again.");
    }, timeLeft);

    return () => clearTimeout(timeout);
  }, [isAuthenticated]);

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    const expiry = parseInt(localStorage.getItem("auth_expiry"), 10);

    if (auth === "true" && !isNaN(expiry) && Date.now() < expiry) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("authenticated");
      localStorage.removeItem("auth_expiry");
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_expiry");
    localStorage.removeItem("authenticated");
    setIsAuthenticated(false);
  };

  const handleRefresh = () => {
    console.log("Refreshing...");
    toast.info("Refreshing");
    setRefreshing(true);
    responseReceivedRef.current = false;

    const client = clientRef.current;
    client.publish(import.meta.env.VITE_PWR_PATH, "STATUS");
    client.publish(import.meta.env.VITE_SERVER_STATUS_PATH, "STATUS");
    client.publish(import.meta.env.VITE_ROUTER_STATUS_PATH, "STATUS");
    client.publish(import.meta.env.VITE_NAS_PING_PATH, "STATUS");

    timeoutRef.current = setTimeout(() => {
      setRefreshing(false);
      if (!responseReceivedRef.current) {
        toast.warn(
          "No MQTT response received. Please check your connection or devices."
        );
      }
    }, 15000);
  };

  const handleServerPower = () => {
    const client = clientRef.current;
    if (client && client.connected) {
      client.publish(import.meta.env.VITE_SERVER_STATUS_PATH, serverCommand);
      console.log("SERVER COMMAND SENT----->" + serverCommand);
      toast.success("Server command sent: " + serverCommand);
    }
  };

  const handleRouterPower = () => {
    const client = clientRef.current;
    if (client && client.connected) {
      client.publish(import.meta.env.VITE_ROUTER_STATUS_PATH, routerCommand);
      console.log("ROUTER COMMAND SENT----->" + routerCommand);
      toast.success("Router command sent: " + routerCommand);
    }
  };

  const handlePower = () => {
    const client = clientRef.current;
    if (client && client.connected) {
      client.publish(import.meta.env.VITE_PWR_PATH, powerCommand);
      console.log("POWER COMMAND SENT----->" + powerCommand);
      toast.success("Main Power command sent: " + powerCommand);
    }
  };

  const handleSignIn = () => {
    setShowPasswordModal(true);
  };
  const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes

  const handlePasswordSubmit = async (password) => {
    setShowPasswordModal(false);

    try {
      const response = await fetch(
        "https://server-ctrl.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "admin", // or dynamically set
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      // Store token and expiry in localStorage
      const expiration = Date.now() + SESSION_TIMEOUT;
      localStorage.setItem("token", data.token);
      localStorage.setItem("auth_expiry", expiration.toString());
      localStorage.setItem("authenticated", "true"); // <--- Add this
      setIsAuthenticated(true);

      toast.success("Authenticated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Authentication failed: " + err.message);
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
  };

  return (
    <>
      <Layout
        onRefresh={handleRefresh}
        onSignIn={handleSignIn}
        onSignOut={handleLogout}
        isAuthenticated={isAuthenticated}
      >
        <StatusButtonCard
          label="Server"
          status={serverStatus}
          buttonLabel={serverPower}
          onPowerClick={handleServerPower}
          isAuthenticated={isAuthenticated}
          disabled={!isAuthenticated}
        />
        <StatusButtonCard
          label="Router"
          status={routerStatus}
          buttonLabel={routerPower}
          onPowerClick={handleRouterPower}
          disabled={!isAuthenticated}
        />
        <StatusButtonCard
          label="Main Power"
          status={powerStatus}
          buttonLabel={powerCurrent}
          onPowerClick={handlePower}
          disabled={!isAuthenticated}
        />
        <StatusTextCard label="Truenas Status" status={pingStatus} />
      </Layout>

      {showPasswordModal && (
        <PasswordModal
          onSubmit={handlePasswordSubmit}
          onClose={handlePasswordCancel}
        />
      )}
      <ToastContainer
        position="top-center"
        autoClose={4000} // faster popup close
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
