#ifndef DISPLAY_H
#define DISPLAY_H

#include <Adafruit_SSD1306.h>


extern Adafruit_SSD1306 display;

void initDisplay();
void showIP();
void showMessage(String msg, int y = 20);
void showCommand(String command);
void showCommandSource(String command,String source);
#endif
