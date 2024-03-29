import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from "../data.service";
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [DataService]
})
export class LoginComponent implements OnInit {

  user: string[] = [];
  error: any;
  headers:any;
  @ViewChild('err_msg')err_msg!: ElementRef;

  constructor(private dservice: DataService, private route: Router) {

  }

  ngOnInit(): void {
  }
  loginData(login: any) {
    this.dservice.userlogin(login).subscribe((res: any) => {
      if (res.status == 0) {
        this.err_msg.nativeElement.innerHTML = `${res.message}`;
      }
      if (res.status == 1) {
        localStorage.setItem('token',res.token);
        // this.route.navigate([`/details`, res.id]);
        this.route.navigate([`/details`])
      }
    });
  }
}