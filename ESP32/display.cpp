#include "display.h"
#include <Adafruit_GFX.h>
#include <SPI.h>
#include <Ethernet.h>

// Use the same pin definitions
#define OLED_MOSI 23
#define OLED_CLK  18
#define OLED_DC   17
#define OLED_CS   2
#define OLED_RST  16

Adafruit_SSD1306 display(128, 64, &SPI, OLED_DC, OLED_RST, OLED_CS);

void initDisplay() {
  SPI.begin(OLED_CLK, -1, OLED_MOSI, OLED_CS);
  if (!display.begin(SSD1306_SWITCHCAPVCC)) {
    Serial.println("OLED init failed");
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
}

void showIP() {
  IPAddress ip = Ethernet.localIP();
  // display.clearDisplay();
  display.setCursor(0, 0);
  display.print("IP:");
  display.println(ip);
  display.display();
}

void showMessage(String msg, int y) {
  display.clearDisplay();
  display.setCursor(0, y);
  display.println(msg);
  display.display();
}

void showCommand(String command) {
  display.clearDisplay();
  showIP();
  display.setCursor(0, 20);
  display.print(command);
  display.display();
  delay(3000);
  display.clearDisplay();
  showIP();

}
void showCommandSource(String command,String source) {
  display.clearDisplay();
  showIP();
  display.setCursor(0, 20);
  display.println(source);
  display.println(command);
  display.display();
  delay(3000);
  display.clearDisplay();
  showIP();

}
