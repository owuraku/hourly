import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { UsersComponent } from "./components/users/users.component";
import { AttendanceComponent } from "./components/attendance/attendance.component";
import { AuthGaurdService } from "./services/auth-gaurd.service";
import { AdminGaurdService } from "./services/admin-gaurd.service";
import { UnauthorizedComponent } from "./components/unauthorized/unauthorized.component";
import { HomeComponent } from "./components/home/home.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "home", component: HomeComponent, canActivate: [AuthGaurdService] },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGaurdService, AdminGaurdService]
  },
  {
    path: "users",
    component: UsersComponent,
    canActivate: [
      AuthGaurdService
      // , AdminGaurdService
    ]
  },
  {
    path: "attendance",
    component: AttendanceComponent,
    canActivate: [
      AuthGaurdService
      //  , AdminGaurdService
    ]
  },
  {
    path: "unauthorized",
    component: UnauthorizedComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
