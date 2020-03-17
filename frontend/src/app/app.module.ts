import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { JwtModule } from "@auth0/angular-jwt";
import {
  NgbModule,
  NgbCalendar,
  NgbCalendarGregorian
} from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { UsersComponent } from "./components/users/users.component";
import { AttendanceComponent } from "./components/attendance/attendance.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { UnauthorizedComponent } from "./components/unauthorized/unauthorized.component";
import { HomeComponent } from "./components/home/home.component";

function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UsersComponent,
    AttendanceComponent,
    NavbarComponent,
    UnauthorizedComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter
      }
    })
  ],
  providers: [{ provide: NgbCalendar, useClass: NgbCalendarGregorian }],
  bootstrap: [AppComponent]
})
export class AppModule {}
