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
  invoiceItem!: StavkaFakture[];

  constructor(private fakturaService: FakturaService) { }

  ngOnInit(): void {

    this.invoice = this.fakturaService.getInvoiceForPrikaz();
    this.invoiceItem = this.fakturaService.getInvoiceItemForPrikaz();

  }

}
