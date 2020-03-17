import { HttpClient } from "@angular/common/http";
import { API_URL_BASE as API } from "./../../environments/custom";
import { retry, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export class ResourceService {
  API_URL_BASE = API;

  constructor(public http: HttpClient, private resourceUrl: string) {}

  handleError(error) {
    if (error.statusCode === 403) {
      alert("You are unauthorized to perform this operation");
    }

    // if (error.statusCode === 403) {
    //   alert("You are unauthorized to perform this operation");
    // }

    return throwError("An error occured");
  }

  getOneResource(resourceId) {
    return this.http
      .get(`${this.API_URL_BASE}/${this.resourceUrl}/${resourceId}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  getAllResources() {
    return this.http
      .get(`${this.API_URL_BASE}/${this.resourceUrl}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  addResource(resource) {
    return this.http
      .post(`${this.API_URL_BASE}/${this.resourceUrl}`, resource)
      .pipe(retry(1), catchError(this.handleError));
  }

  editResource(resource) {
    return this.http
      .put(`${this.API_URL_BASE}/${this.resourceUrl}`, resource)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteResource(resourceId) {
    return this.http
      .delete(`${this.API_URL_BASE}/${this.resourceUrl}`, resourceId)
      .pipe(retry(1), catchError(this.handleError));
  }
}
