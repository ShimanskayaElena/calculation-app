import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found.component';
import { FormComponent } from './form/form.component';
import { CalculationComponent } from './calculation/calculation.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyACzU3X2BDFvwAC2KCdpStTwRGHUlc9SUg",
  authDomain: "calculation-eafc3.firebaseapp.com",
  databaseURL: "https://calculation-eafc3.firebaseio.com",
  projectId: "calculation-eafc3",
  storageBucket: "calculation-eafc3.appspot.com",
  messagingSenderId: "1085215063868"
};

import { FirestoreService } from './firestore.service';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    FormComponent,
    CalculationComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [ FirestoreService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
