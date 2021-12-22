import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Kupac } from '../klase/kupac';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KupacService {

private baseUrl = 'http://localhost:8080/kupac';

  constructor(private httpClient: HttpClient) { }


  getCustomers():Observable<Kupac[]>{
    return this.httpClient.get<Kupac[]>(this.baseUrl);
  }


  // getCustomers():Observable<Kupac[]>{
  //   return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
  //     map(response => response._embedded.kupac)
  //   );
  // }

}

  // interface GetResponse{
  //   _embedded:{
  //     kupac : Kupac[];
  //   }
  // }



