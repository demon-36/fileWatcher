import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io } from 'socket.io-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchService {

  socket;
  socketResponse;

  constructor(
    private http: HttpClient
  ) {
    this.socketResponse = new Subject();
    this.socket = io("ws://localhost:8000", { transports: ["websocket"] });

    this.socket.on('CONNECTION_SUCCESS', message => {
      console.log(message);
      this.socket.emit('SEND_DATA', );

      this.socket.on('DATA_SENT', message => {
        //console.log(message);
        this.socketResponse.next(message);
      })

    })

  }

  getLogData(){
    return this.http.get('http://127.0.0.1:3000/log', {
      responseType: 'text'
    });
  }
}
