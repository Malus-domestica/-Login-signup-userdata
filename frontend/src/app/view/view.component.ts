import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from "@angular/router"

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  providers: [DataService]
})
export class ViewComponent implements OnInit {

  info : any;
  id: any;
  constructor(private dservice: DataService, private activatedRoute: ActivatedRoute, private Router: Router) { }
  
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.dservice.getinfoSingleuser(this.id).subscribe((res: any)=>{
      if(res.status == 1)
      {
        this.info = res.user;
        console.log(this.info,"response in view");
      }
    });
  }

}
