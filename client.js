// Check for the host name and the port number
if(process.argv.length < 4 ){
    process.stdout.write('Insufficient Parameters passed');
    process.exit(1);
} 


// Include the net module to start TCP connections
var net = require('net'),
    fs = require('fs');

// Obtain the HOST and PORT from command line arguments
var HOST = process.argv[2].toString(),
    PORT = parseInt(process.argv[3], 10),
    USERNAME;

// modes of working
var FILEUP = 1,
    mode = 0;

// set mode of operation
if(process.argv.length === 5 && fs.existsSync(process.argv[4])){
    mode = FILEUP;
}

// First we create a client object and connect to a server
// This object is then used to write to the server's socket
var client = net.connect(PORT, HOST, function () {
    process.stdout.write('\n<CONNECTED to ' + HOST + ':' + PORT +'>');
    process.stdout.write('\nWelcome to Napster Rebooted.\n\n');
    getUsername();
});

// Whenever the server sends some data, we process the
// command token in the sent data
client.on('data', function(data) {
    var command = data.toString().trim().split(';;');
    processCommand(command);
});

// here we process the command token
function processCommand(command) {
    switch(command[0]) {
        case '<REGISTERED>':
            process.stdout.write('Registered\n');
            if(mode === FILEUP) {
                fileUpload();
            }
            break;
        case '<CACHED>':
            if(mode === FILEUP) {
                fileUpload();
            }
            break;
        case '<RESULTS>': 
            processResults(command[1], command[2]);
            break;
        case '<UPLOADED>':
            process.stdout.write('Upload Succesful\n');
            break;
        case '<BULK_UPLOADED>':
            process.stdout.write('Bulk Upload Succesful\n');
            break;
    }
    // Add more commands over here and they will work
    menu();
}

// provides a menu of the possible commands
function menu(){
    ask('(S)earch (U)pload', /(S|U)/i, function(option) {
        if (option === 'S' | option === 's') {
            search();
        } else if (option === 'U'| option === 'u') {
            upload();
        } else {
            process.stdout.write('[ ERR ] Should Match RegEx /(S|U)/i \n');
            menu();
        }
    });
}

// The username is always pased to the server
function getUsername(){
    // If a configuration file exists, the username is picked from it
    // Else, the user is prompted for his name
    if(fs.existsSync('./config_client')) {
        USERNAME = fs.readFileSync('./config_client', 'utf-8');
        client.write('<OLDUSER>;;' + USERNAME);
    } else {
        ask('Username', /[\w\d]{6,}/, function(name) {
            fs.writeFile('config_client', name);
            USERNAME = name;
            client.write('<NEWUSER>;;' + name);    
        });
    }
    // After writing the data to the server, it has to wait for a result
    // This is handled in the processCommand function
    // in the form of acknowledgmenets
}

// searches the servers database for a particular query
function search(){
    ask('Search Query', /.+/, function(query){
       client.write('<SEARCH>;;' + query);
        // After writing the data to the server, it has to wait for a result
        // This is handled in the processCommand function in the form of 
        // acknowledgments
    });
}

// uploads a file to server
function upload(){
    ask('Filename/Tag', /.+/, function(filename) {
        ask('Absolute Filepath', /.+/, function(filelocation) {
            client.write('<UPLOAD>;;' + filename + ';;' + filelocation);   
        });
    });
}

// processes the results obtained from the user
function processResults(results, users) {
    results = JSON.parse(results);
    users = JSON.parse(users);
    
    // for each user in the users list and results list
    var resLength = results.length;
    for(var i=0; i<resLength; ++i) {
        if(users[results[i].username]){
            process.stdout.write('\nIP:\t\t' + users[results[i].username]);
            process.stdout.write('\nFilename:\t' + results[i].filename);
            process.stdout.write('\nLocation:\t' + results[i].filelocation +'\n\n');
        }
    }
}

// prompts the user with a question also checks regex
function ask(question, format, callback) {
    var stdin = process.stdin, 
        stdout = process.stdout;

    stdin.resume();
    stdout.write('[ ' + question + ' ] ' + '\t>> ');

    stdin.once('data', function(data) {
        data = data.toString().trim();

        if (format.test(data)) {
            callback(data);
        } else {
            stdout.write('[ ERR ] Should Match RegEx ' + format + '\n');
            ask(question, format, callback);
        }
    });
}

// This files looks into the supplied file for files and uploades them to the
// server directly
function fileUpload() {
    var fileList = fs.readFileSync(process.argv[4], 'utf-8');
    client.write('<BULK_UPLOAD>;;' + fileList);   
    // here as well we wait for acknowlegment from the server for bulk upload
}
