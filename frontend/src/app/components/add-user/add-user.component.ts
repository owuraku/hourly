import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  AbstractControl
} from "@angular/forms";
import { UsersService } from "src/app/services/users.service";
import ValidationErrorMessages from "src/common/validators";
import { AppValidators } from "src/common/app-validators";
import { ModalboxService } from "src/app/modalbox/modalbox.service";

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.sass"]
})
export class AddUserComponent implements OnInit {
  roles = ["Normal", "Admin"];
  userForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private modalService: ModalboxService
  ) {
    this.userForm = fb.group({
      username: [
        "",
        [Validators.required, Validators.minLength(6), Validators.max(50)],
        this.uniqueUsername.bind(this)
      ],
      fullname: [
        "",
        [Validators.required, Validators.minLength(6), Validators.max(50)]
      ],
      role: ["Normal", [Validators.required]],
      passwordConfirm: new FormGroup(
        {
          password: new FormControl("", [
            Validators.required,
            Validators.minLength(6),
            Validators.max(50)
          ]),
          cpassword: new FormControl("", [
            Validators.required,
            Validators.minLength(6),
            Validators.max(50)
          ])
        },
        [AppValidators.areNotEqual]
      )
    });
  }

  ngOnInit() {
    this.modalService.openModal("Test", "It worked");
  }

  get username() {
    return this.userForm.controls.username as FormControl;
  }

  get fullname() {
    return this.userForm.controls.fullname as FormControl;
  }

  get password() {
    return this.userForm.get("passwordConfirm.password") as FormControl;
  }

  get cpassword() {
    return this.userForm.get("passwordConfirm.cpassword") as FormControl;
  }

  get role() {
    return this.userForm.controls.role as FormControl;
  }

  uniqueUsername(control: AbstractControl) {
    return this.userService.verifyUsername(control.value).pipe(res => {
      return res;
    });
  }

  addUser($event) {
    if (this.userForm.valid) {
      const data = this.userForm.value;
      data.password = data.passwordConfirm.password;
      data.confirm_password = data.passwordConfirm.cpassword;
      delete data.passwordConfirm;
      this.userService.addResource(data).subscribe(user => {
        if (user) {
          $event.currentTarget.reset();
          this.userForm.reset();
        }
      });
    }
    console.log(this.userForm);
  }

  getValidationErrorMessage(fc: FormControl) {
    return ValidationErrorMessages.getErrorMessage(fc);
  }
}
