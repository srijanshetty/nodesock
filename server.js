// Load the TCP Library
var net = require('net'),
    fs = require('fs');

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
            var command = data.toString().trim().split(';;');
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
                case '<NEWUSER>': 
                    process.stdout.write('\n<NEWUSER ' + socket.name + '> ' + command[1]);
                    fs.writeFile('\n' + command[1] + ';;');
                    socket.write('<REGISTERED>');
                    break;
                case '<OLDUSER>': 
                    process.stdout.write('\n<OLDUSER ' + socket.name + '> ' + command[1]);
                    socket.write('<CACHED>');
                    break;
                case '<SEARCH>':
                    // Lookup the database and then send the results
                    process.stdout.write('\n<SEARCH ' + socket.name + '> ' + command[1]);
                    var results = "nothing";
                    socket.write('<RESULTS> ' + results); 
                    break;
                case '<UPLOAD>':
                    // Upload this file under the username of the user
                    process.stdout.write('\n<UPLOAD ' + socket.name + '>' + command[1] + ' ' + command[2]);
                    socket.write('<UPLOADED>');
                    break;
            }
            // Add more commands here and they should work flawlessly
        }
});

// The server now starts listening on PORT
try {
    server.listen(PORT);
} catch(e) {
    process.stdout.write(e.message);
}
// Put a friendly message on the terminal of the server.
console.log('SERVER LISTENING ON PORT ' + PORT + '\n');
