import io from 'socket.io-client';
const socket = io(process.env.REACT_APP_TELEMETRY_URL);

socket.on('connect_failed', function() {
    console.warn("Sorry, there seems to be an issue with the connection!");
 })

export function subscribeToTelemetry(callback, deviceID, dataType) {
    socket.on('telemetry', telemetry => {
        callback(null, telemetry[deviceID][dataType])});
}