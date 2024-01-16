from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_cors import CORS
from mavsdk import System, telemetry, mission
import asyncio
import eventlet

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

async def px4_connect_drone():
    drone = System()
    await drone.connect(system_address="udp://:14540")
    print("Waiting for drone to connect...")


    asyncio.ensure_future(send_drone_position(drone))

    async for state in drone.core.connection_state():
        if state.is_connected:
            print("-- Connected to drone!")
            return drone

async def send_drone_position(drone):
    while True:
        async for position in drone.telemetry.position():
            socketio.emit('drone_position', {'latitude': position.latitude_deg, 'longitude': position.longitude_deg})
            await asyncio.sleep(1)

async def fly_mission(drone, waypoints):
    mission_items = []

    for i, (lat, lon, alt) in enumerate(waypoints):
        mission_items.append(mission.MissionItem(
            latitude_deg=lat,
            longitude_deg=lon,
            relative_altitude_m=alt,
            speed_m_s=5,  # Adjust the speed as needed
            is_fly_through=True,
            gimbal_pitch_deg=20,  # Adjust gimbal pitch as needed
            gimbal_yaw_deg=0,  # Adjust gimbal yaw as needed
            camera_action=mission.MissionItem.CameraAction.NONE,  # Corrected attribute
            loiter_time_s=3,  # Adjust as needed
            camera_photo_interval_s=5,  # Adjust as needed
            acceptance_radius_m=2,  # Adjust as needed
            yaw_deg=0,  # Adjust as needed
            camera_photo_distance_m=10  # Adjust as needed
        ))

    mission_plan = mission.MissionPlan(mission_items)
    await drone.mission.set_return_to_launch_after_mission(True)

    print("-- Uploading mission")
    await drone.mission.upload_mission(mission_plan)
    print("-- Mission uploaded")

    await drone.action.arm()

    # Extract the altitude from the first waypoint
    first_waypoint = waypoints[0]
    first_altitude = first_waypoint[2]

    print("-- Arming")
    await drone.action.arm()

    print("-- Taking off")
    await drone.action.set_takeoff_altitude(first_altitude)
    await drone.action.takeoff()

    print("-- Starting mission")
    await drone.mission.start_mission()
    print("-- Mission started")

    async for position in drone.telemetry.position():
        print(f"GPS lat: {position.latitude_deg} lon : {position.longitude_deg}")
        socketio.emit('drone_position', {'latitude': position.latitude_deg, 'longitude': position.longitude_deg})
        await asyncio.sleep(1)

def run_mavsdk(data):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(main(data))

async def main(data):
    drone = await px4_connect_drone()

    waypoints = data['markers']
    await fly_mission(drone, waypoints)
    
@app.route('/')
def index():
    return render_template('main.html')

@socketio.on('plan1')
def handle_plan1(data):
    print('Received plan1 data:', data)
    eventlet.spawn(run_mavsdk, data)

if __name__ == '__main__':
    socketio.run(app, debug=True)
