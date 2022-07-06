import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { body } from 'express-validator';
import { DataService } from "../data.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [DataService]
})
export class SignupComponent implements OnInit {

  @ViewChild("err_msg")
  err_msg!: ElementRef;

  constructor( private formBuilder: FormBuilder,private dservice: DataService, private route: Router) { }

  ngOnInit(): void {

  }
  
  signupData(signup: any){
    // console.log(signup);
    this.dservice.usersignup(signup).subscribe((res: any)=>{
      console.log(res);
      if(res.status == 1)
      {
        this.route.navigate(['/login']);
      }
      else if(res.status == 0)
      {
        console.log("signup: acc exists");
        this.err_msg.nativeElement.innerHTML = `${res.message}`;
      }
    });
  }
}
