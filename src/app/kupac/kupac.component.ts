import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
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
            naziv_kupca: new FormControl('',[Validators.required, Validators.minLength(6),
                                        Validators.maxLength(30),Validators.pattern('[a-zA-Z ]*'),CustomValidators.whiteSpace]),
            email_kupca: new FormControl('',[Validators.required, 
                                        Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}'),Validators.maxLength(20), CustomValidators.whiteSpace]),
            telefon_kupca: new FormControl('',[Validators.required, Validators.minLength(9),Validators.maxLength(20),Validators.pattern('[0-9]*'),CustomValidators.whiteSpace]),
            potpis: new FormControl('',[Validators.required, Validators.minLength(2),Validators.maxLength(20),Validators.pattern('[a-zA-Z]*'),CustomValidators.whiteSpace]),
            adresa: new FormControl('', [Validators.required]),
            ulica: new FormControl('', [Validators.required]),
            grad: new FormControl('', [Validators.required]),
            zaposleni: new FormControl('', [Validators.required])
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
    this.customerFormGroup.get('customer.ulica')?.reset();
    this.customerFormGroup.get('customer.adresa')?.reset();
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

    if(this.customerFormGroup.invalid){
      this.customerFormGroup.markAllAsTouched();
      alert(`Popunite sva polja odgovarajucim vrednostima.`)
    }else{
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

  }
  
  resetForm(){
    this.customerFormGroup.reset();
    
  }

  //getter metode potrebne zbog validacije
  get naziv_kupca(){ return this.customerFormGroup.get('customer.naziv_kupca'); }
  get email_kupca(){ return this.customerFormGroup.get('customer.email_kupca'); }
  get telefon_kupca(){ return this.customerFormGroup.get('customer.telefon_kupca'); }
  get potpis(){ return this.customerFormGroup.get('customer.potpis'); }
  get adresa(){ return this.customerFormGroup.get('customer.adresa'); }
  get ulica(){ return this.customerFormGroup.get('customer.ulica'); }
  get grad(){ return this.customerFormGroup.get('customer.grad'); }
  get zaposleni(){ return this.customerFormGroup.get('customer.zaposleni'); }


}
