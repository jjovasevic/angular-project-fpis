import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Kupac } from '../klase/kupac';
import { map } from 'rxjs/operators';
import { KupacInsert } from '../klase/kupac-insert';
import { Grad } from '../klase/grad';
import { Ulica } from '../klase/ulica';
import { Zaposleni } from '../klase/zaposleni';
import { Adresa } from '../klase/adresa';
import { UlicaID } from '../klase/ulica-id';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class KupacService {

  private customerUrl = 'http://localhost:8080/kupac';
  private cityUrl = 'http://localhost:8080/grad';
  private streetUrl = 'http://localhost:8080/ulica';
  private adressUrl = 'http://localhost:8080/adresa';
  private employeesUrl = 'http://localhost:8080/zaposleni';

  customerForUpdate!: Kupac;


  constructor(private httpClient: HttpClient, private router: Router) { }

  getCustomers():Observable<Kupac[]>{
    return this.httpClient.get<Kupac[]>(this.customerUrl);
  }

  getCities():Observable<Grad[]>{
    return this.httpClient.get<Grad[]>(this.cityUrl);
  }

  getEmployees():Observable<Zaposleni[]>{
    return this.httpClient.get<Zaposleni[]>(this.employeesUrl);
  }

  getStreets(postalCode: number):Observable<Ulica[]>{
    const searchStreetUrl = `${this.streetUrl}/${postalCode}`;
    return this.httpClient.get<Ulica[]>(searchStreetUrl);
  }

  getAdress(post_broj: number, sif_ulice: String):Observable<Adresa[]>{
    const searchAdressUrl = `${this.adressUrl}/${post_broj}/${sif_ulice}`;
    return this.httpClient.get<Adresa[]>(searchAdressUrl);
  }

  postCustomer(kupacIns : KupacInsert):Observable<any>{
    console.log(kupacIns);
    return this.httpClient.post<KupacInsert>(this.customerUrl,kupacIns);
  }

  getCustomersByName(name: String):Observable<Kupac[]>{
    const searchCustomerByNameUrl = `${this.customerUrl}/${name}`;
    return this.httpClient.get<Kupac[]>(searchCustomerByNameUrl)
  }

  deleteCustomer(pibForDelete: number):Observable<any>{
    const deleteCustomerUrl = `${this.customerUrl}/${pibForDelete}`;
    return this.httpClient.delete(deleteCustomerUrl, {responseType: 'text'});
  }

  getCustomersById(pibCustomer: number):Observable<Kupac>{
    const searchCustomerByPibUrl = `${this.customerUrl}/id/${pibCustomer}`;
    return this.httpClient.get<any>(searchCustomerByPibUrl);
  }

  //postavi kupca za izmenu
  setCustomerForUpdate(data: any){
    console.log("Kupac: ", data);
    this.customerForUpdate = data;
    this.router.navigate(['/kupac-update']);
  }

  //uzmi kupca za izmenu
  getCustomerForUpdate(){
    return this.customerForUpdate;
  }

  //izmeni kupca
  putCustomer(kupacUpdate : KupacInsert):Observable<any>{
    console.log("Kupac koji se menja je 2): ",kupacUpdate);
    return this.httpClient.put<KupacInsert>(this.customerUrl,kupacUpdate);
  }


}

