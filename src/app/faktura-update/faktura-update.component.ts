import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Adresa } from '../klase/adresa';
import { Grad } from '../klase/grad';
import { Ulica } from '../klase/ulica';
import { Zaposleni } from '../klase/zaposleni';
import { Faktura } from '../klaseSlozen/faktura';
import { NacinIsporuke } from '../klaseSlozen/nacin-isporuke';
import { NacinPlacanja } from '../klaseSlozen/nacin-placanja';
import { Proizvod } from '../klaseSlozen/proizvod';
import { StavkaFakture } from '../klaseSlozen/stavka-fakture';
import { FakturaService } from '../services/faktura.service';

@Component({
  selector: 'app-faktura-update',
  templateUrl: './faktura-update.component.html',
  styleUrls: ['./faktura-update.component.css']
})
export class FakturaUpdateComponent implements OnInit {

  invoiceForUpdate!: Faktura;
  invoiceItemsForUpdate!: StavkaFakture[];

  employees!: Zaposleni[];
  adress!: Adresa[];
  cities!: Grad[];
  streets!: Ulica[];
  paymentMethods!: NacinPlacanja[];
  deliveryMethods!: NacinIsporuke[];
  products!: Proizvod[];
  currency!: String[];

  invoiceFormGroupUpdate!: FormGroup;

  constructor(private fakturaService: FakturaService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.invoiceForUpdate = this.fakturaService.getInvoiceForIzmena();
    this.invoiceItemsForUpdate = this.fakturaService.getInvoiceItemsForIzmena();

    //forma za unos fakture i stavke fakture
    this.invoiceFormGroupUpdate = this.formBuilder.group({
      invoice: this.formBuilder.group({
        sifraFakture: [this.invoiceForUpdate.sifraFakture],
        datumPrometa: [this.invoiceForUpdate.datumPrometa],
        valuta: [this.invoiceForUpdate.valuta],
        nacinPlacanja: [this.invoiceForUpdate.nacinPlacanja],
        nacinIsporuke: [this.invoiceForUpdate.nacinIsporuke],
        grad: [this.invoiceForUpdate.adresa.ulica.grad],
        ulica: [this.invoiceForUpdate.adresa.ulica],
        adresa: [this.invoiceForUpdate.adresa],
        zaposleni: [this.invoiceForUpdate.zaposleni]
      }),
      inoviceItem: this.formBuilder.group({
        sifraStavke: [''],
        opis: [''],
        ean: [''],
        proizvod: [''],
        kolicina: ['']
      }),
      'sifraZaIzmenuStavke': new FormControl()

    });

    //vrati nacine isporuke iz baze
    this.getDeliveryMethods();
    //vrati nacine placanja iz baze
    this.getPaymentMethods();
    //vrati gradove iz baze
    this.getCities();
    //vrati zaposlene iz baze
    this.getEmployees();
    //vrati valute
    this.getCurrency();
    //vrati proizvode iz baze
    this.getProducts();

  }

  getEmployees() {
    this.fakturaService.getEmployees().subscribe(
      data => {
        this.employees = data;
      }
    );
  }

  getCities() {
    this.fakturaService.getCities().subscribe(
      data => {
        this.cities = data;
      }
    );
  }

  getPaymentMethods() {
    this.fakturaService.getPaymentMethods().subscribe(
      data => {
        this.paymentMethods = data;
      }
    );
  }

  getDeliveryMethods() {
    this.fakturaService.getDeliveryMethods().subscribe(
      data => {
        this.deliveryMethods = data;
      }
    );
  }

  getCurrency() {
    this.currency = this.fakturaService.getCurrency();
  }

  getStreets() {
    const grad = this.invoiceFormGroupUpdate.get('invoice')?.value.grad;

    this.fakturaService.getStreets(grad.postanski_broj).subscribe(
      data => {
        this.streets = data;
      }
    );
  }

  getAdress() {
    const ulica = this.invoiceFormGroupUpdate.get('invoice')?.value.ulica;

    this.fakturaService.getAdress(ulica.id.postanski_broj, ulica.id.sifra_ulice).subscribe(
      data => {
        this.adress = data;
      }
    );
  }

  getProducts() {
    this.fakturaService.getProducts().subscribe(
      data => {
        this.products = data;
      }
    );
  }

  onSubmitAddNewItem() {

    // if (this.invoiceFormGroup.get('inoviceItem')?.value.kolicina != 0) {
    //   let s = new StavkaFaktureInsert();

    //   s.sifraStavke = this.invoiceFormGroup.get('inoviceItem')?.value.sifraStavke;
    //   s.opis = this.invoiceFormGroup.get('inoviceItem')?.value.opis;
    //   s.ean = this.invoiceFormGroup.get('inoviceItem')?.value.ean;
    //   s.sifraProizvoda = this.invoiceFormGroup.get('inoviceItem')?.value.proizvod.sifraProizvoda;
    //   s.kolicina = this.invoiceFormGroup.get('inoviceItem')?.value.kolicina;
      
    //   //poslati do servica da sacuva stavku
    //   this.fakturaService.setInvoiceItem(s);

    //   // stavke koje su sacuvane u operativnoj memoriji
    //   this.stavke = this.fakturaService.vratiStavkeZaUnos();

    //   //reset formu
    //   this.invoiceFormGroup.get('inoviceItem')?.reset({
    //     sifraStavke: [''],
    //     opis: [''],
    //     ean: [''],
    //     proizvod: [''],
    //     kolicina: ['']
    //   });

    // }

  }

  onSubmitUpdateItem(){
    
  }

  onSubmit() {

    // let f = new FakturaInsert();

    // f.sifraFakture = 0;
    // f.datumPrometa = this.invoiceFormGroup.get('invoice')?.value.datumPrometa;
    // f.valuta = this.invoiceFormGroup.get('invoice')?.value.valuta;
    // f.npID = this.invoiceFormGroup.get('invoice')?.value.nacinPlacanja.npID;
    // f.niID = this.invoiceFormGroup.get('invoice')?.value.nacinIsporuke.niID;
    // f.jmbg = this.invoiceFormGroup.get('invoice')?.value.zaposleni.jmbg;
    // f.postanskiBroj = this.invoiceFormGroup.get('invoice')?.value.grad.postanski_broj;
    // f.sifraUlice = this.invoiceFormGroup.get('invoice')?.value.ulica.id.sifra_ulice;
    // f.adresaID = this.invoiceFormGroup.get('invoice')?.value.adresa.id.adresa_ID;

    // this.fakturaService.postInvoice(f).subscribe({
    //   next: response => {
    //     alert(`Faktura je uspesno sacuvana!`);
    //     this.invoiceFormGroup.reset();
    //     //isprazni operativnu memoriju koja sadrzi stavke
    //     this.fakturaService.isprazni();
    //     this.router.navigate(['']);
    //   },
    //   error: err => {
    //     alert(`Faktura nije uspesno sacuvana. ${err.message}`);
    //     this.fakturaService.isprazni();
    //   }
    // });
  }







}
