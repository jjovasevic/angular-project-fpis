import { Component, OnInit } from '@angular/core';
import { Kupac } from '../klase/kupac';
import { KupacService } from '../services/kupac.service';

@Component({
  selector: 'app-kupac',
  templateUrl: './kupac.component.html',
  styleUrls: ['./kupac.component.css']
})
export class KupacComponent implements OnInit {

  customers!: Kupac[];

  constructor(private kupacService : KupacService) { }

  ngOnInit(): void {
     this.getCustomers();
  }

  getCustomers(){
    this.kupacService.getCustomers().subscribe(
      data => {
        this.customers = data;
      }
    )
  }
  // getCustomers(){
  //   this.kupacService.getCustomers().subscribe((data:Kupac[]) => {
  //     this.customers = data;
  //   })
  // }






}
