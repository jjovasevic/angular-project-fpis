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
      'polje': new FormControl('', [Validators.minLength(3)]),
      'izmena': new FormControl(''),
      'brisanje': new FormControl('')
    })

  }

  onSubmit() {
    console.log(this.searchFormGroup.get('polje')?.value);

    const name = this.searchFormGroup.get('polje')?.value;

    this.kupacService.getCustomersByName(name).subscribe(
      data => {
        this.customers = data;
        if (this.customers.length === 0) {
          alert(`Ne postoje kupci sa nazivom: ` + name);
        }
      }
    );
  }

  onSubmitUpdate() {
    console.log("Pib iz inputa: ", this.searchFormGroup.get('izmena')?.value);

    const pibForUpdateString = this.searchFormGroup.get('izmena')?.value;
    const pibForUpdate = parseInt(pibForUpdateString);

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

  }

  onSubmitDelete() {
    console.log(this.searchFormGroup.get('brisanje')?.value);

    const pibForDeleteString = this.searchFormGroup.get('brisanje')?.value;
    const pibForDelete = parseInt(pibForDeleteString);

    this.kupacService.deleteCustomer(pibForDelete).subscribe({
      next: response => {
        alert(response);
        this.resetFieldDelete();
        //obrisati kupca i iz operativne memorije:
        for(let c = 0; c < this.customers.length; c++){
          if(this.customers[c].pib == pibForDelete){
            this.customers.splice(c,1);
            return;
          }
        } 
      },
      error: err => {
        alert(`Error pri brisanju kupca iz baze.`);
      }

    }
    );
  }
  resetFieldDelete() {
    this.searchFormGroup.get('brisanje')?.setValue("");
  }
  resetFieldUpdate() {
    this.searchFormGroup.get('izmena')?.setValue("");
  }

  //getter metode potrebne zbog validacije
  get polje() { return this.searchFormGroup.get('polje'); }

}
