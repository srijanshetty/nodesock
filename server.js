// Load the TCP Library
var net = require('net'),
    fs = require('fs');

// CONSTANTS
var PORT = '8000';

// Create a track of all the connected clients
var clients = {};

// Start a TCP Server
var server = net.createServer(function (socket) {
        // Identify this client
        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        
        // Echo in the server
        process.stdout.write('\n<' + socket.name + ' CONNECTED>');

        // Handle incoming messages from clients.
        socket.on('data', function (data) {
            var command = data.toString().trim().split(';;');
            processCommand(command);
        });

        // Remove the client from the list when it leaves
        socket.on('end', function () {
            delete clients[username];
            process.stdout.write('\n<' + socket.name + ' DISCONNECTED>');
        });

        // This is the meat of the server, it parses the commands and
        // performs some action and logs it to the screen
        function processCommand(command) {
            switch(command[0]) {
                case '<NEWUSER>': 
                    // Log the command, write to file, add to client and send ACK
                    process.stdout.write('\n<NEWUSER ' + socket.name + '> ' + command[1]);
                    socket.username = command[1];
                    clients[socket.username] = socket.name;
                    socket.write('<REGISTERED>');
                    break;
                case '<OLDUSER>': 
                    // Log the command, add to client and send ACK
                    process.stdout.write('\n<OLDUSER ' + socket.name + '> ' + command[1]);
                    socket.username = command[1];
                    clients[socket.username] = socket.name;
                    socket.write('<CACHED>');
                    break;
                case '<SEARCH>':
                    search(command[1], socket);
                    break;
                case '<UPLOAD>':
                    upload(command[1], command[2], socket);
                    break;
            }
            // Add more commands here and they should work flawlessly
        }
});

// The server now starts listening on PORT
server.listen(PORT);

// Put a friendly message on the terminal of the server.
console.log('SERVER LISTENING ON PORT ' + PORT + '\n');

// function to search the database and return results
function search(query, socket) {
    // Lookup the database and then send the results
    process.stdout.write('\n<SEARCH ' + socket.name + '> ' + query);
    var results = "nothing";
    socket.write('<RESULTS> ' + results); 
}

// function to write the uploaded file into the database
function upload(filename, filelocation, socket) {
    // Upload this file under the username of the user
    process.stdout.write('\n<UPLOAD ' + socket.name + '> ' + filename + ' ' + filelocation);
    fs.appendFile('filelist', socket.username + ';;' + filename + ';;' + filelocationi +'\n');
    socket.write('<UPLOADED>');
}
