import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { FormComponent } from './form/form.component';
import { CalculationComponent } from './calculation/calculation.component';
import { PageNotFoundComponent } from './page-not-found.component';

export const routes: Routes = [
  { path: 'form', component: FormComponent},
  { path: 'calculation', component: CalculationComponent},
  { path: '', redirectTo: 'form', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule]
})
export class AppRoutingModule {}
