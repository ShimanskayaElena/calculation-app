import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { InitialData } from './model/initialData';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  dataCol: AngularFirestoreCollection<InitialData>;
  data: Observable<InitialData[]>; // данные, полученные из БД Firestore

  constructor(private afs: AngularFirestore) {}

  get(): Observable<InitialData[]> {
    this.dataCol = this.afs.collection('data'); // 'data' - имя коллекции в Firebase
    this.data = this.dataCol.valueChanges();
    return this.data;
  }

  add( newData: InitialData ): void {

    // если мы хотим, чтобы в БД сохранялись все варианты вводимых данных
    // let i = '';
    // i = i + new Date().getTime();

    // если мы хотим, чтобы в БД хранилась информация только о последнем варианте введённых в форму данных
    const i = 'my-custom-id';

    this.afs.collection('data').doc(i).set(newData);
  }
}
