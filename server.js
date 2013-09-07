// Load the TCP Library
net = require('net');

//CONSTANTS
var PORT = '5000';

// Create a track of all the connected clients
var clients = [];

// Start a TCP Server
net.createServer(function (socket) {

        // Identify this client
        socket.name = socket.remoteAddress + ":" + socket.remotePort 

        // Put this new client in the list
        clients.push(socket);

        // Send a nice welcome message and announce
        socket.write("Welcome " + socket.name + " to Napster Rebooted. You have the following choices:");
        socket.write('\nRegister: R\nSearch: S\nEnter your choice: ');
        
        // Echo in the server
        process.stdout.write('\n<' + socket.name + ' CONNECTED>');

        // Handle incoming messages from clients.
        socket.on('data', function (data) {
            process.stdout.write('\n<' + socket.name + ' DATA>' + data);
        });

        // Remove the client from the list when it leaves
        socket.on('end', function () {
            clients.splice(clients.indexOf(socket), 1);
            process.stdout.write('\n<' + socket.name + ' DISCONNECTED>');
        });

}).listen(PORT);

// Put a friendly message on the terminal of the server.
console.log('SERVER LISTENING ON PORT ' + PORT + '\n');
