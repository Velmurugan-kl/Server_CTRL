// redfish.cpp
#include "redfish.h"
#include <secrets.h>

void getRedfish() {
  EthernetClient client;
  const char* path = "/redfish/v1/Systems/System.Embedded.1";

  if (client.connect(REDFISH_HOST, REDFISH_PORT)) {
    client.println("GET " + String(path) + " HTTP/1.1");
    client.println("Host: " + String(REDFISH_HOST));
    client.println("Authorization: Basic " + String(REDFISH_AUTH));
    client.println("Connection: close");
    client.println();

    unsigned long timeout = millis();
    while (client.available() == 0 && millis() - timeout < 50000);
    while (client.available()) {
      Serial.write(client.read());
    }
    client.stop();
  } else {
    Serial.println("Redfish GET failed");
  }
}

void sendRedfish(String command) {
  EthernetClient client;
  const char* path = "/redfish/v1/Systems/System.Embedded.1/Actions/ComputerSystem.Reset";
  String payload = "{\"ResetType\": \"";
  payload = payload + command;
  payload = payload + "\"}";

  if (client.connect(REDFISH_HOST, REDFISH_PORT)) {
    client.println("POST " + String(path) + " HTTP/1.1");
    client.println("Host: " + String(REDFISH_HOST));
    client.println("Content-Type: application/json");
    client.println("Content-Length: " + String(payload.length()));
    client.println("Authorization: Basic " + String(REDFISH_AUTH));
    client.println("Connection: close");
    client.println();
    client.println(payload);

    unsigned long timeout = millis();
    while (client.available() == 0 && millis() - timeout < 50000);
    while (client.available()) {
      Serial.write(client.read());
    }
    client.stop();
  } else {
    Serial.println("Redfish POST failed");
  }
}

String getPowerState() {
  EthernetClient client;
  const char* path = "/redfish/v1/Chassis/System.Embedded.1/";

  if (client.connect(REDFISH_HOST, REDFISH_PORT)) {
    client.println("GET " + String(path) + " HTTP/1.1");
    client.println("Host: " + String(REDFISH_HOST));
    client.println("Authorization: Basic " + String(REDFISH_AUTH));
    client.println("Connection: close");
    client.println();

    unsigned long timeout = millis();
    while (client.available() == 0 && millis() - timeout < 50000);

    String response = "";
    while (client.available()) {
      char c = client.read();
      response += c;
    }
    client.stop();

    // Find JSON body (skip HTTP headers)
    int bodyStart = response.indexOf("\r\n\r\n");
    if (bodyStart != -1) {
      String jsonBody = response.substring(bodyStart + 4);

      // Now search for "PowerState" in JSON body
      int index = jsonBody.indexOf("\"PowerState\"");
      if (index != -1) {
        int start = jsonBody.indexOf(":", index) + 1;
        int firstQuote = jsonBody.indexOf("\"", start);
        int secondQuote = jsonBody.indexOf("\"", firstQuote + 1);
        if (firstQuote != -1 && secondQuote != -1) {
          String powerState = jsonBody.substring(firstQuote + 1, secondQuote);
          powerState.trim(); // remove any trailing whitespace
          return powerState;
        }
      }
    }

    return "Unknown";
  } else {
    return "Error";
  }
}


