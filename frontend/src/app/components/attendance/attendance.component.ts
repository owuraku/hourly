import { Component, OnInit } from "@angular/core";
import { AttendanceService } from "src/app/services/attendance.service";

@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.sass"]
})
export class AttendanceComponent implements OnInit {
  attendance: [];

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit() {
    this.attendanceService
      .getAllResources()
      .subscribe((attendanceArray: any) => {
        this.attendance = attendanceArray.data;
      });
  }
}
