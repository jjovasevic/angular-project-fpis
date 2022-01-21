import { Component, OnInit } from '@angular/core';
import { Faktura } from '../klaseSlozen/faktura';
import { StavkaFakture } from '../klaseSlozen/stavka-fakture';
import { FakturaService } from '../services/faktura.service';

@Component({
  selector: 'app-faktura-prikaz',
  templateUrl: './faktura-prikaz.component.html',
  styleUrls: ['./faktura-prikaz.component.css']
})
export class FakturaPrikazComponent implements OnInit {

  invoice!: Faktura;
  invoiceItems!: StavkaFakture[];
  defaultDate!: Date;
  dateString!: string;

  constructor(private fakturaService: FakturaService) { }

  ngOnInit(): void {

    this.invoice = this.fakturaService.getInvoiceForPrikaz();
    this.invoiceItems = this.fakturaService.getInvoiceItemForPrikaz();

    this.dateFormatting();
  }

  dateFormatting(){
    this.defaultDate = new Date(this.invoice.datumPrometa);
    console.log(this.defaultDate.getDate(), this.defaultDate.getMonth(), this.defaultDate.getFullYear());
    const day = this.defaultDate.getDate() < 10 ? `0${this.defaultDate.getDate()}`: `${this.defaultDate.getDate()}`;
    const month = this.defaultDate.getMonth() < 10 ? `0${this.defaultDate.getMonth()+1}`: `${this.defaultDate.getMonth()+1}`;
    this.dateString = `${this.defaultDate.getFullYear()}-${month}-${day}`;
  }

}
