import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Adresa } from '../klase/adresa';
import { Grad } from '../klase/grad';
import { Ulica } from '../klase/ulica';
import { Zaposleni } from '../klase/zaposleni';
import { Faktura } from '../klaseSlozen/faktura';
import { InsertObjekat } from '../klaseSlozen/insert-objekat';
import { NacinIsporuke } from '../klaseSlozen/nacin-isporuke';
import { NacinPlacanja } from '../klaseSlozen/nacin-placanja';
import { FakturaInsert } from '../klaseSlozen/new-faktura';
import { StavkaFaktureInsert } from '../klaseSlozen/new-stavka-fakture';
import { Proizvod } from '../klaseSlozen/proizvod';
import { StavkaFakture } from '../klaseSlozen/stavka-fakture';

@Injectable({
  providedIn: 'root'
})
export class FakturaService {

  private cityUrl = 'http://localhost:8080/grad';
  private streetUrl = 'http://localhost:8080/ulica';
  private adressUrl = 'http://localhost:8080/adresa';
  private employeesUrl = 'http://localhost:8080/zaposleni';
  private paymentMethodsUrl = "http://localhost:8080/nacinPlacanja";
  private deliveryMethodsUrl = "http://localhost:8080/nacinIsporuke";
  private productUrl = 'http://localhost:8080/proizvod';
  private invoiceUrl = 'http://localhost:8080/faktura';
  private invoiceItemUrl = 'http://localhost:8080/stavka';

  private currency: String[] = ["FKP", "FRF", "EUR", "DIN", "HKD", "IDR", "MKD", "NOK", "NLG", "PGK", "RUB", "USD"];

  stavkeZaUnos: StavkaFaktureInsert[] = [];
  invoiceForShow!: Faktura;
  invoiceItemForShow!: StavkaFakture[];
  invoiceForUpdate!: Faktura;
  invoiceItemsForUpdate!: StavkaFakture[];

  constructor(private httpClient: HttpClient, private router: Router) { }

  getCities(): Observable<Grad[]> {
    return this.httpClient.get<Grad[]>(this.cityUrl);
  }

  getEmployees(): Observable<Zaposleni[]> {
    return this.httpClient.get<Zaposleni[]>(this.employeesUrl);
  }

  getStreets(postalCode: number): Observable<Ulica[]> {
    const searchStreetUrl = `${this.streetUrl}/${postalCode}`;
    return this.httpClient.get<Ulica[]>(searchStreetUrl);
  }

  getAdress(post_broj: number, sif_ulice: String): Observable<Adresa[]> {
    const searchAdressUrl = `${this.adressUrl}/${post_broj}/${sif_ulice}`;
    return this.httpClient.get<Adresa[]>(searchAdressUrl);
  }

  getPaymentMethods(): Observable<NacinPlacanja[]> {
    return this.httpClient.get<NacinPlacanja[]>(this.paymentMethodsUrl);
  }

  getDeliveryMethods(): Observable<NacinIsporuke[]> {
    return this.httpClient.get<NacinIsporuke[]>(this.deliveryMethodsUrl);
  }

  getProducts(): Observable<Proizvod[]> {
    return this.httpClient.get<Proizvod[]>(this.productUrl);
  }

  getCurrency(): String[] {
    return this.currency;
  }

  //unesi stavku fakture u niz stavki
  setInvoiceItem(data: any) {
    this.stavkeZaUnos.push(data);
  }

  // post za fakturu
  postInvoice(fakturatIns: FakturaInsert): Observable<any> {

    let insertObject = new InsertObjekat();
    insertObject.fakturaInsert = fakturatIns;
    insertObject.stavkaFaktureInsert = this.stavkeZaUnos;
    //dodala sam i ovo, da ispraznimo listu nakon unosa novog objekta.
    this.stavkeZaUnos = [];

    console.log(insertObject);

    return this.httpClient.post<any>(this.invoiceUrl, insertObject);
  }

  // isprazni listu stavki
  isprazni() {
    this.stavkeZaUnos = [];
  }

  //vrati stavke fakture
  vratiStavkeZaUnos(): StavkaFaktureInsert[] {
    return this.stavkeZaUnos;
  }

  // vrati fakture sa odredjenom valutom
  getInvoicesWithCertainCurrency(currency: String): Observable<Faktura[]> {
    const searchInvoicesUrl = `${this.invoiceUrl}/${currency}`;
    return this.httpClient.get<Faktura[]>(searchInvoicesUrl);
  }

  // obrisi fakturu
  deleteInvoice(id: number): Observable<any> {
    const deleteInvoicesUrl = `${this.invoiceUrl}/${id}`;
    return this.httpClient.delete(deleteInvoicesUrl, { responseType: 'text' });
  }

  //vrati fakturu za prikaz ili izmenu
  getInvoiceForShowOrUpdate(id: number): Observable<Faktura> {
    const searchInvoiceUrl = `${this.invoiceUrl}/id/${id}`;
    return this.httpClient.get<Faktura>(searchInvoiceUrl);
  }

  //postavi fakturu za prikaz
  setInvoiceForShow(data: Faktura) {
    console.log("Faktura: ", data);
    this.invoiceForShow = data;
  }

  //postavi fakturu za izmenu
  setInvoiceForUpdate(data: Faktura) {
    console.log("Faktura: ", data);
    this.invoiceForUpdate = data;
  }

  //komponenta za prikaz uzima fakturu koju treba da prikaze
  getInvoiceForPrikaz() {
    return this.invoiceForShow;
  }

  //komponenta za izmenu uzima fakturu koju treba da izmeni
  getInvoiceForIzmena() {
    return this.invoiceForUpdate;
  }

  //vrati stavke fakture za prikaz ili izmenu
  getInvoiceItemForShowOrUpdate(id: number): Observable<StavkaFakture[]> {
    const searchInvoiceItemUrl = `${this.invoiceItemUrl}/${id}`;
    return this.httpClient.get<StavkaFakture[]>(searchInvoiceItemUrl);
  }

  //postavi stavke fakture za prikaz
  setInvoiceItemForShow(data: StavkaFakture[]) {
    console.log("Stavke fakture: ", data);
    this.invoiceItemForShow = data;
    this.router.navigate(['/faktura-prikaz']);
  }

  //postavi stavke fakture za izmenu
  setInvoiceItemsForUpdate(data: StavkaFakture[]) {
    console.log("Stavke fakture: ", data);
    this.invoiceItemsForUpdate = data;
    this.router.navigate(['/faktura-update']);
  }

  //komponenta za prikaz uzima stavke fakture koje treba da prikaze
  getInvoiceItemForPrikaz() {
    return this.invoiceItemForShow;
  }

  //komponenta za izmenu uzima stavke fakture koje treba da izmeni
  getInvoiceItemsForIzmena() {
    return this.invoiceItemsForUpdate;
  }


  // izmeni stavku koja se nalazi u bazi
  updateInvoiceItem(data: StavkaFaktureInsert) {
    if (this.invoiceItemsForUpdate != null) {
      for (let i = 0; i < this.invoiceItemsForUpdate.length; i++) {
        if (data.sifraStavke == this.invoiceItemsForUpdate[i].id.sifraStavke) {
          this.invoiceItemsForUpdate[i].opis = data.opis;
          this.invoiceItemsForUpdate[i].ean = data.ean;
          this.invoiceItemsForUpdate[i].kolicina = data.kolicina;
          this.invoiceItemsForUpdate[i].proizvod.nazivProizvoda = "";
          this.invoiceItemsForUpdate[i].proizvod.sifraProizvoda = data.sifraProizvoda;
        }
      }
    }
  }

  // put za fakturu
  putInvoice(fakturatIns: FakturaInsert): Observable<any> {

    let insertObject = new InsertObjekat();
    insertObject.fakturaInsert = fakturatIns;

    for (let l = 0; l < this.invoiceItemsForUpdate.length; l++) {
      let sfi = new StavkaFaktureInsert();
      sfi.sifraStavke = this.invoiceItemsForUpdate[l].id.sifraStavke;
      sfi.opis = this.invoiceItemsForUpdate[l].opis;
      sfi.ean = this.invoiceItemsForUpdate[l].ean;
      sfi.kolicina = this.invoiceItemsForUpdate[l].kolicina;
      sfi.sifraProizvoda = this.invoiceItemsForUpdate[l].proizvod.sifraProizvoda;

      this.stavkeZaUnos.push(sfi);
    }

    insertObject.stavkaFaktureInsert = this.stavkeZaUnos;
    //dodala sam i ovo, da ispraznimo listu nakon unosa novog objekta.
    this.stavkeZaUnos = [];
    this.invoiceItemsForUpdate = [];
    //trebalo bi i objekat invoiceForUpdate da reset.

    console.log(insertObject);

    return this.httpClient.put<any>(this.invoiceUrl, insertObject);
  }

    //obrisi stavku iz operativne memorije
  deleteInvoiceItemFromMemory(sifraSt:number){
    for(let j = 0; j < this.invoiceItemsForUpdate.length; j++){
      if(sifraSt == this.invoiceItemsForUpdate[j].id.sifraStavke){
          this.invoiceItemsForUpdate.splice(j,1);          
      }
    }
    for(let k = 0; k < this.stavkeZaUnos.length; k++){
      if(sifraSt == this.stavkeZaUnos[k].sifraStavke){
          this.stavkeZaUnos.splice(k,1);
      }
    }
  }

  //  obrisi stavku fakture iz baze!!!!
    deleteInvoiceItem(idStavke: number, idFakture: number): Observable<any> {
      const deleteInvoiceItemUrl = `${this.invoiceItemUrl}/${idStavke}/${idFakture}`;
      return this.httpClient.delete(deleteInvoiceItemUrl, { responseType: 'text' });
    }

}
