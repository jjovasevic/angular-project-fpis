import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Adresa } from '../klase/adresa';
import { Grad } from '../klase/grad';
import { Ulica } from '../klase/ulica';
import { Zaposleni } from '../klase/zaposleni';
import { Faktura } from '../klaseSlozen/faktura';
import { NacinIsporuke } from '../klaseSlozen/nacin-isporuke';
import { NacinPlacanja } from '../klaseSlozen/nacin-placanja';
import { FakturaInsert } from '../klaseSlozen/new-faktura';
import { StavkaFaktureInsert } from '../klaseSlozen/new-stavka-fakture';
import { Proizvod } from '../klaseSlozen/proizvod';
import { StavkaFakture } from '../klaseSlozen/stavka-fakture';
import { FakturaService } from '../services/faktura.service';
import { CustomValidators } from '../validators/custom-validators';

@Component({
  selector: 'app-faktura-update',
  templateUrl: './faktura-update.component.html',
  styleUrls: ['./faktura-update.component.css']
})
export class FakturaUpdateComponent implements OnInit {

  invoiceForUpdate!: Faktura;
  invoiceItemsForUpdate!: StavkaFakture[];
  stavke!: StavkaFaktureInsert[];

  employees!: Zaposleni[];
  adress!: Adresa[];
  cities!: Grad[];
  streets!: Ulica[];
  paymentMethods!: NacinPlacanja[];
  deliveryMethods!: NacinIsporuke[];
  products!: Proizvod[];
  currency!: String[];

  invoiceFormGroupUpdate!: FormGroup;

  constructor(private fakturaService: FakturaService, private formBuilder: FormBuilder, private router:Router) { }

  ngOnInit(): void {

    this.invoiceForUpdate = this.fakturaService.getInvoiceForIzmena();
    this.invoiceItemsForUpdate = this.fakturaService.getInvoiceItemsForIzmena();

    //forma za unos fakture i stavke fakture
    this.invoiceFormGroupUpdate = this.formBuilder.group({
      invoice: this.formBuilder.group({
        sifraFakture: [this.invoiceForUpdate.sifraFakture],
        datumPrometa: new FormControl(this.invoiceForUpdate.datumPrometa, [Validators.required]),
        valuta: new FormControl(this.invoiceForUpdate.valuta, [Validators.required]),
        nacinPlacanja: new FormControl(this.invoiceForUpdate.nacinPlacanja, [Validators.required]),
        nacinIsporuke: new FormControl(this.invoiceForUpdate.nacinIsporuke, [Validators.required]),
        grad: new FormControl(this.invoiceForUpdate.adresa.ulica.grad, [Validators.required]),
        ulica: new FormControl(this.invoiceForUpdate.adresa.ulica, [Validators.required]),
        adresa: new FormControl(this.invoiceForUpdate.adresa, [Validators.required]),
        zaposleni: new FormControl(this.invoiceForUpdate.zaposleni, [Validators.required])
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

    if (this.invoiceFormGroupUpdate.get('inoviceItem')?.value.kolicina != 0) {
      let s = new StavkaFaktureInsert();

      s.sifraStavke = this.invoiceFormGroupUpdate.get('inoviceItem')?.value.sifraStavke;
      s.opis = this.invoiceFormGroupUpdate.get('inoviceItem')?.value.opis;
      s.ean = this.invoiceFormGroupUpdate.get('inoviceItem')?.value.ean;
      s.sifraProizvoda = this.invoiceFormGroupUpdate.get('inoviceItem')?.value.proizvod.sifraProizvoda;
      s.kolicina = this.invoiceFormGroupUpdate.get('inoviceItem')?.value.kolicina;
      
      //poslati do servica da sacuva stavku
      this.fakturaService.setInvoiceItem(s);

      // stavke koje su sacuvane u operativnoj memoriji
      this.stavke = this.fakturaService.vratiStavkeZaUnos();

      //reset formu
      this.invoiceFormGroupUpdate.get('inoviceItem')?.reset({
        sifraStavke: [''],
        opis: [''],
        ean: [''],
        proizvod: [''],
        kolicina: ['']
      });

    }

  }

  onSubmitUpdateItem(){
    
    if (this.invoiceFormGroupUpdate.get('inoviceItem')?.value.kolicina != 0) {
      let s = new StavkaFaktureInsert();

      s.sifraStavke = this.invoiceFormGroupUpdate.get('inoviceItem')?.value.sifraStavke;
      s.opis = this.invoiceFormGroupUpdate.get('inoviceItem')?.value.opis;
      s.ean = this.invoiceFormGroupUpdate.get('inoviceItem')?.value.ean;
      s.sifraProizvoda = this.invoiceFormGroupUpdate.get('inoviceItem')?.value.proizvod.sifraProizvoda;
      s.kolicina = this.invoiceFormGroupUpdate.get('inoviceItem')?.value.kolicina;
      
      //poslati do servica da sacuva stavku
      this.fakturaService.updateInvoiceItem(s);

      // stavke koje su sacuvane u operativnoj memoriji
      this.stavke = this.fakturaService.vratiStavkeZaUnos();
      this.invoiceItemsForUpdate = this.fakturaService.getInvoiceItemsForIzmena();

      //reset formu
      this.invoiceFormGroupUpdate.get('inoviceItem')?.reset({
        sifraStavke: [''],
        opis: [''],
        ean: [''],
        proizvod: [''],
        kolicina: ['']
      });

    }

  }

  onSubmit() {

    let f = new FakturaInsert();

    f.sifraFakture = this.invoiceFormGroupUpdate.get('invoice')?.value.sifraFakture;
    f.datumPrometa = this.invoiceFormGroupUpdate.get('invoice')?.value.datumPrometa;
    f.valuta = this.invoiceFormGroupUpdate.get('invoice')?.value.valuta;
    f.npID = this.invoiceFormGroupUpdate.get('invoice')?.value.nacinPlacanja.npID;
    f.niID = this.invoiceFormGroupUpdate.get('invoice')?.value.nacinIsporuke.niID;
    f.jmbg = this.invoiceFormGroupUpdate.get('invoice')?.value.zaposleni.jmbg;
    f.postanskiBroj = this.invoiceFormGroupUpdate.get('invoice')?.value.grad.postanski_broj;
    f.sifraUlice = this.invoiceFormGroupUpdate.get('invoice')?.value.ulica.id.sifra_ulice;
    f.adresaID = this.invoiceFormGroupUpdate.get('invoice')?.value.adresa.id.adresa_ID;

    this.fakturaService.putInvoice(f).subscribe({
      next: response => {
        alert(`Faktura je uspesno izmenjena!`);
        this.invoiceFormGroupUpdate.reset();
        //isprazni operativnu memoriju koja sadrzi stavke
        this.fakturaService.isprazni();
        this.router.navigate(['']);
      },
      error: err => {
        alert(`Faktura nije uspesno izmenjena. ${err.message}`);
        this.fakturaService.isprazni();
        this.router.navigate(['']);
      }
    });

  }

  
  onSubmitDeleteItem(){
    
    if (this.invoiceFormGroupUpdate.get('inoviceItem')?.value.sifraStavke != 0) {

      //obrisi iz operativne memorije
      this.fakturaService.deleteInvoiceItemFromMemory(this.invoiceFormGroupUpdate.get('inoviceItem')?.value.sifraStavke);
     
      this.stavke = this.fakturaService.vratiStavkeZaUnos();
      this.invoiceItemsForUpdate = this.fakturaService.getInvoiceItemsForIzmena();

      //obrisi odmah iz baze
      this.fakturaService.deleteInvoiceItem(this.invoiceFormGroupUpdate.get('inoviceItem')?.value.sifraStavke,this.invoiceFormGroupUpdate.get('invoice')?.value.sifraFakture).subscribe();      
      
      this.invoiceFormGroupUpdate.get('inoviceItem')?.reset({
        sifraStavke: [''],
        opis: [''],
        ean: [''],
        proizvod: [''],
        kolicina: ['']
      });

    }

  }

  //gett metode zbog validacije
  get datumPrometa() { return this.invoiceFormGroupUpdate.get('invoice.datumPrometa'); }
  get valuta() { return this.invoiceFormGroupUpdate.get('invoice.valuta'); }
  get nacinPlacanja() { return this.invoiceFormGroupUpdate.get('invoice.nacinPlacanja'); }
  get nacinIsporuke() { return this.invoiceFormGroupUpdate.get('invoice.nacinIsporuke'); }
  get grad() { return this.invoiceFormGroupUpdate.get('invoice.grad'); }
  get ulica() { return this.invoiceFormGroupUpdate.get('invoice.ulica'); }
  get adresa() { return this.invoiceFormGroupUpdate.get('invoice.adresa'); }
  get zaposleni() { return this.invoiceFormGroupUpdate.get('invoice.zaposleni'); }

  get sifraStavke() { return this.invoiceFormGroupUpdate.get('inoviceItem.sifraStavke'); }
  get opis() { return this.invoiceFormGroupUpdate.get('inoviceItem.opis'); }
  get ean() { return this.invoiceFormGroupUpdate.get('inoviceItem.ean'); }
  get proizvod() { return this.invoiceFormGroupUpdate.get('inoviceItem.proizvod'); }
  get kolicina() { return this.invoiceFormGroupUpdate.get('inoviceItem.kolicina'); }



}
