import { Injectable, Injector } from "@angular/core";
import { ResourceService } from "./resource.service";
import { HttpClient } from "@angular/common/http";
import { retry, catchError } from "rxjs/operators";
import { API_URL_BASE } from "./../../environments/custom";
import { ModalboxService } from "../modalbox/modalbox.service";

const resourceUrl = "attendance";

@Injectable({
  providedIn: "root"
})
export class AttendanceService extends ResourceService {
  constructor(public http: HttpClient, ms: ModalboxService) {
    super(http, resourceUrl, ms);
  }

  getStats(userid: string, date: { fromDate: string; toDate: string } | null) {
    const u = userid === "0" ? "all" : userid;
    return this.http
      .get(`${API_URL_BASE}/${resourceUrl}`, {
        params: {
          user: u,
          fromDate: date.fromDate,
          toDate: date.toDate,
          filter: "true"
        }
      })
      .pipe(retry(1), catchError(super.handleError));
  }
}
