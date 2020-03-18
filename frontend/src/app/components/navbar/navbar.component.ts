import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/authservice";
import { faUser } from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.sass"]
})
export class NavbarComponent implements OnInit {
  faUser = faUser;
  constructor(public authService: AuthService) {}

  ngOnInit() {}
}
