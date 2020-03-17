import { Component, OnInit } from "@angular/core";
import { NgbDateStruct, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {
  model: NgbDateStruct;
  date: { year: number; month: number };

  constructor(private calendar: NgbCalendar) {}

  selectToday() {
    this.model = this.calendar.getToday();
  }

  ngOnInit() {}
}
