#include "rest.h"

void handleClient() {
  EthernetClient client = server.available();
  if (client) {
    String request = "";
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        request += c;
        if (request.endsWith("\r\n\r\n")) break;
      }
    }

    Serial.println("HTTP Request:");
    Serial.println(request);

    if (request.startsWith("POST /control")) {
      // Read POST body
      String postData = "";
      unsigned long timeout = millis();
      while (client.available() || millis() - timeout < 5000) {
        if (client.available()) {
          char c = client.read();
          postData += c;
        }
      }

      Serial.println("POST Body:");
      Serial.println(postData);

      int cmdStart = postData.indexOf("command=") + 8;
      String command = postData.substring(cmdStart);
      handleCommand(command,"REST");

      client.println("HTTP/1.1 200 OK");
      client.println("Content-Type: text/plain");
      client.println("Connection: close");
      client.println();
      client.println("Command executed: " + command);
    } 
    else if(request.indexOf("GET /control?command=") >= 0) {
      int cmdStart = request.indexOf("command=") + 8;
      int cmdEnd = request.indexOf(" ", cmdStart);
      String command = request.substring(cmdStart, cmdEnd);    
      String json = "{\"status\":\""+handleStatus(command)+"\"}";
      client.println("HTTP/1.1 200 OK");
      client.println("Content-Type: application/json");
      client.println("Connection: close");
      client.println();
      client.println(json);
    }
    else {
      client.println("HTTP/1.1 404 Not Found");
      client.println("Content-Type: text/plain");
      client.println("Connection: close");
      client.println();
      client.println("Invalid endpoint");
    }

    client.stop();
  }
}
