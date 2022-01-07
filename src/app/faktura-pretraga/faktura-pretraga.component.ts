import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Faktura } from '../klaseSlozen/faktura';
import { FakturaService } from '../services/faktura.service';

@Component({
  selector: 'app-faktura-pretraga',
  templateUrl: './faktura-pretraga.component.html',
  styleUrls: ['./faktura-pretraga.component.css']
})
export class FakturaPretragaComponent implements OnInit {

  searchInvoiceFormGroup!: FormGroup;
  invoices!: Faktura[];

  constructor(private fakturaService: FakturaService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.searchInvoiceFormGroup = new FormGroup({
      'pretraga': new FormControl(),
      'izmena': new FormControl(),
      'brisanje': new FormControl()
    });

    
  }

  // vrati fakture sa odredjenom valutom
  onSubmitSearch(){
    let valuta = this.searchInvoiceFormGroup.get('pretraga')?.value;

    this.fakturaService.getInvoicesWithCertainCurrency(valuta).subscribe(
      data => {
        this.invoices = data;
        console.log(data);
      }
    );
  }

  onSubmitUpdate(){

  }

  onSubmitDelete(){
    let id = this.searchInvoiceFormGroup.get('brisanje')?.value;

    this.fakturaService.deleteInvoice(id).subscribe({
      next: response => {
        alert(`Faktura i stavke su uspesno obrisane iz baze!`);
        this.resetFieldDelete();
      },
      error: err => {
        alert(`Faktura i stavke nisu uspesno obrisane iz baze. ${err.message}`);
      }
      
    }
    );
  }

  resetFieldDelete(){
    this.searchInvoiceFormGroup.get('brisanje')?.setValue("");
  }


}
