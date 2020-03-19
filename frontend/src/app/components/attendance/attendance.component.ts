import { Component, OnInit } from "@angular/core";
import { AttendanceService } from "src/app/services/attendance.service";

@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.sass"]
})
export class AttendanceComponent implements OnInit {
  attendance = [];
  collectionSize: number;
  page = 1;
  pageSize = 10;

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit() {
    this.getResults(null);
  }

  getResults(data: any | null) {
    let user = data;
    if (data != null) {
      user = data.user;
      user = user.id === 0 ? null : user.username;
    }
    this.attendanceService
      .getPaginatedResources({
        page: this.page,
        pageSize: this.pageSize,
        search: user
      })
      .subscribe((attendanceArray: any) => {
        this.attendance = attendanceArray.data.data;
        const paginator = attendanceArray.data.pagination;
        this.collectionSize = paginator.rowCount;
        this.page = paginator.page;
        this.pageSize = paginator.pageSize;
      });
  }
}
