import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { ActivatedRoute } from "@angular/router"


@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.css'],
  providers: [DataService]
})
export class ChatAppComponent implements OnInit {
  id:any;
  message: string | undefined;
  
  constructor(private dservice: DataService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.dservice.setupSocketConnection(this.id);
  }
  
  toSendMessage()
  {
    this.dservice.sendMessage(this.message);
  }

}
