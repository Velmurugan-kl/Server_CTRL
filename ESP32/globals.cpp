#include "globals.h"

// Define the global variables
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };


EthernetClient ethClient;
PubSubClient mqttClient(ethClient);
EthernetServer server(80);
