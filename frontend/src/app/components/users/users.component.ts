import { Component, OnInit } from "@angular/core";
import { UsersService } from "src/app/services/users.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.sass"]
})
export class UsersComponent implements OnInit {
  users: [];
  constructor(private userService: UsersService) {}

  ngOnInit() {
    this.userService
      .getAllResources()
      .subscribe((rusers: any) => (this.users = rusers.data as []));
  }
}
