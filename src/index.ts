import { server as WebSocketServer } from "websocket"; // Correct import
import http from 'http'; // Use ES6 import for consistency

var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});

// Create WebSocket server
const wsServer = new WebSocketServer({
    httpServer: server, // Use the correct server variable
    autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
    // Put logic here to detect whether the specified origin is allowed.
    return true; // Example: allow all origins
}

// Handle WebSocket requests
wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });

    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});