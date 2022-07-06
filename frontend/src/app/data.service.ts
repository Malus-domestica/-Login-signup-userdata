import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  usersignup(signup: any){
    // console.log(signup);
    // this.info = [signup.fname, signup.lname, signup.pno];
    return this.http.post('http://localhost:3000/signup', signup);
  }

  userlogin(login: any){
    return this.http.post('http://localhost:3000/login',login);   
  }
  

  getinfo(id:any){
    return this.http.get(`http://localhost:3000/details/${id}`);  
  }

}
