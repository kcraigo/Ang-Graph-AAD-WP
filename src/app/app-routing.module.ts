import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MsalGuard } from '@azure/msal-angular';
import { ErrorComponent } from './error.component';
import { UserDataComponent } from './components/user-data/user-data.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'userProfile' , component: UserDataComponent, canActivate : [MsalGuard]},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
