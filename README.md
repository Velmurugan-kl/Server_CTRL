
# ESP32 Server and Router Controller with Android TV and WebApp Interface

## Overview

This project enables remote and local control of a server and router using an ESP32 (with W5500 Ethernet module) connected to a local network. The system integrates with Dell iDRAC via Redfish API, an MQTT broker for cloud communication, and provides both a local REST API server and UI applications for user interaction.

## Features

- **ESP32 + W5500 Ethernet**
  - Connects to local network with internet access.
  - Interfaces with Dell iDRAC using Redfish API to control server power and status.
  - Connects to MQTT broker for remote communication and updates.
  - Hosts a local REST server for receiving commands from devices on the same network.
  - Controls server and router via GPIO pins.

- **Android TV Application**
  - User-friendly interface for controlling devices.
  - Communicates with ESP32 through local REST API (only works on same network).
  - Built for seamless interaction via a TV remote or Android TV controller.

- **Web Application**
  - Access and control devices from anywhere using MQTT.
  - Sends commands to ESP32 over the cloud using MQTT topics.
  - Useful when outside the local network.

## Architecture

```
+-------------+        +------------------+         +-----------------+
| Android TV  |<------>| ESP32 (Local API)|<------->| Dell iDRAC (Redfish)
+-------------+        +------------------+         +-----------------+
                           ^         ^
                           |         |
                +----------+         +--------------------+
                |                                      |
           +---------+                        +-------------------+
           | Router  |<--GPIO Control-->      | MQTT Broker (Cloud)|
           +---------+                        +-------------------+
                                                  ^
                                                  |
                                         +----------------+
                                         |     WebApp     |
                                         +----------------+
```

## How it Works

1. **Local Control**
   - The ESP32 runs a REST server.
   - Android TV app sends commands over the local network.
   - ESP32 responds and controls the server/router using GPIO and Redfish API.

2. **Remote Access**
   - WebApp connects to the MQTT broker.
   - ESP32 subscribes to relevant MQTT topics.
   - Commands from the WebApp are received by ESP32 via MQTT and executed.

## Technology Stack

- **Hardware**: ESP32, W5500 Ethernet Module
- **Protocols**: REST, MQTT, Redfish API
- **UI**:
  - Android TV (Java/Kotlin)
  - WebApp (JavaScript/HTML + MQTT.js or similar)
- **Backend (Optional)**:
  - MQTT Broker (e.g., Mosquitto)

## Future Improvements

- Add authentication for REST API and MQTT communication.
- Implement UI feedback (server/router status).
- Add more device control options.
- Support for multiple servers or devices.
