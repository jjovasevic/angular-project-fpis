import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Adresa } from '../klase/adresa';
import { Grad } from '../klase/grad';
import { Kupac } from '../klase/kupac';
import { KupacInsert } from '../klase/kupac-insert';
import { Ulica } from '../klase/ulica';
import { Zaposleni } from '../klase/zaposleni';
import { KupacService } from '../services/kupac.service';

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
    private formBuilder: FormBuilder) {

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

    //forma za unos novog kupca
    // this.customerUpdateFormGroup = this.formBuilder.group({
    //   customer: this.formBuilder.group({
    //     pib: [this.customer.pib],
    //     naziv_kupca: [this.customer.naziv_kupca],
    //     email_kupca: [this.customer.email_kupca],
    //     telefon_kupca: [this.customer.telefon_kupca],
    //     potpis: [this.customer.potpis],
    //     adresa: [''],
    //     ulica: [''],
    //     grad: [''],
    //     zaposleni: ['']
    //   })
    // });

    this.customerUpdateFormGroup = this.formBuilder.group({
      pib: [this.customer.pib],
      naziv_kupca: [this.customer.naziv_kupca],
      email_kupca: [this.customer.email_kupca],
      telefon_kupca: [this.customer.telefon_kupca],
      potpis: [this.customer.potpis],
      adresa: [this.customer.adresa],
      ulica: [this.customer.adresa.ulica],
      grad: [this.customer.adresa.ulica.grad],
      zaposleni: [this.customer.zaposleni]
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
        },
        error: err => {
          alert(`Kupac nije uspesno izmenjen!. ${err.message}`);
        }

      }
    );
  }

  resetForm() {
    this.customerUpdateFormGroup.reset();

  }






}
