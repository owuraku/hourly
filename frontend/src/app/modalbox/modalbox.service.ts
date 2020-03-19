import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalboxComponent } from "./modalbox.component";

@Injectable({
  providedIn: "root"
})
export class ModalboxService {
  constructor(private modalService: NgbModal) {}

  public openModal(title: string, message: string) {
    const modalRef = this.modalService.open(ModalboxComponent, {
      centered: true
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
  }
}
