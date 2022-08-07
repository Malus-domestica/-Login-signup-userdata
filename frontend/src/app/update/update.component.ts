import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { DataService } from "../data.service";
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
  providers: [DataService]
})
export class UpdateComponent implements OnInit {
  info: any = {};
  id: any;

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private dservice: DataService, private router: Router) {
    
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if(history.state.user)
    {
      this.info = JSON.parse(history.state.user);//data sent while navigating current url is converted back into js object
      console.log("In update component",this.info);
    }
    else
    {
      Swal.fire(
        {
          title:"Error",
          text:"Select user you want to update",
          icon:"error",
          showCancelButton:true,
          confirmButtonText:"Go to User details page",
          cancelButtonText: "Go to login"
        }
      ).then((result)=>{
        if(result.value) this.router.navigate(['/details']);
        else this.router.navigate(['/login']);
      });
      console.log("In update component, data not found")
    }
  }

  updateData(updateVal: any) {
    console.log("update form data: ",updateVal);
    this.dservice.updateUserInfo(this.id, updateVal).subscribe((result:any)=>{
      if(result.status == 1){
        Swal.fire("Update Successful",'success');
        this.router.navigate(['/details']);
      }
      else
      {
        Swal.fire("Update failed");
      }
    });
   }
}
