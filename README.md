#Introduction
A simple file sharing program written in node

#Usage
1. First run the server node server.js
2. Now, the client has two modes
 * __Interactive mode__: node client.js <hostname> <port>
 * __Bulk Uploader__: node client.js <hostname> <port> <json_file>

#Dependencies
* Node
* sqlite3

#Design Decisions
* __Multiple Clients__: Nodejs has been specifically used because of this
reason, since nodejs handles everything asynchronously in an event loop, it
has the ideal environment for a network application.

* __Multiple Requests__: Each connection to the server serves as a _closure_; in
essence, every connection is handled independent of other clients. Each request
is handled inside this connection object.

* __Database__: _sqlite_ has been used for the database as it does not need
additional installations and only requires a node module. A simple file can
serve as a sqlite database.

* __Filepath__: Filepaths are resolved before sending them to the server,
invalid paths are signalled as an error.

* __P2P__: Every client has a listener at FILEPORT, whenever it recieves a
request to share a file, it sends the entire file to peer asking for it.

* __Command Structure__: \<COMMAND\>;;parameter1;;parameter2..

 * ;; has been chosen as the delimiter arbitarily
 * \<NEWUSER\>
 * \<OLDUSER\>
 * \<SEARCH\>
 * \<UPLOAD\>
 * \<RESULTS\>
 * \<UPLOADED\>
 * \<REGISTERED\>

#Limitations
* All p2p transferred files are written to a single file called recieved. Which
is overwritten every time.
