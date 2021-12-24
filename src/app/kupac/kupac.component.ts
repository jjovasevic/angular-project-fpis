import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Adresa } from '../klase/adresa';
import { Grad } from '../klase/grad';
import { Kupac } from '../klase/kupac';
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
            pib: [''],
            naziv_kupca: [''],
            email_kupca: [''],
            telefon_kupca: [''],
            potpis: [''],
            adresa_ID: [''],
            sifra_ulice: [''],
            postanski_broj: [''],
            jmbg: ['']
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
    const grad = this.customerFormGroup.get('customer')?.value.postanski_broj;

    this.kupacService.getStreets(grad.postanski_broj).subscribe(
      data => {
          this.streets = data;
      }
    )
  }

  getAdress(){
    const ulica = this.customerFormGroup.get('customer')?.value.sifra_ulice;
    console.log(ulica);
    this.kupacService.getAdress(ulica.id.postanski_broj,ulica.id.sifra_ulice).subscribe(
      data => {
          this.adress = data;
      }
    )
  }


  //ubaci kupca u bazu
  onSubmit(){
    console.log(this.customerFormGroup.get('customer')?.value);
    console.log(this.customerFormGroup.get('customer')?.value.naziv_kupca);
    console.log(this.customerFormGroup.get('customer')?.value.jmbg);
  } 
  




}
