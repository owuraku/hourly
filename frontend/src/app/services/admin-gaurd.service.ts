import { Injectable } from "@angular/core";
import { AuthService } from "./authservice";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate
} from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AdminGaurdService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authService.currentUser;
    if (user.role === "admin") {
      return true;
    }

    this.router.navigate(["/unauthorized"]);
    return false;
  }
}
