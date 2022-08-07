import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { ActivatedRoute, Router } from "@angular/router"
import Swal from 'sweetalert2';
import { HttpHeaders, HttpXsrfTokenExtractor } from '@angular/common/http';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [DataService]
})
export class DetailsComponent implements OnInit {

  info: any = {};
  id: any;
  token: any;
  header: any = {};

  constructor(private dservice: DataService, private activatedRoute: ActivatedRoute, private Router: Router) { }

  ngOnInit(): void {

    this.dservice.getusersinfo(localStorage.getItem('token')).subscribe((res: any) => {
      console.log(res);
      if (res.status == 1) {
        this.info = res.user;
        console.log(this.info, "response in details");
      }
      else if(res.status == 401)
      {
        Swal.fire("Unauthorized User")
      }
      else
      {
        Swal.fire({
          title:"Session expired, login again",
          confirmButtonText:"Login"
        }).then((result)=>{
          if(result.value)
          {
            this.Router.navigate(['/login']);
          }
        })
      }
    });
  }



  deleteUser(id: any) {
    console.log("Delete is presses id:", id);

    Swal.fire({
      title: "Do you really want to delete user information?",
      text: "Once deleted, cannot be retrieved",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Keep"
    }).then((result) => {
      if (result.value) {
        this.dservice.deleteUserInfo(id).subscribe((res: any) => {
          if (res.status == 1) {
            // console.log("Deleted");
            Swal.fire("Deleted successfully", "success");
            this.reloadCurrentRoute();
          }
        });
      }
    });
  }
  //to reload page after delete
  reloadCurrentRoute() {
    let currentUrl = this.Router.url;
    this.Router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.Router.navigate([currentUrl]);
    });
  }

  //view user
  viewUser(id: any) {
    this.Router.navigate([`/view`, id]);
  }

  //this function is called when user wants to update data
  updateForm(id: any) {
    var user = this.info.find((eleID: any) => eleID.id === id);
    console.log(user);
    this.Router.navigate([`/update`, id], {
      state: {
        user: JSON.stringify(user)
      }
    });
  }

  chatApp(id: any){
    this.Router.navigate([`/chat-app`, id]);
  }

}
