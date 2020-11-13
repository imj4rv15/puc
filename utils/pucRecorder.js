var fs = require('fs')
, http = require('http')
, socketio = require('socket.io')
, com = require("serialport");

var WebSocketServer = require('websocket').server;

const axios = require('axios');

// create the server
var wsServer = new WebSocketServer({
httpServer: http.createServer().listen(1337)
});

var serialPort = new com.SerialPort("COM1", {
baudrate: 9600,
dataBits: 8,
parity: 'none',
stopBits: 1,
parser: com.parsers.readline('\r\n')
});

wsServer.on('request', function(request) {

var connection = request.accept(null, request.origin);
serialPort.on('data', function(data) {
        //console.log('Received Message: ' + data);
        fs.writeFile("data.txt", data, function(err) {
            if(err) {
                return console.log(err);
            }
            // assuming data here !!
            data = `10 02 11 11 20 14 37 07 08 20 00 00 00 00 00 00 
            00 00 00 00 00 00 08 7A 02 27 00 00 00 00 00 00 
            87 10 03`;

            const body = {
                "FUEL": "PETROL",
                "CO": 0,
                "HO": 0,
                "CO2": 0,
                "O2": 0,
                "NOx": 0,
                "RPM": 0,
                "PEF": 0,
                "OIL_TEMP": 0,
                "CO_CRTD": 0,
                "LAMBDA": 0,
                "AFR": 0
            }


        });
        connection.sendUTF(data);
});
});
// ******************
// sample posting data using axios
// axios.post('http://localhost:8080/api/v1/puc',{
//     "FUEL": "PETROL",
//     "CO": 0,
//     "HO": 0,
//     "CO2": 0,
//     "O2": 0,
//     "NOx": 0,
//     "RPM": 0,
//     "PEF": 0,
//     "OIL_TEMP": 0,
//     "CO_CRTD": 0,
//     "LAMBDA": 0,
//     "AFR": 0
// })