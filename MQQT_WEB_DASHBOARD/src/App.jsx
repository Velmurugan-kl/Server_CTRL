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
  const [routerStatus, setRouterStatus] = useState('Loading...');
  const [pingStatus, setPingStatus] = useState('Checking...');
  const [powerStatus, setPowerStatus] = useState('Checking...');
  const serverPower =  serverStatus.trim().toLowerCase() === 'on' ? 'Power OFF' : 'Power ON';
  const routerPower = routerStatus.trim().toLowerCase() === 'on' ? 'Power OFF' : 'Power ON';
  const powerCurrent = powerStatus.trim().toLowerCase() === 'on' ? 'Power OFF' : 'Power ON';
  const serverCommand = serverStatus.trim().toLowerCase() === 'on' ? 'NAS_OFF' : 'NAS_ON';
  const routerCommand = routerStatus.trim().toLowerCase() === 'on' ? 'ROUTER_OFF' : 'ROUTER_ON';
  const powerCommand = routerStatus.trim().toLowerCase() === 'on' ? 'PWR_OFF' : 'PWR_ON';
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
      client.subscribe(import.meta.env.VITE_PWR_STATUS_PATH);
      handleRefresh();
    });

    client.on('message', (topic, message) => {
      const msg = message.toString();
      if (topic === import.meta.env.VITE_SERVER_PATH) {
        setServerStatus(msg);
        console.log("server status ---> "+serverStatus);
      } else if (topic === import.meta.env.VITE_ROUTER_PATH) {
        setRouterStatus(msg);
        console.log("router status ---> "+routerStatus);
      } else if (topic === import.meta.env.VITE_NAS_PATH) {
        setPingStatus(msg);
        console.log("nas status ---> "+pingStatus);
      } else if (topic === import.meta.env.VITE_PWR_STATUS_PATH) {
        setPowerStatus(msg);
        console.log("power status ---> "+powerStatus);
      }
      
      
    });

  }, []);

  const handleRefresh = () => {
    console.log('Refreshing...');
    const client = clientRef.current;
    client.publish(import.meta.env.VITE_PWR_PATH, 'STATUS');
    client.publish(import.meta.env.VITE_SERVER_STATUS_PATH, 'STATUS');
    client.publish(import.meta.env.VITE_ROUTER_STATUS_PATH, 'STATUS');
    client.publish(import.meta.env.VITE_NAS_PING_PATH, 'STATUS');
    
  };

  const handleServerPower = () => {
    const client = clientRef.current;
    if (client && client.connected) {
      client.publish(import.meta.env.VITE_SERVER_STATUS_PATH, serverCommand);
      console.log("SERVER COMMAND SENT----->"+serverCommand);
    }
  };
  
  const handleRouterPower = () => {
    const client = clientRef.current;
    if (client && client.connected) {
      client.publish(import.meta.env.VITE_ROUTER_STATUS_PATH, routerCommand);
      console.log("ROUTER COMMAND SENT----->"+routerCommand);
    }
  };
  const handlePower = () => {
    const client = clientRef.current;
    if (client && client.connected) {
      client.publish(import.meta.env.VITE_PWR_PATH, powerCommand);
      console.log("POWER COMMAND SENT----->"+powerCommand);
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
        <StatusButtonCard
          label="Main Power"
          status={powerCurrent}
          buttonLabel={powerStatus}
          onPowerClick={handlePower}
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
