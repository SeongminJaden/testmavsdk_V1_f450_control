# Flask-based PX4 Drone Control Server

This project provides a Flask server integrated with Flask-SocketIO and MAVSDK to control a PX4-based drone, receive telemetry data, and execute missions.

## Requirements

Ensure you have the following dependencies installed before running the script:

### System Requirements
- Python 3.x
- PX4 SITL or a real PX4-based drone
- MAVSDK for Python

### Install Required Python Packages
```bash
pip install flask flask-socketio flask-cors mavsdk eventlet
```

## Usage

Run the following command to start the server:
```bash
python app.py
```

### How It Works
1. The Flask server initializes and starts a SocketIO connection.
2. When a connection request is made, the server attempts to connect to the drone using MAVSDK.
3. The server listens for mission plan data (`plan1` event) via SocketIO.
4. Once the mission data is received, the drone:
   - Arms itself.
   - Takes off.
   - Starts executing the mission waypoints.
5. The server continuously streams GPS position updates to the frontend.

### Features
- Establishes a connection to a PX4 drone over UDP (`udp://:14540`).
- Uses Flask-SocketIO to emit real-time drone position updates.
- Accepts mission waypoint data and executes automated flights.
- Automatically arms, takes off, and flies through the provided waypoints.
- Supports altitude and speed adjustments for the mission.

## API Endpoints
- `GET /` - Serves the main HTML page (`main.html`).
- `SocketIO: 'plan1'` - Receives mission waypoint data and initiates drone flight.

## Notes
- Ensure MAVSDK is installed and running properly.
- The drone should be connected via UDP (`udp://:14540`).
- This script assumes the frontend emits `plan1` events with mission data.
- If using PX4 SITL, start it before running the script.

## License
This project is open-source and available under the MIT License.
