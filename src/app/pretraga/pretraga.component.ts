import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Kupac } from '../klase/kupac';
import { KupacService } from '../services/kupac.service';
import { CustomValidators } from '../validators/custom-validators';

@Component({
  selector: 'app-pretraga',
  templateUrl: './pretraga.component.html',
  styleUrls: ['./pretraga.component.css']
})
export class PretragaComponent implements OnInit {

  searchFormGroup!: FormGroup;
  customers!: Kupac[];
  customer!: Kupac;

  constructor(private kupacService: KupacService,
    private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {

    this.searchFormGroup = new FormGroup({
      'polje': new FormControl('', [Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]),
      'izmena': new FormControl('', [Validators.pattern('[0-9]*')]),
      'brisanje': new FormControl('', [Validators.pattern('[0-9]*')])
    })

  }

  onSubmit() {
    console.log(this.searchFormGroup.get('polje')?.value);

    const name = this.searchFormGroup.get('polje')?.value;

    if (this.searchFormGroup.get('polje')?.invalid) {
      this.searchFormGroup.markAllAsTouched();
      alert(`Naziv kupca mora biti pravilno unet.`);
    } else {
      this.kupacService.getCustomersByName(name).subscribe(
        data => {
          this.customers = data;
          if (this.customers.length === 0) {
            alert(`Ne postoje kupci sa nazivom: ` + name);
          }
        }
      );
    }
  }

  onSubmitUpdate() {

    if (this.searchFormGroup.get('izmena')?.invalid) {
      this.searchFormGroup.markAllAsTouched();
      alert(`Ukoliko zelite da izmenite kupca sa odredjenim PIB-om, morate pravilno popuniti polje.`);
    } else {

      console.log("Pib iz inputa: ", this.searchFormGroup.get('izmena')?.value);

      const pibForUpdate = this.searchFormGroup.get('izmena')?.value;

      if (pibForUpdate != 0) {
        this.kupacService.getCustomersById(pibForUpdate).subscribe(
          data => {
            console.log("Data from kupacService: ", data);
            this.customer = data;
            if (this.customer === null) {
              this.resetFieldUpdate();
              alert(`Ne postoji kupac sa unetim pib-om: ` + pibForUpdate);

            } else {
              //saljem kupca kojeg treba izmeniti
              this.kupacService.setCustomerForUpdate(this.customer);
            }

          }
        );
      } else {
        alert(`Unesite PIB kupca kojeg zelite da izmenite.`);
      }

    }
  }

  onSubmitDelete() {

    if (this.searchFormGroup.get('brisanje')?.invalid) {
      this.searchFormGroup.markAllAsTouched();
      alert(`Ukoliko zelite da obrisete kupca sa odredjenim PIB-om, morate pravilno popuniti polje.`);
    } else {
      console.log(this.searchFormGroup.get('brisanje')?.value);

      const pibForDelete = this.searchFormGroup.get('brisanje')?.value;

      if (pibForDelete != 0) {
        if (confirm('Da li sigurno zelite da obrisete kupca sa PIB-om: ' + pibForDelete)) {
          this.kupacService.deleteCustomer(pibForDelete).subscribe({
            next: response => {
              alert(response);
              this.resetFieldDelete();
              //obrisati kupca i iz operativne memorije ukoliko je uspesno obrisan i iz baze:
              if (response != "Kupac nije obrisan jer ne postoji u bazi.") {
                for (let c = 0; c < this.customers.length; c++) {
                  if (this.customers[c].pib == pibForDelete) {
                    this.customers.splice(c, 1);
                    return;
                  }
                }
              }

            },
            error: err => {
              alert(`Error pri brisanju kupca iz baze.`);
            }

          }
          );
        } else {
          //ne redi nista, ipak ne zeli obrisati kupca iz baze.
        }
      } else {
        alert(`Unesite PIB kupca kojeg zelite da obrisete.`);
      }
    }
  }

  resetFieldDelete() {
    this.searchFormGroup.get('brisanje')?.setValue("");
  }
  resetFieldUpdate() {
    this.searchFormGroup.get('izmena')?.setValue("");
  }

  //getter metode potrebne zbog validacije
  get polje() { return this.searchFormGroup.get('polje'); }
  get izmena() { return this.searchFormGroup.get('izmena'); }
  get brisanje() { return this.searchFormGroup.get('brisanje'); }



}
