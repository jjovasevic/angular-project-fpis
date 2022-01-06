import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Adresa } from '../klase/adresa';
import { Grad } from '../klase/grad';
import { Kupac } from '../klase/kupac';
import { KupacInsert } from '../klase/kupac-insert';
import { Ulica } from '../klase/ulica';
import { Zaposleni } from '../klase/zaposleni';
import { KupacService } from '../services/kupac.service';

@Component({
  selector: 'app-kupac',
  templateUrl: './kupac.component.html',
  styleUrls: ['./kupac.component.css']
})
export class KupacComponent implements OnInit {

  customers!: Kupac[];
  cities: Grad[] = [];
  streets!: Ulica[];
  employees!: Zaposleni[];
  adress!: Adresa[];

  customerFormGroup!: FormGroup;

  constructor(private kupacService : KupacService,
              private formBuilder: FormBuilder,
              private router: Router ) { }

  ngOnInit(): void {

    //forma za unos novog kupca
     this.customerFormGroup = this.formBuilder.group({
        customer: this.formBuilder.group({
            pib: ['0'],
            naziv_kupca: [''],
            email_kupca: [''],
            telefon_kupca: [''],
            potpis: [''],
            adresa: [''],
            ulica: [''],
            grad: [''],
            zaposleni: ['']
        })
     });

     //vrati kupce iz baze
     this.getCustomers();
     //vrati gradove iz baze
     this.getCities();
     //vrati zaposlene iz baze
     this.getEmployees();

  }
  
  getCustomers(){
    this.kupacService.getCustomers().subscribe(
      data => {
        this.customers = data;
      }
    );
  }

  getCities(){
    this.kupacService.getCities().subscribe(
      data => {
        console.log(data);
          this.cities = data;
      }
    );
  }

  getEmployees(){
    this.kupacService.getEmployees().subscribe(
      data => {
        console.log(data);
          this.employees = data;
      }
    );
  }

  getStreets(){
    const grad = this.customerFormGroup.get('customer')?.value.grad;

    this.kupacService.getStreets(grad.postanski_broj).subscribe(
      data => {
          this.streets = data;
      }
    );
  }

  getAdress(){
    const ulica = this.customerFormGroup.get('customer')?.value.ulica;
    
    this.kupacService.getAdress(ulica.id.postanski_broj,ulica.id.sifra_ulice).subscribe(
      data => {
          this.adress = data;
      }
    );
  }


  //ubaci kupca u bazu
  onSubmit(){
    console.log(this.customerFormGroup.get('customer')?.value);

    let newCustomer = new KupacInsert();
    
    newCustomer.pib = this.customerFormGroup.get('customer')?.value.pib;
    newCustomer.naziv_kupca = this.customerFormGroup.get('customer')?.value.naziv_kupca; 
    newCustomer.email_kupca = this.customerFormGroup.get('customer')?.value.email_kupca;
    newCustomer.telefon_kupca = this.customerFormGroup.get('customer')?.value.telefon_kupca;
    newCustomer.potpis = this.customerFormGroup.get('customer')?.value.potpis;   
    newCustomer.adresa_ID = this.customerFormGroup.get('customer')?.value.adresa.id.adresa_ID;
    newCustomer.sifra_ulice = this.customerFormGroup.get('customer')?.value.ulica.id.sifra_ulice;
    newCustomer.postanski_broj = this.customerFormGroup.get('customer')?.value.grad.postanski_broj;
    newCustomer.jmbg = this.customerFormGroup.get('customer')?.value.zaposleni.jmbg;   

    this.kupacService.postCustomer(newCustomer).subscribe({
        next: response => {
          alert(`Kupac uspesno ubacen u bazu!`);
          this.resetForm();
        },
        error: err => {
          alert(`Kupac nije uspesno sacuvan u bazi. ${err.message}`);
        }
        
      }
    );
  }
  
  resetForm(){
    this.customerFormGroup.reset();
    
  }



}
