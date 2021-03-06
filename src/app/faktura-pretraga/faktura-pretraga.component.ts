import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Faktura } from '../klaseSlozen/faktura';
import { StavkaFakture } from '../klaseSlozen/stavka-fakture';
import { FakturaService } from '../services/faktura.service';

@Component({
  selector: 'app-faktura-pretraga',
  templateUrl: './faktura-pretraga.component.html',
  styleUrls: ['./faktura-pretraga.component.css'],
})
export class FakturaPretragaComponent implements OnInit {
  searchInvoiceFormGroup!: FormGroup;
  invoices!: Faktura[];

  invoiceForShow!: Faktura;
  invoiceItemForShow!: StavkaFakture[];
  invoiceForUpdate!: Faktura;
  invoiceItemsForUpdate!: StavkaFakture[];

  constructor(
    private fakturaService: FakturaService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.searchInvoiceFormGroup = new FormGroup({
      pretraga: new FormControl('', [Validators.pattern('[a-zA-Z]{3}')]),
      izmena: new FormControl('', [Validators.pattern('[0-9]*')]),
      brisanje: new FormControl('', [Validators.pattern('[0-9]*')]),
      prikaz: new FormControl('', [Validators.pattern('[0-9]*')]),
    });
  }

  // vrati fakture sa odredjenom valutom
  onSubmitSearch() {
    if (this.searchInvoiceFormGroup.get('pretraga')?.invalid) {
      this.searchInvoiceFormGroup.markAllAsTouched();
      alert(
        `Ukoliko zelite da pronadjete fakture, morate pravilno popuniti polje.`
      );
    } else {
      let valuta = this.searchInvoiceFormGroup.get('pretraga')?.value;

      //provera da li je uneta bilo koja vrednost
      if (valuta != null) {
        this.fakturaService
          .getInvoicesWithCertainCurrency(valuta)
          .subscribe((data) => {
            this.invoices = data;
            if (this.invoices.length === 0) {
              alert(`Ne postoje fakture sa trazenom valutom: ` + valuta);
            }
            this.resetFieldSearch();
          });
      } else {
        alert(
          `Morate uneti naziv valute po kojoj zelite da pretrazite fakture.`
        );
      }
    }
  }

  // reset polje za trazenje
  resetFieldSearch() {
    this.searchInvoiceFormGroup.get('pretraga')?.setValue('');
  }

  //brisanje fakture
  onSubmitDelete() {
    if (this.searchInvoiceFormGroup.get('brisanje')?.invalid) {
      this.searchInvoiceFormGroup.markAllAsTouched();
      alert(
        `Ukoliko zelite da izbrisete fakturu, morate pravilno popuniti polje.`
      );
    } else {

        let idBrisanje = this.searchInvoiceFormGroup.get('brisanje')?.value;

        //proveravamo da li je uneta bilo koja vrednost:
        if (idBrisanje != 0) {
          if (
            confirm(
              'Da li ste sigurni da zelite da obrisete fakturu sa sifrom: ' +
                idBrisanje
            )
          ) {
            this.fakturaService.deleteInvoice(idBrisanje).subscribe({
              next: (response) => {
                alert(response);
                this.resetFieldDelete();
                //obrisati fakturu i stavke iz operativne memorije ako je obrisana iz baze:
                if (
                  response != 'Faktura nije obrisana jer ne postoji u bazi.'
                ) {
                  for (let i = 0; i < this.invoices.length; i++) {
                    if (this.invoices[i].sifraFakture == idBrisanje) {
                      this.invoices.splice(i, 1);
                      return;
                    }
                  }
                }
              },
              error: (err) => {
                alert(
                  `Error. Faktura i stavke nisu uspesno obrisane iz baze. ${err.message}`
                );
              },
            });
          } else {
            // Nemoj nista da uradis, ipak ne treba obrisati fakturu iz baze.
          }
        } else {
          alert(`Morate uneti sifru fakture koju zelite obrisati.`);
        }
    }
  }
  // reset polje
  resetFieldDelete() {
    this.searchInvoiceFormGroup.get('brisanje')?.setValue('');
  }

  //za prikaz fakture
  onSubmitShow() {
    if (this.searchInvoiceFormGroup.get('prikaz')?.invalid) {
      this.searchInvoiceFormGroup.markAllAsTouched();
      alert(
        `Ukoliko zelite da prikazete fakturu, morate pravilno popuniti polje.`
      );
    } else {
        let idPrikazi = this.searchInvoiceFormGroup.get('prikaz')?.value;

        //provera da li je uneta bilo koja vrednost u polje
        if (idPrikazi == 0) {
          alert(`Unesite sifru fakture koju zelite da pogledate.`);
        } else {
          //faktura
          this.fakturaService
            .getInvoiceForShowOrUpdate(idPrikazi)
            .subscribe((data) => {
              if (data == null) {
                alert(`U bazi ne postoji faktura sa sifrom: ` + idPrikazi);
              } else {
                this.invoiceForShow = data;
                this.fakturaService.setInvoiceForShow(this.invoiceForShow);

                //uzmi stavke fakture i prikazi fakturu
                this.fakturaService
                  .getInvoiceItemForShowOrUpdate(idPrikazi)
                  .subscribe((data) => {
                    this.invoiceItemForShow = data;
                    this.fakturaService.setInvoiceItemForShow(
                      this.invoiceItemForShow
                    );
                  });
              }
            });
        }
    }
  }

  // za update fakture
  onSubmitUpdate() {
    if (this.searchInvoiceFormGroup.get('izmena')?.invalid) {
      this.searchInvoiceFormGroup.markAllAsTouched();
      alert(
        `Ukoliko zelite da izmenite fakturu, morate pravilno popuniti polje.`
      );
    } else {
        let idIzmena = this.searchInvoiceFormGroup.get('izmena')?.value;
        let zastavica2 = 0;

        if (idIzmena == 0) {
          alert(`Unesite sifru fakture koju zelite da izmenite.`);
        } else {
          //faktura
          this.fakturaService
            .getInvoiceForShowOrUpdate(idIzmena)
            .subscribe((data) => {
              if (data != null) {
                this.invoiceForUpdate = data;
                this.fakturaService.setInvoiceForUpdate(this.invoiceForUpdate);
                zastavica2 = 1;
              } else {
                alert(
                  `Nije moguce izmeniti fakturu sa sifrom: ` +
                    idIzmena +
                    `, jer ne postoji u bazi.`
                );
              }
            });

          //stavke fakture
          this.fakturaService
            .getInvoiceItemForShowOrUpdate(idIzmena)
            .subscribe((data) => {
              if (zastavica2 != 0) {
                this.invoiceItemsForUpdate = data;
                this.fakturaService.setInvoiceItemsForUpdate(
                  this.invoiceItemsForUpdate
                );
                zastavica2 = 0;
              }
            });
        }
    }
  }

  //getter metode potrebne zbog validacije
  get pretraga() {
    return this.searchInvoiceFormGroup.get('pretraga');
  }
  get izmena() {
    return this.searchInvoiceFormGroup.get('izmena');
  }
  get brisanje() {
    return this.searchInvoiceFormGroup.get('brisanje');
  }
  get prikaz() {
    return this.searchInvoiceFormGroup.get('prikaz');
  }
}
