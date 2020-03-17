import { Injectable } from "@angular/core";
import { ResourceService } from "./resource.service";
import { HttpClient } from "@angular/common/http";
import { retry, catchError } from "rxjs/operators";
import { API_URL_BASE } from "./../../environments/custom";

const resourceUrl = "attendance";

@Injectable({
  providedIn: "root"
})
export class AttendanceService extends ResourceService {
  constructor(public http: HttpClient) {
    super(http, resourceUrl);
  }

  getStats(userid: string, date: { fromDate: any; toDate: any } | null) {
    const u = userid === "0" ? "all" : userid;
    return this.http
      .get(`${API_URL_BASE}/${resourceUrl}`, {
        params: {
          user: u,
          toDate: date.toDate,
          fromDate: date.fromDate,
          filter: "true"
        }
      })
      .pipe(retry(1), catchError(super.handleError));
  }
}
