import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FakturaInsertComponent } from './faktura-insert/faktura-insert.component';
import { KupacUpdateComponent } from './kupac-update/kupac-update.component';
import { KupacComponent } from './kupac/kupac.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { PretragaComponent } from './pretraga/pretraga.component';

const routes: Routes = [
        {path: 'kupac', component: KupacComponent},
        {path: 'pretraga', component: PretragaComponent},
        {path: 'kupac-update', component: KupacUpdateComponent},
        {path: 'faktura-insert', component: FakturaInsertComponent},
        {path: '', component: PocetnaComponent},
        {path: '**', redirectTo: '',pathMatch:'full'}
      ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
