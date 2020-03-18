import { FormControl } from "@angular/forms";

class ValidationErrorMessages {
  static getErrorMessage(fc: FormControl) {
    if (fc.hasError("required")) {
      return "You must enter a value";
    } else if (fc.hasError("minlength")) {
      return `You need a mininum of ${fc.errors.minlength.requiredLength} characters`;
    } else if (fc.hasError("maxlength")) {
      return `You need a maximum of ${fc.errors.maxlength.requiredLength} characters`;
    } else if (fc.hasError("email")) {
      return "Invalid email entered";
    } else if (fc.hasError("max")) {
      return `Value should not be above ${fc.errors.max.max}`;
    } else if (fc.hasError("min")) {
      return `Value should not be below ${fc.errors.min.min}`;
    } else if (fc.hasError("areNotEqual")) {
      return "Passwords do not match";
    } else if (fc.hasError("unavailable")) {
      return "Sorry username already taken";
    }
  }
}

export default ValidationErrorMessages;
