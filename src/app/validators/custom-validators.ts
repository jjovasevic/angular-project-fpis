import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {

    // generisem pravilo za proveru praznog prostora (white space)
    static whiteSpace(control: FormControl): ValidationErrors {

        //provera da li uneta vrednost sadrzi samo space-ove
        if ((control.value != null) && (control.value === "string") && (control.value.trim().length === 0)) {

            //ne sadrzi nista osim space-a, vracamo error object
            return { 'whiteSpace': true };

        } else {
            //Uneta vrednost je ispravna, vracamo null
            return {};
        }
    }
    


}
