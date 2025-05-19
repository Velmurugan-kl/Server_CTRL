// mqttService.js
import mqtt from 'mqtt';

let client = null;

export const connectMQTT = () => {
  if (client && client.connected) return client;

  if (!client || client.disconnected) {
    client = mqtt.connect(import.meta.env.VITE_MQTT_URL, {
      username: import.meta.env.VITE_MQTT_USERNAME,
      reconnectPeriod: 2000, // retry every 2s if connection is lost
      connectTimeout: 50000,  // timeout after 50s
      keepalive: 60
    });

    client.on('connect', () => {
      console.log('✅ Connected to MQTT broker');
    });

    client.on('reconnect', () => {
      console.log('🔄 Reconnecting to MQTT broker...');
    });

    client.on('error', (err) => {
      console.error('❌ MQTT error:', err.message);
      // Don't call client.end() here or it will stop retrying
    });

    client.on('close', () => {
      console.warn('⚠️ MQTT connection closed');
    });

    client.on('offline', () => {
      console.warn('🚫 MQTT is offline');
    });
  }

  return client;
};

export const getMQTTClient = () => client;
