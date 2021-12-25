import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Kupac } from '../klase/kupac';
import { KupacService } from '../services/kupac.service';

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
      'polje': new FormControl(),
      'izmena': new FormControl(),
      'brisanje': new FormControl()
    })

  }

  onSubmit(){
    console.log(this.searchFormGroup.get('polje')?.value);
    
    const name = this.searchFormGroup.get('polje')?.value;

    this.kupacService.getCustomersByName(name).subscribe(
      data => {
          this.customers = data;
      }
    );
  }

  onSubmitUpdate(){
    console.log("Pib iz inputa: ", this.searchFormGroup.get('izmena')?.value);

    const pibForUpdateString = this.searchFormGroup.get('izmena')?.value;
    const pibForUpdate = parseInt(pibForUpdateString);

     this.kupacService.getCustomersById(pibForUpdate).subscribe(
      data => {
        console.log("Data from kupacService: ", data);
        this.customer = data;
        //saljem kupca kojeg treba izmeniti
        this.kupacService.setCustomerForUpdate(this.customer);
      }
    );
    
  }

  onSubmitDelete(){
    console.log(this.searchFormGroup.get('brisanje')?.value);
    
    const pibForDeleteString = this.searchFormGroup.get('brisanje')?.value;
    const pibForDelete = parseInt(pibForDeleteString);

    this.kupacService.deleteCustomer(pibForDelete).subscribe({
      next: response => {
        alert(`Kupac je uspesno obrisan iz baze!`);
        this.resetFieldDelete();
      },
      error: err => {
        alert(`Kupac nije uspesno obrisan iz baze. ${err.message}`);
      }
      
    }
  );
  }
  resetFieldDelete() {
    this.searchFormGroup.get('brisanje')?.setValue("");
  }

}
