#Introduction
A simple tcp client server written in node

#Reasons for choosing node over python/C
*Node is asynchronous and event based, so every connection is handled as a
function with closure; this makes the application scalable

#Dependencies
Nothing yet - obviously node

#DESIGN
*Every command sent to the server is of the form <TAG>;;parameter1;;parameter2..
*;; has been chosen as the delimiter arbitarily
*Supported tags as of yet are
**<NEWUSER>
**<OLDUSER>
**<SEARCH>
**<UPLOAD>
**<RESULTS>
**<UPLOADED>
**<REGISTERED>
*One can netcat to the server and communicate using the above protocol
