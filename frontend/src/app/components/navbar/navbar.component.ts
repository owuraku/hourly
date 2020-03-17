import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/authservice";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.sass"]
})
export class NavbarComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit() {}
}
