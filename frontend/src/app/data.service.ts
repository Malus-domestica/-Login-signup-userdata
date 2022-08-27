import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';
import { Router } from "@angular/router"

//const SOCKET_ENDPOINT = 'localhost:3000';
@Injectable({
  providedIn: 'root'
})

export class DataService {
  SOCKET_ENDPOINT = 'localhost:3000';//for chat-app
  socket: any;//for chat-app
  message!: string;//for chat-app

  header:any={};

  constructor(private http: HttpClient, private Router: Router) { }

  usersignup(signup: any){
    // console.log(signup);
    // this.info = [signup.fname, signup.lname, signup.pno];
    return this.http.post('http://localhost:3000/signup', signup);
  }

  userlogin(login: any){
    return this.http.post('http://localhost:3000/login',login);   
  }
  

  getusersinfo(token:any){
    
    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`http://localhost:3000/details`,{headers: httpHeaders});  
  }
  
  deleteUserInfo(id:any){
    return this.http.delete(`http://localhost:3000/delete/${id}`);
  }
  
  getinfoSingleuser(id:any){
    return this.http.get(`http://localhost:3000/view/${id}`);  
  }

  updateUserInfo(id:any, updatedData:any){
    return this.http.put(`http://localhost:3000/update/${id}`,updatedData);
  }

  //for chat-app
  setupSocketConnection(id: any) {
    this.socket = io(this.SOCKET_ENDPOINT);
    
    this.socket.emit('Authenticate', id);

    this.socket.on('Unauthorized-User', (err_msg: any) => {
      Swal.fire(err_msg);
      this.Router.navigate(['/details']);
    });
    this.socket.on('message-broadcast', (data: string) => {
      if (data) {
        const element = document.createElement('li');
        element.innerHTML = data;
        element.style.background = '#fef7f7';
        element.style.padding = '15px 30px';
        element.style.margin = '10px';
        document.getElementById('message-list')?.appendChild(element);
      }
    });
  }

  //for chat-app
  sendMessage(message: any) {
    this.message = message;
    this.socket.emit('message', this.message);
    const element = document.createElement('li');
    element.innerHTML = `You: ${this.message}`;
    element.style.background = '#d7d0d0';
    element.style.padding = '15px 30px';
    element.style.margin = '10px';
    element.style.textAlign = 'right';
    document.getElementById('message-list')?.appendChild(element);

    this.message = '';
  }
}
