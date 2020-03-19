import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { UsersService } from "src/app/services/users.service";
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter
} from "@ng-bootstrap/ng-bootstrap";
import { AttendanceService } from "src/app/services/attendance.service";
import { FilterComponent } from "src/app/filter/filter.component";

interface UserDetails {
  id: number;
  fullname: string;
  username: string;
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html"
})
export class DashboardComponent implements OnInit, AfterViewInit {
  userstats = [];

  @ViewChild(FilterComponent, { read: false, static: false })
  filter: FilterComponent;
  constructor(private attendanceService: AttendanceService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const data = {
      user: { id: 0 },
      date: {
        fromDate: this.filter.returnDateString(this.filter.fromDate),
        toDate: this.filter.returnDateString(this.filter.toDate)
      }
    };
    console.log(data);
    this.updateTable(data);
  }

  updateTable(data) {
    const { date, user } = data;

    this.attendanceService
      .getStats(user.id.toString(), {
        fromDate: date.fromDate,
        toDate: date.toDate
      })
      .subscribe(result => {
        console.log(result);
        this.userstats = (result as any).data;
      });
  }
}
