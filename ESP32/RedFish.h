// redfish.h
#ifndef REDFISH_H
#define REDFISH_H

#include <Ethernet.h> // Needed for EthernetClient
#include "secrets.h"

// Redfish connection info

// Function declarations
void getRedfish();
void sendRedfish(String command);
String getPowerState();

#endif
