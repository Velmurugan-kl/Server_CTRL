// globals.h
#ifndef GLOBALS_H
#define GLOBALS_H

#include <Ethernet.h>
#include <PubSubClient.h>

// Declare global variables
extern byte mac[];
extern IPAddress ip;
extern EthernetClient ethClient;
extern PubSubClient mqttClient;
extern EthernetServer server;

#endif
