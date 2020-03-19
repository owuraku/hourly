import { Component, OnInit, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-modalbox",
  templateUrl: "./modalbox.component.html",
  styleUrls: ["./modalbox.component.sass"]
})
export class ModalboxComponent implements OnInit {
  @Input()
  message: string;

  @Input()
  title: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}
}
