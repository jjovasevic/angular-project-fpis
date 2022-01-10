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
  invoiceForShow!: Faktura;
  invoiceItemForShow!: StavkaFakture[];
  invoiceForUpdate!: Faktura;
  invoiceItemsForUpdate!: StavkaFakture[];

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

    //provera da li je uneta bilo koja vrednost
    if(valuta != null){
      this.fakturaService.getInvoicesWithCertainCurrency(valuta).subscribe(
        data => {
          this.invoices = data;
          if (this.invoices.length === 0) {
            alert(`Ne postoje fakture sa trazenom valutom: ` + valuta);
          }
        }
      );
    }else{
      alert(`Morate uneti naziv valute po kojoj zelite da pretrazite fakture.`);
    }
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

    //ako je stiklirano polje popunjena ili proverena, onda mozemo obrisati fakturu
    if (this.invoiceStatus == "popunjena" || this.invoiceStatus == "proverena") {

      let idBrisanje = this.searchInvoiceFormGroup.get('brisanje')?.value;

      //proveravamo da li je uneta bilo koja vrednost:
      if (idBrisanje != null) {
        this.fakturaService.deleteInvoice(idBrisanje).subscribe({
          next: response => {
            alert(response);
            this.resetFieldDelete();
            //obrisati fakturu i stavke iz operativne memorije:
            for (let i = 0; i < this.invoices.length; i++) {
              if (this.invoices[i].sifraFakture == idBrisanje) {
                this.invoices.splice(i, 1);
                return;
              }
            }
          },
          error: err => {
            alert(`Error. Faktura i stavke nisu uspesno obrisane iz baze. ${err.message}`);
          }
        }
        );
      }else{
        alert(`Morate uneti sifru fakture koju zelite obrisati.`);
      }

    } else {
      alert(`Status forme mora biti POPUNJENA ili PROVERENA da bi obrisali fakturu.`);
    }
  }

  resetFieldDelete() {
    this.searchInvoiceFormGroup.get('brisanje')?.setValue("");
  }

  //za prikaz fakture
  onSubmitShow() {

    if (this.invoiceStatus != "") {
      let idPrikazi = this.searchInvoiceFormGroup.get('prikaz')?.value;
      let zastavica = 0;

      //provera da li je uneta bilo koja vrednost u polje
      if(idPrikazi == null){
        alert(`Unesite sifru fakture koju zelite da pogledate.`);
      }else{
              //faktura
      this.fakturaService.getInvoiceForShowOrUpdate(idPrikazi).subscribe(
        data => {
          if (data == null) {
            alert(`U bazi ne postoji faktura sa sifrom: ` + idPrikazi);
            zastavica = 1;
          } else {
            this.invoiceForShow = data;
            this.fakturaService.setInvoiceForShow(this.invoiceForShow);
          }
        }
      );

      //stavke fakture
      this.fakturaService.getInvoiceItemForShowOrUpdate(idPrikazi).subscribe(
        data => {
          if (zastavica == 0) {
            this.invoiceItemForShow = data;
            this.fakturaService.setInvoiceItemForShow(this.invoiceItemForShow);
          }
        }
      );
      }

    } else {
      alert(`Polje status forme mora biti oznaceno.`);
    }
  }

  // za update fakture
  onSubmitUpdate() {

    //ako je stiklirano polje popunjena ili proverena, onda mozemo izmeniti fakturu
    if (this.invoiceStatus == "popunjena" || this.invoiceStatus == "proverena") {

      let idIzmena = this.searchInvoiceFormGroup.get('izmena')?.value;

      if(idIzmena == null){
        alert(`Unesite sifru fakture koju zelite da izmenite.`);
      }else{
        
      //faktura
      this.fakturaService.getInvoiceForShowOrUpdate(idIzmena).subscribe(
        data => {
          this.invoiceForUpdate = data;
          this.fakturaService.setInvoiceForUpdate(this.invoiceForUpdate);
        }
      );

      //stavke fakture
      this.fakturaService.getInvoiceItemForShowOrUpdate(idIzmena).subscribe(
        data => {
          this.invoiceItemsForUpdate = data;
          this.fakturaService.setInvoiceItemsForUpdate(this.invoiceItemsForUpdate);
        }
      );
      }

    } else {
      alert(`Status forme mora biti POPUNJENA ili PROVERENA da bi izmenili fakturu i njene stavke.`);
    }

  }


  

}
