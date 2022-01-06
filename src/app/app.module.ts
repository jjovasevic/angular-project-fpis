import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KupacComponent } from './kupac/kupac.component';
import {HttpClientModule} from '@angular/common/http';
import { KupacService } from './services/kupac.service';
import { ReactiveFormsModule } from '@angular/forms';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { PretragaComponent } from './pretraga/pretraga.component';
import { KupacUpdateComponent } from './kupac-update/kupac-update.component';
import { FakturaInsertComponent } from './faktura-insert/faktura-insert.component';
import { FakturaService } from './services/faktura.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    AppComponent,
    KupacComponent,
    PocetnaComponent,
    PretragaComponent,
    KupacUpdateComponent,
    FakturaInsertComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [KupacService, FakturaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
