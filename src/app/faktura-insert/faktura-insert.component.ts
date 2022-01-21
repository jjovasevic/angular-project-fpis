import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
import { CustomValidators } from '../validators/custom-validators';

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
    private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {

    //forma za unos fakture i stavke fakture
    this.invoiceFormGroup = this.formBuilder.group({
      invoice: this.formBuilder.group({
        sifraFakture: ['0'],
        datumPrometa: new FormControl('', [Validators.required]),
        valuta: new FormControl('', [Validators.required]),
        nacinPlacanja: new FormControl('', [Validators.required]),
        nacinIsporuke: new FormControl('', [Validators.required]),
        grad: new FormControl('', [Validators.required]),
        ulica: new FormControl('', [Validators.required]),
        adresa: new FormControl('', [Validators.required]),
        zaposleni: new FormControl('', [Validators.required])
      }),
      inoviceItem: this.formBuilder.group({
        sifraStavke: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(6),Validators.pattern('[0-9]*'), CustomValidators.whiteSpace]),
        opis: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(40), CustomValidators.whiteSpace]),
        ean: new FormControl('', [Validators.required, Validators.pattern('[0-9]{13}'), CustomValidators.whiteSpace]),
        proizvod: new FormControl('', [Validators.required]),
        kolicina: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(4),Validators.pattern('[0-9]*'), CustomValidators.whiteSpace])
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
    this.invoiceFormGroup.get('invoice.ulica')?.reset();
    this.invoiceFormGroup.get('invoice.adresa')?.reset();
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

    if (this.invoiceFormGroup.get('inoviceItem')?.invalid) {
      this.invoiceFormGroup.get('inoviceItem')?.markAllAsTouched();
      alert(`Ukoliko zelite da unesete novu stavku, morate popuniti sva polja za stavku.`)
    } else {
      if (this.invoiceFormGroup.get('inoviceItem')?.value.kolicina != 0) {
        let s = new StavkaFaktureInsert();

        s.sifraStavke = this.invoiceFormGroup.get('inoviceItem')?.value.sifraStavke;
        s.opis = this.invoiceFormGroup.get('inoviceItem')?.value.opis;
        s.ean = this.invoiceFormGroup.get('inoviceItem')?.value.ean;
        s.sifraProizvoda = this.invoiceFormGroup.get('inoviceItem')?.value.proizvod.sifraProizvoda;
        s.kolicina = this.invoiceFormGroup.get('inoviceItem')?.value.kolicina;

        //poslati do servica da sacuva stavku
        this.fakturaService.setInvoiceItem(s);

        // stavke koje su sacuvane u operativnoj memoriji
        this.stavke = this.fakturaService.vratiStavkeZaUnos();

        //reset formu
        this.invoiceFormGroup.get('inoviceItem')?.reset();

      }
    }

  }

  resetArrayInvoiceItems(){
    this.stavke = [];
    this.fakturaService.resetInvoiceItems();
  }

  onSubmit() {

    if (this.invoiceFormGroup.get('invoice')?.invalid) {
      this.invoiceFormGroup.get('invoice')?.markAllAsTouched();
      alert(`Ukoliko zelite da sacuvate fakturu, morate popuniti sva polja za fakturu.`)
    } else {

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
          //isprazni operativnu memoriju koja sadrzi stavke
          this.fakturaService.isprazni();
          this.router.navigate(['']);
        },
        error: err => {
          alert(`Faktura nije uspesno sacuvana. ${err.message}`);
          this.fakturaService.isprazni();
        }
      });

    }
  }

  //gett metode zbog validacije
  get datumPrometa() { return this.invoiceFormGroup.get('invoice.datumPrometa'); }
  get valuta() { return this.invoiceFormGroup.get('invoice.valuta'); }
  get nacinPlacanja() { return this.invoiceFormGroup.get('invoice.nacinPlacanja'); }
  get nacinIsporuke() { return this.invoiceFormGroup.get('invoice.nacinIsporuke'); }
  get grad() { return this.invoiceFormGroup.get('invoice.grad'); }
  get ulica() { return this.invoiceFormGroup.get('invoice.ulica'); }
  get adresa() { return this.invoiceFormGroup.get('invoice.adresa'); }
  get zaposleni() { return this.invoiceFormGroup.get('invoice.zaposleni'); }

  get sifraStavke() { return this.invoiceFormGroup.get('inoviceItem.sifraStavke'); }
  get opis() { return this.invoiceFormGroup.get('inoviceItem.opis'); }
  get ean() { return this.invoiceFormGroup.get('inoviceItem.ean'); }
  get proizvod() { return this.invoiceFormGroup.get('inoviceItem.proizvod'); }
  get kolicina() { return this.invoiceFormGroup.get('inoviceItem.kolicina'); }

}
