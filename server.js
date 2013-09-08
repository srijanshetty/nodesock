// Load the TCP Library
var net = require('net'),
    fs = require('fs'),
    sqlite3 = require('sqlite3').verbose();

// CONSTANTS
var PORT = '8000';

// Create a track of all the connected clients
var clients = {};

// The whole sql processing over here happens in a synchronous fashion because
// we need the server to have the index when it starts.
// Before starting the server, we need to create a database or open it whichever
// might be the case
var datastore = 'database.db';
var datastoreExists = fs.existsSync(datastore);

if(!datastoreExists) {
    process.stdout.write('\nCREATING A NEW DATABASE');
    fs.openSync(datastore, 'w');
}

// Create a database and synchronously get the data
var db = new sqlite3.Database(datastore);
db.serialize(function () {
    if(!datastoreExists) {
        db.run("CREATE TABLE filelist (username TEXT, filename TEXT, filelocation TEXT )");
    }
});

// Start a TCP Server
var server = net.createServer(function (socket) {
        // Identify this client
        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        
        // Echo in the server
        process.stdout.write('\n<CONNECTED ' + socket.name + '>');

        // Handle incoming messages from clients.
        socket.on('data', function (data) {
            var command = data.toString().trim().split(';;');
            processCommand(command);
        });

        // Remove the client from the list when it leaves
        socket.on('end', function () {
            delete clients[socket.username];
            process.stdout.write('\n<DISCONNECTED ' + socket.name + '>');
        });

        // This is the meat of the server, it parses the commands and
        // performs some action and logs it to the screen
        function processCommand(command) {
            switch(command[0]) {
                case '<NEWUSER>': 
                    newuser(command[1],socket);
                    break;
                case '<OLDUSER>': 
                    olduser(command[1],socket);
                    break;
                case '<SEARCH>':
                    search(command[1], socket);
                    break;
                case '<UPLOAD>':
                    upload(command[1], command[2], socket);
                    break;
                case '<BULK_UPLOAD>':
                    bulkUpload(command[1], socket);
                    break;
            }
            // Add more commands here and they should work flawlessly
        }
});

// The server now starts listening on PORT
server.listen(PORT);

// Put a friendly message on the terminal of the server.
process.stdout.write('\nSERVER LISTENING ON PORT ' + PORT + '\n');

// function to handle a newuser
function newuser(username, socket) {
    // Log the command, write to file, add to client and send ACK
    process.stdout.write('\n<NEWUSER ' + socket.name + '> ' + username);
    socket.username = username;
    clients[socket.username] = socket.name;
    socket.write('<REGISTERED>');
}

// function to handle a olduser 
function olduser(username, socket) {
    // Log the command, write to file, add to client and send ACK
    process.stdout.write('\n<OLDUSER ' + socket.name + '> ' + username);
    socket.username = username;
    clients[socket.username] = socket.name;
    socket.write('<CACHED>');
}

// function to search the database and return results
function search(query, socket) {
    // Lookup the database and then send the results
    process.stdout.write('\n<SEARCH ' + socket.name + '> ' + query);
    
    // A asynchronous lookup of the database for the given query, then the list
    // of active users is sent to client
    db.parallelize(function() {
        db.all("SELECT * FROM filelist WHERE filename LIKE '%" + query + "%'", function(err,rows) {
            socket.write('<RESULTS>;;' + JSON.stringify(rows) + ';;' + JSON.stringify(clients)); 
        });
    });
}

// function to write the uploaded file into the database
function upload(filename, filelocation, socket) {
    // Upload this file under the username of the user
    process.stdout.write('\n<UPLOAD ' + socket.name + '> ' + filename + ' ' + filelocation);
    db.parallelize(function() {
        db.run("INSERT INTO filelist VALUES ('" + socket.username + "','" + filename + "','" + filelocation + "')");
        socket.write('<UPLOADED>');
    });
}

// function to bulk upload files to the server
function bulkUpload(list, socket) {
    process.stdout.write('\n<BULK_UPLOAD ' + socket.name + '> ');
    list = JSON.parse(list);
    var listLength = list.length;
    db.parallelize(function() {
        for(var i=0; i<listLength; ++i) {
            db.run("INSERT INTO filelist VALUES ('" + socket.username + "','" + list[i].filename + "','" + list[i].location + "')");
        }
    });
}
