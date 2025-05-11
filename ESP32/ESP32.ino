#include <SPI.h>
#include <Ethernet.h>
#include <WiFi.h>

#include <PubSubClient.h>

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>


#include <secrets.h>
#include <RedFish.h>
#include "display.h"
#include "mqtt.h"
#include "rest.h"
#include "globals.h"
#include "command.h"

#define ETH_CS 5  // W5500 CS pin


void setup() {
  Serial.begin(115200);
  //display
  initDisplay();
  pinMode(25, OUTPUT);
  pinMode(33, OUTPUT);
  pinMode(32, INPUT);

  delay(1000);
  btStop();
  WiFi.mode(WIFI_OFF);
  Ethernet.init(ETH_CS);
  server.begin();

  if(Ethernet.begin(mac)==0){
    Serial.println("DHCP failed. Using static IP...");
    Ethernet.begin(mac);
  }
  delay(1000);

  Serial.print("Ethernet IP: ");
  Serial.println(Ethernet.localIP());

  handleCommand("PWR_ON", "ESPSTARTUP");
  // delay(120000);
  // handleCommand("ROUTER_ON", "ESPSTARTUP");
  setupMQTT();
  

  // disp();

}

void loop() {
  if (!mqttClient.connected()) {
    reconnectMQTT(mqttClient);
  }
  mqttClient.loop();
  showIP();
  handleClient();
}





