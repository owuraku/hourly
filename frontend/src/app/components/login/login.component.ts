import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/authservice";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.sass"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  invalidLogin = false;
  constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = fb.group({
      username: ["", [Validators.required, Validators.minLength(5)]],
      password: ["", [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() {}

  get username() {
    return this.loginForm.controls.username;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  login(event) {
    this.invalidLogin = false;
    if (this.loginForm.invalid) {
      return false;
    }
    const credentials = this.loginForm.value;
    this.authservice.attemptLogin(credentials).subscribe((result: any) => {
      console.log(result);
      if (result) {
        const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");
        this.router.navigate([returnUrl || "dashboard"]);
      } else {
        this.invalidLogin = true;
        event.target.reset();
        this.loginForm.reset();
      }
    });
  }
}
