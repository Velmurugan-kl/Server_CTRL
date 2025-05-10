#include "IPAddress.h"
#include "mqtt.h"
#include "globals.h"
#ifndef COMMAND_H
#define COMMAND_H
// #include <ESPping.h>
#include<Ethernet.h>
#include <Arduino.h>

void handleCommand(String command, String source);
String handleStatus(String command);
bool testpinf(IPAddress pingClient);

#endif
