import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KupacComponent } from './kupac/kupac.component';
import {HttpClientModule} from '@angular/common/http';
import { KupacService } from './services/kupac.service';

@NgModule({
  declarations: [
    AppComponent,
    KupacComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [KupacService],
  bootstrap: [AppComponent]
})
export class AppModule { }
