#include "IPAddress.h"
#include "command.h"
#include "display.h"
#include "RedFish.h"  // for sendRedfish() and getRedfish()


#define rou 25
#define PWR 33



void handleCommand(String command, String source) {
  command.trim();
  command.toUpperCase();
  showCommandSource(command,source);
  
  if (command == "NAS_ON") {
    sendRedfish("On");
    // testpinf();
  } 
  else if (command == "NAS_OFF") {
    sendRedfish("GracefulShutdown");
  } 
  else if (command == "ROUTER_ON") {
    digitalWrite(rou, HIGH);
    delay(800);
    digitalWrite(rou, LOW);

  } 
  else if (command == "ROUTER_OFF") {
    digitalWrite(rou, HIGH);
    delay(800);
    digitalWrite(rou, LOW);
    // delay(120000);
    // handleCommand("PWR_OFF","ESPEND");
  } 
  else if (command == "PWR_ON") {
    digitalWrite(PWR, HIGH);
    delay(120000);
    handleCommand("ROUTER_ON", "ESPSTARTUP");
  } 
  else if (command == "PWR_OFF") {
    digitalWrite(PWR, LOW);
  } 
  else {
    display.clearDisplay();
    display.setCursor(0, 20);
    display.println("UNKNOWN COMMAND");
    display.display();
  }
  
}

String handleStatus(String command){
  command.trim();
  command.toUpperCase();
  showCommand(command);

  if (command == "SERVER") {
    unsigned long startTime = millis();
    const unsigned long timeout = 5000; // 3 seconds timeout

    while (millis() - startTime < timeout) {
      String result = getPowerState();
      result.trim();
      result.toLowerCase();
      if (result == "on" || result == "off") {
        return result;
      }
      delay(100); // short pause before checking again
    }

    return "off"; // default if timeout reached
  }
  else if(command == "NAS"){
    IPAddress ip(10, 0, 1, 5);
    if(testpinf(ip)){
      return "up";
    }
    return "down";
  }
  else if(command == "ROUTER"){
    IPAddress ip(10, 0, 1, 1);
    if(testpinf(ip)){
      return "on";
    }
    return "off";
  }
  else if (command == "PWR") {
  return digitalRead(PWR) == HIGH ? "on" : "off";
  }
  else{
    return "null";
  }
  

}

bool testpinf(IPAddress pingClient){
  EthernetClient testClient;
  if (testClient.connect(pingClient,80)) {  // Try port 80 (HTTP)
    Serial.println("Device is online (TCP connect succeeded)");
    testClient.stop();
    return true;
  } else {
    Serial.println("Device is offline (TCP connect failed)");
    return false;
  }
}
