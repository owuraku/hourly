import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter
} from "@ng-bootstrap/ng-bootstrap";
import { UsersService } from "../services/users.service";
import { Observable, of } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  tap,
  switchMap,
  catchError
} from "rxjs/operators";

interface UserDetails {
  fullname: string;
  id: number;
  username: string;
}

@Component({
  selector: "app-filter",
  templateUrl: "./filter.component.html",
  styles: [
    `
      input[name="datepicker"] {
        visibility: hidden;
      }

      .form-group.hidden {
        width: 0;
        margin: 0;
        border: none;
        padding: 0;
      }

      .custom-day {
        text-align: center;
        padding: 0.185rem 0.25rem;
        display: inline-block;
        height: 2rem;
        width: 2rem;
      }
      .custom-day.focused {
        background-color: #e6e6e6;
      }
      .custom-day.range,
      .custom-day:hover {
        background-color: rgb(2, 117, 216);
        color: white;
      }
      .custom-day.faded {
        background-color: rgba(2, 117, 216, 0.5);
      }
    `
  ]
})
export class FilterComponent implements OnInit {
  @Input()
  showUser = true;

  @Input()
  showDate = true;

  @Output()
  filterUpdate = new EventEmitter();

  faCalendar = faCalendar;
  userModel: UserDetails = { fullname: "", id: 0, username: "All" };
  users: UserDetails[];
  searching = false;
  searchFailed = false;
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  constructor(
    private userService: UsersService,
    private calendar: NgbCalendar,
    public formatterDate: NgbDateParserFormatter
  ) {
    this.toDate = this.calendar.getToday();
    this.fromDate = this.calendar.getPrev(calendar.getToday(), "d", 20);
  }

  ngOnInit() {}

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      date.equals(this.toDate) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  formatter = (userDetails: UserDetails) => userDetails.username;

  validateInput(currentValue: NgbDate, input: string): NgbDate {
    const parsed = this.formatterDate.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  returnDateString(date: NgbDate) {
    return `${date.year}-${date.month}-${date.day}`;
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this.userService.findUser(term).pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );

  emitClick() {
    const data = { date: {}, user: {} };
    if (this.userModel == null) {
      this.userModel = { fullname: "All", id: 0, username: "All" };
    }

    if (this.showDate) {
      data.date = {
        fromDate: this.returnDateString(this.fromDate),
        toDate: this.returnDateString(this.toDate)
      };
    }
    if (this.showUser) {
      data.user = this.userModel;
    }
    this.filterUpdate.emit(data);
  }
}
