import { Component, OnInit } from "@angular/core";
import { AuthService } from "./services/authservice";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService) {}
  ngOnInit(): void {}
}
