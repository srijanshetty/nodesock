// Include the net module to start TCP connections
var net = require('net'),
    helper = require('./helper');

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

// Function for the menu
function menu(){
    helper.ask('\n\nEnter your choice (R/S/U)', /[RSU]/i, function(option) {
        if(option === 'R'){
            register(); 
        } else if (option === 'S') {
            search();
        } else if (option === 'U') {
            upload();
        }
    });
}

//Function to register
function register(){
    helper.ask('Username', /[\w\d]{6,}/, function(name) {
        helper.ask('Password', /[\w\d]{6,}/, function(password) {
            client.write('<REGISTER> ' + name + ' ' + password);    
            menu();
        });
    });
}

function search(){
    helper.ask('Search Query', /.+/, function(query){
       client.write('<SEARCH> ' + query);
    });
}
