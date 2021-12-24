import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KupacComponent } from './kupac/kupac.component';

const routes: Routes = [
        {path: 'kupac', component: KupacComponent},
        {path: '', redirectTo: '/kupac',pathMatch:'full'},
        {path: '**', redirectTo: '/kupac',pathMatch:'full'}
      ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
