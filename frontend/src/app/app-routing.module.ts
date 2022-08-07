import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DetailsComponent } from './details/details.component';
import { ViewComponent } from './view/view.component';
import { UpdateComponent } from './update/update.component';
import  { ChatAppComponent } from './chat-app/chat-app.component'

const routes: Routes = [
  { path: '', redirectTo:'login' , pathMatch:'full'  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'details', component: DetailsComponent },
  { path: 'view/:id', component: ViewComponent },
  { path: 'update/:id', component: UpdateComponent },
  { path: 'chat-app/:id', component: ChatAppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
