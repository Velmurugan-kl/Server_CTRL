#include "mqtt.h"
#include "command.h"
#include "display.h"
#include "secrets.h"
#include "globals.h"

const char* mqttServer = MQTT_BROKER;
const int mqttPort = MQTT_BROKER_PORT;

void mqttCallback(char* topic, byte* payload, unsigned int length) {

  String topicStr = String(topic);
  String command = "";
  for (unsigned int i = 0; i < length; i++) {
    command += (char)payload[i];
  }

  Serial.print("MQTT Message ");
  Serial.print(topic);
  Serial.print("]: ");
  Serial.println(command);
  
  if(topicStr == SERVER_COMMAND){
    if(command == "STATUS"){
      mqttClient.publish(SERVER_STATUS,handleStatus("SERVER").c_str());
    }
    else{
      handleCommand(command,"MQTT");
    }
  }
  else if(topicStr == ROUTER_COMMAND){
    if(command == "STATUS"){
      mqttClient.publish(ROUTER_STATUS ,handleStatus("ROUTER").c_str());
    }
    else{
      handleCommand(command,"MQTT");
    }
  }
  else if(topicStr == NAS_COMMAND){
    if(command == "STATUS"){
      mqttClient.publish(NAS_STATUS,handleStatus("NAS").c_str());
    }
    else{
      handleCommand(command,"MQTT");
    }
  }
  else if(topicStr == MAIN_PWR_COMMAND){
      if(command == "STATUS"){
      mqttClient.publish(MAIN_PWR,handleStatus("PWR").c_str());
    }
    else{
      handleCommand(command,"MQTT");
    }
  }
  else{
      handleCommand(command,"MQTT");
  }
}


void setupMQTT() {
  mqttClient.setServer(mqttServer, mqttPort);
  mqttClient.setCallback(mqttCallback);
}

void reconnectMQTT(PubSubClient &mqttClient) {
  Serial.println("Checking MQTT connection...");
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");

    if (mqttClient.connect("ESP32Client", FLESPI_TOKEN, "")) {
      Serial.println("Connected to MQTT!");
      mqttClient.subscribe(SERVER_COMMAND);
      mqttClient.subscribe(ROUTER_COMMAND);
      mqttClient.subscribe(NAS_COMMAND);
      mqttClient.subscribe(MAIN_PWR_COMMAND);
    } else {
      Serial.print("Connection failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" retrying in 5 seconds...");
      delay(5000);
    }
  }
}

