// Load the TCP Library
net = require('net');

// CONSTANTS
var PORT = '8000';

// Create a track of all the connected clients
var clients = [];

// Start a TCP Server
var server = net.createServer(function (socket) {
        // Identify this client
        socket.name = socket.remoteAddress + ":" + socket.remotePort;

        // Put this new client in the list
        clients.push(socket);

        // Echo in the server
        process.stdout.write('\n<' + socket.name + ' CONNECTED>');

        // Handle incoming messages from clients.
        socket.on('data', function (data) {
            var command = data.toString().trim().split(' ');
            process.stdout.write('\n<' + socket.name + ' DATA> ' + command[0]);
            processCommand(command);
        });

        // Remove the client from the list when it leaves
        socket.on('end', function () {
            clients.splice(clients.indexOf(socket), 1);
            process.stdout.write('\n<' + socket.name + ' DISCONNECTED>');
        });

        // Function to process the command
        function processCommand(command) {
            switch(command[0]) {
                case '<REGISTER>': 
                    process.stdout.write('Registering User ' + command[1]);
                    // Send an acknowledgment
                    break;
                case '<SEARCH>':
                    // Lookup the database and then send the results
                    process.stdout.write('reu');
                    socket.write('<RESULTS> something'); 
                    break;
            }
            // Add more commands here and they should work flawlessly
        }
});

// The server now starts listening on PORT
server.listen(PORT);

// Put a friendly message on the terminal of the server.
console.log('SERVER LISTENING ON PORT ' + PORT + '\n');
