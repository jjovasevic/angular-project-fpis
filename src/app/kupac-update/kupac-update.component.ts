import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Adresa } from '../klase/adresa';
import { Grad } from '../klase/grad';
import { Kupac } from '../klase/kupac';
import { KupacInsert } from '../klase/kupac-insert';
import { Ulica } from '../klase/ulica';
import { Zaposleni } from '../klase/zaposleni';
import { KupacService } from '../services/kupac.service';
import { CustomValidators } from '../validators/custom-validators';

@Component({
  selector: 'app-kupac-update',
  templateUrl: './kupac-update.component.html',
  styleUrls: ['./kupac-update.component.css']
})
export class KupacUpdateComponent implements OnInit {

  customers!: Kupac[];
  cities: Grad[] = [];
  streets!: Ulica[];
  employees!: Zaposleni[];
  adress!: Adresa[];
  defaultCity!: Grad;

  customer!: Kupac;

  customerUpdateFormGroup!: FormGroup;

  constructor(private kupacService: KupacService,
    private formBuilder: FormBuilder,
    private router: Router) {

  }

  ngOnInit(): void {

    this.customer = this.kupacService.getCustomerForUpdate();
    this.defaultCity = this.customer.adresa.ulica.grad;
    console.log("Customer in update: ", this.customer);

    //vrati kupce iz baze
    this.getCustomers();
    //vrati gradove iz baze
    this.getCities();
    //vrati zaposlene iz baze
    this.getEmployees();

    this.customerUpdateFormGroup = this.formBuilder.group({
      pib: [this.customer.pib],

      naziv_kupca: new FormControl(this.customer.naziv_kupca,[Validators.required, Validators.minLength(6),
        Validators.maxLength(30),Validators.pattern('[a-zA-Z ]*'),CustomValidators.whiteSpace]),

      email_kupca: new FormControl(this.customer.email_kupca,[Validators.required, 
                                        Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}'),Validators.maxLength(20), CustomValidators.whiteSpace]),
      telefon_kupca: new FormControl(this.customer.telefon_kupca,[Validators.required, Validators.minLength(9),Validators.maxLength(20),Validators.pattern('[0-9]*'),CustomValidators.whiteSpace]),
      potpis: new FormControl(this.customer.potpis,[Validators.required, Validators.minLength(2),Validators.maxLength(20),Validators.pattern('[a-zA-Z]*'),CustomValidators.whiteSpace]),
      adresa: new FormControl(this.customer.adresa, [Validators.required]),
      ulica: new FormControl(this.customer.adresa.ulica, [Validators.required]),
      grad: new FormControl(this.customer.adresa.ulica.grad, [Validators.required]),
      zaposleni: new FormControl(this.customer.zaposleni, [Validators.required])
    });
  }
  

  getCustomers() {
    this.kupacService.getCustomers().subscribe(
      data => {
        this.customers = data;
      }
    );
  }

  getCities() {
    this.kupacService.getCities().subscribe(
      data => {
        console.log(data);
        this.cities = data;
      }
    );
  }

  getEmployees() {
    this.kupacService.getEmployees().subscribe(
      data => {
        console.log(data);
        this.employees = data;
      }
    );
  }

  getStreets() {
    console.log("Nas konzol log",this.customerUpdateFormGroup.get('grad')?.value);
    const grad = this.customerUpdateFormGroup.get('grad')?.value;

    this.kupacService.getStreets(grad.postanski_broj).subscribe(
      data => {
        this.streets = data;
      }
    );
   this.customerUpdateFormGroup.controls['ulica'].reset();
   this.customerUpdateFormGroup.controls['adresa'].reset();
  }

  getAdress() {
    const ulica = this.customerUpdateFormGroup.get('ulica')?.value;
    console.log(ulica);
    this.kupacService.getAdress(ulica.id.postanski_broj, ulica.id.sifra_ulice).subscribe(
      data => {
        this.adress = data;
      }
    );
  }


  //izmeni kupca
  onSubmit() {

    //provera da li je forma dobro popunjena
    if(this.customerUpdateFormGroup.invalid){
      this.customerUpdateFormGroup.markAllAsTouched();
      alert(`Popunite sva polja odgovarajucim vrednostima.`)
    }else{
      let newCustomer = new KupacInsert();

      newCustomer.pib = this.customerUpdateFormGroup.get('pib')?.value;
      newCustomer.naziv_kupca = this.customerUpdateFormGroup.get('naziv_kupca')?.value; 
      newCustomer.email_kupca = this.customerUpdateFormGroup.get('email_kupca')?.value;
      newCustomer.telefon_kupca = this.customerUpdateFormGroup.get('telefon_kupca')?.value;
      newCustomer.potpis = this.customerUpdateFormGroup.get('potpis')?.value;   
      newCustomer.adresa_ID = this.customerUpdateFormGroup.get('adresa')?.value.id.adresa_ID;
      newCustomer.sifra_ulice = this.customerUpdateFormGroup.get('ulica')?.value.id.sifra_ulice;
      newCustomer.postanski_broj = this.customerUpdateFormGroup.get('grad')?.value.postanski_broj;
      newCustomer.jmbg = this.customerUpdateFormGroup.get('zaposleni')?.value.jmbg;   
  
      console.log("Moj novi kupac:",newCustomer);
  
      this.kupacService.putCustomer(newCustomer).subscribe({
          next: response => {
            alert(`Kupac je uspesno izmenjen!`);
            this.resetForm();
            this.router.navigate(['/']);
          },
          error: err => {
            alert(`Kupac nije uspesno izmenjen!. ${err.message}`);
          }
  
        }
      );
    }
  }

  resetForm() {
    this.customerUpdateFormGroup.reset();

  }

    //getter metode potrebne zbog validacije
    get naziv_kupca(){ return this.customerUpdateFormGroup.get('naziv_kupca'); }
    get email_kupca(){ return this.customerUpdateFormGroup.get('email_kupca'); }
    get telefon_kupca(){ return this.customerUpdateFormGroup.get('telefon_kupca'); }
    get potpis(){ return this.customerUpdateFormGroup.get('potpis'); }
    get adresa(){ return this.customerUpdateFormGroup.get('adresa'); }
    get ulica(){ return this.customerUpdateFormGroup.get('ulica'); }
    get grad(){ return this.customerUpdateFormGroup.get('grad'); }
    get zaposleni(){ return this.customerUpdateFormGroup.get('zaposleni'); }




}
