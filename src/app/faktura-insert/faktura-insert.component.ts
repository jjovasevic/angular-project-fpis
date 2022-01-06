import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Adresa } from '../klase/adresa';
import { Grad } from '../klase/grad';
import { Ulica } from '../klase/ulica';
import { Zaposleni } from '../klase/zaposleni';
import { NacinIsporuke } from '../klaseSlozen/nacin-isporuke';
import { NacinPlacanja } from '../klaseSlozen/nacin-placanja';
import { FakturaInsert } from '../klaseSlozen/new-faktura';
import { StavkaFaktureInsert } from '../klaseSlozen/new-stavka-fakture';
import { Proizvod } from '../klaseSlozen/proizvod';
import { FakturaService } from '../services/faktura.service';

@Component({
  selector: 'app-faktura-insert',
  templateUrl: './faktura-insert.component.html',
  styleUrls: ['./faktura-insert.component.css']
})
export class FakturaInsertComponent implements OnInit {

  employees!: Zaposleni[];
  adress!: Adresa[];
  cities!: Grad[];
  streets!: Ulica[];
  paymentMethods!: NacinPlacanja[];
  deliveryMethods!: NacinIsporuke[];
  products!: Proizvod[];
  currency!: String[];

  stavke!: StavkaFaktureInsert[];

  invoiceFormGroup!: FormGroup;

  constructor(private fakturaService: FakturaService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    //forma za unos fakture i stavke fakture
    this.invoiceFormGroup = this.formBuilder.group({
      invoice: this.formBuilder.group({
        sifraFakture: ['0'],
        datumPrometa: [''],
        valuta: [''],
        nacinPlacanja: [''],
        nacinIsporuke: [''],
        grad: [''],
        ulica: [''],
        adresa: [''],
        zaposleni: ['']
      }),
      inoviceItem: this.formBuilder.group({
        sifraStavke: [''],
        opis: [''],
        ean: [''],
        proizvod: [''],
        kolicina: ['']
      })
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
    const grad = this.invoiceFormGroup.get('invoice')?.value.grad;

    this.fakturaService.getStreets(grad.postanski_broj).subscribe(
      data => {
        this.streets = data;
      }
    );
  }

  getAdress() {
    const ulica = this.invoiceFormGroup.get('invoice')?.value.ulica;

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

  onSubmitAddItem() {

    if (this.invoiceFormGroup.get('inoviceItem')?.value.kolicina != 0) {
      let s = new StavkaFaktureInsert();

      s.sifraStavke = this.invoiceFormGroup.get('inoviceItem')?.value.sifraStavke;
      s.opis = this.invoiceFormGroup.get('inoviceItem')?.value.opis;
      s.ean = this.invoiceFormGroup.get('inoviceItem')?.value.ean;
      s.sifraProizvoda = this.invoiceFormGroup.get('inoviceItem')?.value.proizvod.sifraProizvoda;
      s.kolicina = this.invoiceFormGroup.get('inoviceItem')?.value.kolicina;

      //reset formu
      
      //poslati do servica da sacuva stavku
      this.fakturaService.setInvoiceItem(s);

      // stavke koje su sacuvane u operativnoj memoriji
      this.stavke = this.fakturaService.vratiStavkeZaUnos();

      

    }

  }

  onSubmit() {

    let f = new FakturaInsert();

    f.sifraFakture = 0;
    f.datumPrometa = this.invoiceFormGroup.get('invoice')?.value.datumPrometa;
    f.valuta = this.invoiceFormGroup.get('invoice')?.value.valuta;
    f.npID = this.invoiceFormGroup.get('invoice')?.value.nacinPlacanja.npID;
    f.niID = this.invoiceFormGroup.get('invoice')?.value.nacinIsporuke.niID;
    f.jmbg = this.invoiceFormGroup.get('invoice')?.value.zaposleni.jmbg;
    f.postanskiBroj = this.invoiceFormGroup.get('invoice')?.value.grad.postanski_broj;
    f.sifraUlice = this.invoiceFormGroup.get('invoice')?.value.ulica.id.sifra_ulice;
    f.adresaID = this.invoiceFormGroup.get('invoice')?.value.adresa.id.adresa_ID;

    this.fakturaService.postInvoice(f).subscribe({
      next: response => {
        alert(`Faktura je uspesno sacuvana!`);
        this.invoiceFormGroup.reset();
        this.fakturaService.isprazni();
      },
      error: err => {
        alert(`Faktura nije uspesno sacuvana. ${err.message}`);
      }
    });
  }


}
