import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { ActivatedRoute } from "@angular/router"

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [DataService]
})
export class DetailsComponent implements OnInit {

  info: any ={};
  id: any;

  constructor(private dservice : DataService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    
    this.dservice.getinfo(this.id).subscribe((res: any)=>{
      if(res.status == 1)
      {
        this.info = [res.user];
        console.log(this.info,"response in details");
      }
    });
  }

}
