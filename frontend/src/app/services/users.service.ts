import { Injectable, Injector } from "@angular/core";
import { ResourceService } from "./resource.service";
import { HttpClient } from "@angular/common/http";
import { API_URL_BASE } from "./../../environments/custom";
import { retry, catchError, map } from "rxjs/operators";
import { of } from "rxjs";
import { ModalboxService } from "../modalbox/modalbox.service";
const resourceUrl = "users";

@Injectable({
  providedIn: "root"
})
export class UsersService extends ResourceService {
  constructor(
    http: HttpClient,
    private thisHttp: HttpClient,
    ms: ModalboxService
  ) {
    super(http, resourceUrl, ms);
  }

  findUser(username: string) {
    if (username === "") {
      return of([]);
    }

    return this.thisHttp
      .get(`${API_URL_BASE}/${resourceUrl}`, {
        params: { search: "true", username }
      })
      .pipe(
        retry(1),
        map((val: any) => val.data),
        catchError(super.handleError)
      );
  }

  verifyUsername(username: string) {
    return this.thisHttp
      .get(`${API_URL_BASE}/${resourceUrl}`, {
        params: { verify: "true", username }
      })
      .pipe(
        retry(1),
        map(
          (val: any) =>
            (val = val.data.available ? null : { unavailable: true })
        ),
        catchError(() => of({ unavailable: true }))
      );
  }
}
