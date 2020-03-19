import { HttpClient } from "@angular/common/http";
import { API_URL_BASE as API } from "./../../environments/custom";
import { retry, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { ModalboxService } from "../modalbox/modalbox.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Injectable } from "@angular/core";

@Injectable()
export class ResourceService {
  API_URL_BASE = API;

  constructor(
    public http: HttpClient,
    private resourceUrl: string,
    public modalService: ModalboxService
  ) {}

  handleError(error) {
    this.modalService.openModal("sa", "oda");
    if (error.status === 403) {
      this.modalService.openModal(
        "Unauthorized Access",
        "You are unauthorized to perform this operation"
      );
    } else if (error.status === 401) {
      this.modalService.openModal(
        "Unauthenticated User",
        "You are not authenticated. Please log in"
      );
    } else if (error.status === 422) {
      this.modalService.openModal("Validation Error", error.error.message);
    } else {
      this.modalService.openModal(
        "Unexpected Error",
        "Please try again later or contact administrator"
      );
    }

    // if (error.statusCode === 403) {
    //   alert("You are unauthorized to perform this operation");
    // }

    return of("An error occured");
  }

  getOneResource(resourceId) {
    return this.http
      .get(`${this.API_URL_BASE}/${this.resourceUrl}/${resourceId}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  getPaginatedResources(paginator: {
    page: number;
    pageSize: number;
    search: string;
  }) {
    return this.http
      .get(`${this.API_URL_BASE}/${this.resourceUrl}`, {
        params: {
          search: paginator.search || "false",
          paginate: "true",
          page: paginator.page.toString() || "1",
          pageSize: paginator.pageSize.toString() || "15"
        }
      })
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
