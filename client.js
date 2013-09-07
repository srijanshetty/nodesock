// Include the net module to start TCP connections
var net = require('net');

// Check for the host name and the port number
if(process.argv.length < 4 ){
    process.stdout.write('Insufficient Parameters passed');
    process.exit(1);
}

// Obtain the HOST and PORT from command line arguments
var HOST = process.argv[2]; 
var PORT = parseInt(process.argv[3], 10); 

// Helper functions
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
            stdout.write('It should match: ' + format + '\n');
            ask(question, format, callback);
        }
    });
}

//Function to register
function register(){
    ask('Username:', /[\w\d]{6,}/, function(name) {
        ask('Password:', /[\w\d]{6,}/, function(password) {
            process.stdout.write(name + ' ' + password);    
        });
    });
}

// wait for the connect event
var client = net.connect(PORT, HOST, function () {
    process.stdout.write('\n<CONNECTED to ' + HOST + ':' + PORT +'>');
    process.stdout.write('\nWelcome to Napster Rebooted.\nRegister(R)\nSearch(S)\nUpload(U)');
    ask('\n\nEnter your choice (R/S/U)', /[RSU]/i, function(name) {
        if(name == 'R'){
            register(); 
        }
    });
});
