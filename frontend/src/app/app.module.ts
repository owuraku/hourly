import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtModule, JwtInterceptor } from "@auth0/angular-jwt";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
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
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AddUserComponent } from "./components/add-user/add-user.component";
import { ModalboxComponent } from "./modalbox/modalbox.component";
import { ModalboxService } from "./modalbox/modalbox.service";
import { ToastComponent } from "./toast/toast.component";
import { ResourceService } from "./services/resource.service";
import { FilterComponent } from './filter/filter.component';
// import { JwtInterceptor } from "./services/auth-interceptor.service";

function tokenGetter() {
  return localStorage.getItem("access_token");
}

const jwtConf = {
  config: {
    tokenGetter,
    whitelistedDomains: ["localhost:8000"],
    blacklistedDomains: ["localhost:8000/api/login"]
    // throwNoTokenError: true
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UsersComponent,
    AttendanceComponent,
    NavbarComponent,
    UnauthorizedComponent,
    HomeComponent,
    AddUserComponent,
    ModalboxComponent,
    ToastComponent,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    JwtModule.forRoot(jwtConf)
  ],
  providers: [ResourceService],
  entryComponents: [ModalboxComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
