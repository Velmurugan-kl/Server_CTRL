// mqttService.js
import mqtt from 'mqtt';

let client = null;

export const connectMQTT = () => {
  if (client) return client;

  client = mqtt.connect(import.meta.env.VITE_MQTT_URL, {
    username: import.meta.env.VITE_MQTT_USERNAME,
  });

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
  });

  client.on('error', (err) => {
    console.error('MQTT error:', err);
  });
  return client;
};

export const getMQTTClient = () => client;
