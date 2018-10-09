import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';

import { FirestoreService } from '../firestore.service';
import { InitialData } from  '../model/initialData';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  initialForm: FormGroup;
  z1: AbstractControl;
  z2: AbstractControl;
  Me: AbstractControl;
  E: AbstractControl;

  data: Observable<InitialData[]>; // данные, полученные из Firestore

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.data = this.firestoreService.get();
   }

  ngOnInit() {
    this.data.subscribe( data => {
      this.createForm(data);
    });
    
  }

  createForm( initialData: InitialData[] ): void {
    const i = initialData.length - 1; // определяем индеск последней записи в БД

    this.initialForm = new FormGroup({
      z1: new FormControl( initialData[i].z1, { validators: [Validators.required, Validators.min(10), Validators.max(60), this.numberTeethValidator()]}),
      z2: new FormControl( initialData[i].z2, { validators: [Validators.required, Validators.min(10), Validators.max(1000), this.numberTeethValidator()]}),
      Me: new FormControl( initialData[i].Me, { validators: [Validators.required, Validators.min(1)]}),
      E: new FormControl( initialData[i].E, { validators: [Validators.required, Validators.min(10), Validators.max(170)]})
    }, { updateOn: 'blur' } ); // для повышения производительности

    this.z1 = this.initialForm.controls.z1;  // число зубьев шестерни
    this.z2 = this.initialForm.controls.z2;  // число зубьев колеса
    this.Me = this.initialForm.controls.Me;  // внешний окружной модуль
    this.E = this.initialForm.controls.E;    // межосевой угол передачи
  }

  // кастомный валидатор
  private numberTeethValidator(): ValidatorFn {
    return ( control: AbstractControl ): { [key: string]: boolean } => {

      if ( this.initialForm && (control.dirty || control.touched)) {

        if ( this.z1.value !== null && this.z2.value !== null ) {

          if ( this.z2.value && +this.z1.value === 12 && +this.z2.value < 30 ) {
            return {'numberTeethValidator': true};
          }

          if ( this.z2.value && +this.z1.value === 13 && +this.z2.value < 26 ) {
            return {'numberTeethValidator': true};
          }

          if ( this.z2.value && +this.z1.value === 14 && +this.z2.value < 20 ) {
              return {'numberTeethValidator': true};
          }

          if ( this.z2.value && +this.z1.value === 15 && +this.z2.value < 19 ) {
              return {'numberTeethValidator': true};
          }

          if ( this.z2.value && +this.z1.value === 16 && +this.z2.value < 18 ) {
              return {'numberTeethValidator': true};
          }

          if ( this.z2.value && +this.z1.value === 17 && +this.z2.value < 17 ) {
              return {'numberTeethValidator': true};
          }

        }
      }

      return null;

    };
  }

  calculation(): void {

    const newData = {
      E: this.E.value,
      Me: this.Me.value,
      z1: this.z1.value,
      z2: this.z2.value
    };

    this.firestoreService.add( newData ); // сохраняем введённые данные в БД

    this.router.navigate(['../calculation'], { relativeTo: this.route });
  }
}
