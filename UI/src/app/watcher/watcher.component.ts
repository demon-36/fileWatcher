import { Component, OnInit } from '@angular/core';
import { WatchService } from '../watch.service';

@Component({
  selector: 'app-watcher',
  templateUrl: './watcher.component.html',
  styleUrls: ['./watcher.component.css']
})
export class WatcherComponent implements OnInit {

  dataArr = [];

  constructor(
    private watchService: WatchService
  ) { }

  ngOnInit(): void {
    this.watchService.getLogData().subscribe((res: any) => {
      res = JSON.parse(res);
      for(let r of res)this.dataArr.push(r);
    });
    this.watchService.socketResponse.subscribe(msg => {
      //console.log(msg);
      this.handle(msg);
    })
  }

  handle(msg){
    this.dataArr.push(msg);
  }

}
