#ifndef MQTT_H
#define MQTT_H

#include <PubSubClient.h>

extern const char* mqttServer;
extern const int mqttPort;

void setupMQTT();
void reconnectMQTT(PubSubClient &client);
void mqttCallback(char* topic, byte* payload, unsigned int length);

#endif
