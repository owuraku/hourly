import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { of, Observable, throwError } from "rxjs";
import { retry, map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";

const api = "http://localhost:8000";

interface ResponseStructure {
  success: boolean;
  code: number;
  data: any | null;
  error: object | null;
  message: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private jwt: JwtHelperService,
    private router: Router
  ) {}

  private _login(credentials: { username: string; password: string }) {
    return this.http.post(`${api}/api/login`, credentials);
  }

  attemptLogin(credentials: { username: string; password: string }) {
    return this._login(credentials).pipe(
      retry(2),
      catchError(err => {
        return throwError(err);
      }),
      map((response: ResponseStructure) => {
        if (response.success) {
          localStorage.setItem("access_token", response.data.accessToken);
          localStorage.setItem("refresh_token", response.data.refreshToken);
        }
        return response.success;
      })
    );
  }

  get currentUser() {
    return this.jwt.decodeToken();
  }

  isLoggedIn() {
    return !this.jwt.isTokenExpired();
  }

  isAdmin(): boolean {
    if (!this.currentUser) {
      return false;
    }

    return (this.currentUser.role as string).toLowerCase().includes("admin");
  }

  logout() {
    localStorage.removeItem("access_token");
    this.http.post().subscribe(result => {});
    this.router.navigate(["/"]);
  }
}
