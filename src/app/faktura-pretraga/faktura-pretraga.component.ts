import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Faktura } from '../klaseSlozen/faktura';
import { StavkaFakture } from '../klaseSlozen/stavka-fakture';
import { FakturaService } from '../services/faktura.service';

@Component({
  selector: 'app-faktura-pretraga',
  templateUrl: './faktura-pretraga.component.html',
  styleUrls: ['./faktura-pretraga.component.css']
})
export class FakturaPretragaComponent implements OnInit {

  searchInvoiceFormGroup!: FormGroup;
  invoices!: Faktura[];
  invoiceStatus: String = "";
  invoiceForShow!:Faktura;
  invoiceItemForShow!: StavkaFakture[];

  constructor(private fakturaService: FakturaService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.searchInvoiceFormGroup = new FormGroup({
      'pretraga': new FormControl(),
      'izmena': new FormControl(),
      'brisanje': new FormControl(),
      'prikaz': new FormControl()
    });


  }

  // vrati fakture sa odredjenom valutom
  onSubmitSearch() {
    let valuta = this.searchInvoiceFormGroup.get('pretraga')?.value;

    this.fakturaService.getInvoicesWithCertainCurrency(valuta).subscribe(
      data => {
        this.invoices = data;
        console.log(data);
      }
    );
  }

  //popuni status forme
  fillInvoiceStatus(event: any) {

    this.invoiceStatus = "";

    if (event.target.checked) {
      this.invoiceStatus = event.target.value;
      console.log(this.invoiceStatus);
    }
  }

  //brisanje fakture
  onSubmitDelete() {

    //ako je stiklirano bilo koje polje, onda mozemo obrisati fakturu
    if (this.invoiceStatus == "popunjena" ||this.invoiceStatus == "proverena") {

      let idBrisanje = this.searchInvoiceFormGroup.get('brisanje')?.value;

      this.fakturaService.deleteInvoice(idBrisanje).subscribe({
        next: response => {
          alert(`Faktura i stavke su uspesno obrisane iz baze!`);
          this.resetFieldDelete();
        },
        error: err => {
          alert(`Faktura i stavke nisu uspesno obrisane iz baze. ${err.message}`);
        }

      }
      );

    }else{
      alert(`Status forme mora biti POPUNJENA ili PROVERENA da bi obrisali fakturu.`);
    }
  }

  resetFieldDelete() {
    this.searchInvoiceFormGroup.get('brisanje')?.setValue("");
  }

  onSubmitShow(){

    if(this.invoiceStatus != ""){
      let idPrikazi = this.searchInvoiceFormGroup.get('prikaz')?.value;

      //faktura
      this.fakturaService.getInvoiceForShow(idPrikazi).subscribe(
        data => {
          this.invoiceForShow = data;
          this.fakturaService.setInvoiceForShow(this.invoiceForShow);
        }
      );

      //stavke fakture
      this.fakturaService.getInvoiceItemForShow(idPrikazi).subscribe(
        data => {
          this.invoiceItemForShow = data;
          this.fakturaService.setInvoiceItemForShow(this.invoiceItemForShow);
        }
      );

    }else{
      alert(`Polje status forme mora biti oznaceno.`);
    }
  }

  onSubmitUpdate() {

  }

}
