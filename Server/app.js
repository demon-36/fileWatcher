const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http);

const fs = require('fs');
const crypto = require('crypto');
const rf = require('./readFile');

const logFile = './logfile.log'

app.get('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length');
    next();
})

app.get('/', (req, res) => {
    res.status(200).send('Server is up!');
})

app.get('/log', async (req, res) => {
    try{
        let linesArr = await rf.processLineByLine();
        //console.log(linesArr);
        let dataArr = [];
        let l = linesArr.length;
        if (l <= 10) {
            dataArr = JSON.parse(JSON.stringify(linesArr));
        }
        else {
            for (let i = l - 10; i < l; i++) {
                dataArr.push(linesArr[i]);
            }
        }
        res.status(200).send(dataArr);
    }
    catch(err){
        console.log('/log ::', err);
    }
})

// app.get('/log', (req, res) => {
//     try{
//         let dataArr = [];
//         fs.readFile(logFile, 'utf-8', (err, data) => {
//             let linesArr = data.trim().split('\n');
//             let l = linesArr.length;
//             if(l<=10){
//                 dataArr = JSON.parse(JSON.stringify(linesArr));
//             }
//             else{
//                 for(let i=l-10; i<l;i++){
//                     dataArr.push(linesArr[i]);
//                 }
//             }
//             res.status(200).send(dataArr);
//         })
//     }
//     catch(err){
//         console.log('/log ::', err);
//     }
// })

io.on('connection', (socket) => {
    //let roomId = 'pvt room';
    //socket.join(roomId);
    console.log('socket connected');
    //io.sockets.emit('CONNECTION_SUCCESS', 'Connected!');
    socket.emit('CONNECTION_SUCCESS', 'Connected!');

    socket.on('SEND_DATA', () => {
        console.log('got request for data');
        console.log(`getting changes in file - ${logFile}`);

        let previousHash = null;
        let fsWait = false;

        fs.watch(logFile, (event, filename) => {
            if(filename){
                if(fsWait)return;
                fsWait = setTimeout(() => {
                    fsWait = false;
                }, 100);
                fs.readFile(logFile, 'utf-8', (err, data) => {
                    let hash = crypto.createHash('sha1');
                    hash.setEncoding('hex');
                    hash.write(data);
                    hash.end();
                    let currHash = hash.read();
                    if(currHash === previousHash)return;
                    previousHash = currHash;
                    let linesArr = data.trim().split('\n');
                    let l = linesArr.length;
                    let lastLine = linesArr[l-1];
                    socket.emit('DATA_SENT', lastLine);
                    //io.sockets.emit('DATA_SENT', lastLine);
                })
            }
        })
    })
})

io.listen(8000);

http.listen(3000, () => {
    console.log('Server is running at http://127.0.0.1:3000');
})
