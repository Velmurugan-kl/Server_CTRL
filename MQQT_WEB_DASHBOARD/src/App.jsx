// app.jsx
import { useEffect, useRef, useState } from 'react';
import Layout from './Layout';
import StatusTextCard from './StatusTextCard';
import StatusButtonCard from './StatusButtonCard';
import { connectMQTT } from './mqttService';
import PasswordModal from './PasswordModal';

function App() {
  const clientRef = useRef(null);

  // State to hold statuses received from MQTT
  const [serverStatus, setServerStatus] = useState('Loading...');
  const serverPower =  serverStatus.trim().toLowerCase() === 'on' ? 'Power OFF' : 'Power ON';
  const [routerStatus, setRouterStatus] = useState('Loading...');
  const routerPower = routerStatus.trim().toLowerCase() === 'on' ? 'Power OFF' : 'Power ON';
  const [pingStatus, setPingStatus] = useState('Checking...');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const client = connectMQTT();
    clientRef.current = client;

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe(import.meta.env.VITE_SERVER_PATH);
      client.subscribe(import.meta.env.VITE_ROUTER_PATH);
      client.subscribe(import.meta.env.VITE_NAS_PATH);
      handleRefresh();
    });

    client.on('message', (topic, message) => {
      const msg = message.toString();
      if (topic === import.meta.env.VITE_SERVER_PATH) {
        setServerStatus(msg);
      } else if (topic === import.meta.env.VITE_ROUTER_PATH) {
        setRouterStatus(msg);
      } else if (topic === import.meta.env.VITE_NAS_PATH) {
        setPingStatus(msg);
      }
      
      
    });

  }, []);

  const handleRefresh = () => {
    console.log('Refreshing...');
    const client = clientRef.current;
    client.publish(import.meta.env.VITE_SERVER_STATUS_PATH, 'STATUS');
    client.publish(import.meta.env.VITE_ROUTER_STATUS_PATH, 'STATUS');
    client.publish(import.meta.env.VITE_NAS_PING_PATH, 'STATUS');
    
  };

  const handleServerPower = () => {
    const client = clientRef.current;
    if (client && client.connected) {
      client.publish(import.meta.env.VITE_SERVER_STATUS_PATH, 'NAS_ON');
    }
  };

  const handleRouterPower = () => {
    const client = clientRef.current;
    if (client && client.connected) {
      client.publish(import.meta.env.VITE_ROUTER_STATUS_PATH, 'ROUTER_ON');
    }
  };

  const handleSignIn = () => {
    setShowPasswordModal(true);
  };
  
  const handlePasswordSubmit = (password) => {
    setShowPasswordModal(false);
    if (password === import.meta.env.VITE_LOCAL_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };
  
  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
  };

  return (
    <>
      <Layout onRefresh={handleRefresh} onSignIn={handleSignIn} isAuthenticated={isAuthenticated}>
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
        <StatusTextCard
          label="Truenas Status"
          status={pingStatus}
        />
      </Layout>
  
      {showPasswordModal && (
        <PasswordModal
          onSubmit={handlePasswordSubmit}
          onClose={handlePasswordCancel}
        />
      )}
    </>
  );
  
}

export default App;
