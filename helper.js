// Function to ask questions 
exports.ask = function ask(question, format, callback) {
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
