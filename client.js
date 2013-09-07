// Include the net module to start TCP connections
var net = require('net');

// Check for the host name and the port number
if(process.argv.length < 4 ){
    process.stdout.write('Insufficient Parameters passed');
    process.exit(1);
}

// Obtain the HOST and PORT from command line arguments
var HOST = process.argv[2].toString(); 
var PORT = parseInt(process.argv[3], 10); 

// Wait for the connect event
var client = net.connect(PORT, HOST, function () {
    process.stdout.write('\n<CONNECTED to ' + HOST + ':' + PORT +'>');
    process.stdout.write('\nWelcome to Napster Rebooted.\nRegister(R)\nSearch(S)\nUpload(U)');
    menu();
});

// Listen for data
client.on('data', function(data) {
    var command = data.toString().trim().split(' ');
    processCommand(command);
});

// Function to process the command
function processCommand(command) {
    switch(command[0]) {
        case '<RESULTS>': 
            process.stdout.write('Results');
            break;
    }
    // Add more commands over here and they will work
}

// Function for the menu
function menu(){
    ask('\n\nEnter your choice (R/S/U)', /[RSU]/i, function(option) {
        if(option === 'R'){
            register(); 
        } else if (option === 'S') {
            search();
        } else if (option === 'U') {
            upload();
        }
    });
}

// Function to register
function register(){
    ask('Username', /[\w\d]{6,}/, function(name) {
        ask('Password', /[\w\d]{6,}/, function(password) {
            client.write('<REGISTER> ' + name + ' ' + password);    
            // After writing the data to the server, it has to wait for a result
            // This is handled in the processCommand function
            // in the form of acknowledgmenets
        });
    });
}

// Search the database
function search(){
    ask('Search Query', /.+/, function(query){
       client.write('<SEARCH> ' + query);
        // After writing the data to the server, it has to wait for a result
        // This is handled in the processCommand function in the form of 
        // acknowledgments
    });
}

// Function to ask questions 
function ask(question, format, callback) {
    var stdin = process.stdin, 
        stdout = process.stdout;

    stdin.resume();
    stdout.write(question + ': ');

    stdin.once('data', function(data) {
        data = data.toString().trim();

        if (format.test(data)) {
            callback(data);
        } else {
            stdout.write('Should Match RegEx ' + format + '\n');
            ask(question, format, callback);
        }
    });
}
