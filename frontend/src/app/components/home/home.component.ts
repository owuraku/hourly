import { Component, OnInit } from "@angular/core";
import { NgbDateStruct, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";
import { AttendanceService } from "src/app/services/attendance.service";

interface NgbTime {
  hour: number;
  minute: number;
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {
  model: NgbDateStruct;
  date: { year: number; month: number };
  today = this.calendar.getToday();
  clockin = { hour: 8, minute: 0 };
  clockout = { hour: 17, minute: 0 };
  project = "Normal";
  invalidForm = false;
  constructor(
    private calendar: NgbCalendar,
    private attendanceService: AttendanceService
  ) {}

  selectToday() {
    this.model = this.today;
  }

  ngOnInit() {
    this.selectToday();
  }

  clockoutChange(co: NgbTime) {
    if (
      co.hour < this.clockin.hour ||
      (co.hour === this.clockin.hour && co.minute <= this.clockin.minute)
    ) {
      this.invalidForm = true;
    } else {
      this.invalidForm = false;
    }
  }

  clockinChange(ci: NgbTime) {
    if (
      ci.hour > this.clockout.hour ||
      (ci.hour === this.clockout.hour && ci.minute >= this.clockout.minute)
    ) {
      this.invalidForm = true;
    } else {
      this.invalidForm = false;
    }
  }

  projectChange(val: string) {
    console.log(val);
    this.invalidForm = val === "" ? true : false;
  }

  returnTime(time: NgbTime) {
    return `${
      time.hour.toString().length === 1 ? "0" + time.hour : time.hour
    }:${time.minute.toString().length === 1 ? "0" + time.minute : time.minute}`;
  }

  submitAttendance() {
    if (this.invalidForm) {
      return false;
    }
    const attendance = {
      date: `${this.model.year}-${this.model.month}-${this.model.day}`,
      clockin: this.returnTime(this.clockin),
      clockout: this.returnTime(this.clockout),
      project: this.project
    };

    this.attendanceService.addResource(attendance).subscribe(result => {
      alert("done");
    });
  }
}
