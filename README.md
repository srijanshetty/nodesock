#Introduction
A simple tcp client server written in node

#Usage
1. First run the server node server.js
2. Now, the client has two modes
** __Interactive mode__: node client.js <hostname> <port>
** __Bulk Uploader__: node client.js <hostname> <port> <json_file>

#Reasons for choosing node over python/C
* Node is asynchronous and event based, so every connection is handled as a
function with closure; this eliminates use of threads.
* I wanted to try out node

#Dependencies
* Node
* sqlite3

#DESIGN
* Every command sent to the server is of the form <TAG>;;parameter1;;parameter2..
* ;; has been chosen as the delimiter arbitarily
* Supported tags as of yet are
** <NEWUSER>
** <OLDUSER>
** <SEARCH>
** <UPLOAD>
** <RESULTS>
** <UPLOADED>
** <REGISTERED>
* One can netcat to the server and communicate using the above protocol
