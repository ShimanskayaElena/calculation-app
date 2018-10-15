import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FirestoreService } from '../firestore.service';
import { Observable } from 'rxjs';

import { InitialData } from '../model/initialData';
import { biasСoefficients } from '../model/biasСoefficients';


@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.css']
})
export class CalculationComponent implements OnInit {

  arrays: Array<Array<number>> = biasСoefficients; // данные для построения таблицы коэффициентов смещения x1
  invisible = true; // отвечает за отображение таблицы коэффициентов смещения в процессе вычисления
  details = false; // отвечает за вывод на экран промежуточных результатов расчёта

  data: Observable<InitialData[]>; // данные, введённые пользователем и хранящиеся в БД
  Z1: number; //  число зубьев шестерни
  Z2: number; // число зубьев колеса
  Me: number; // внешний окружной модуль
  Eg: number; // межосевой угол передачи в градусах
  Er: number; // межосевой угол передачи в радианах
  Zc: number; // число зубьев плоского колеса
  Re: number; // внешнее конусное расстояние
  b: number; // ширина зубчатого венца
  vr: number; // угол делительного конуса шестерни в радианах
  vg: number; // угол делительного конуса шестерни в градусах
  v1: number; // угол делительного конуса шестерни в градусах - отформатированный результат
  Vr: number; // угол делительного конуса колеса в радианах
  Vg: number; // угол делительного конуса колеса в градусах
  v2: number; // угол делительного конуса колеса в градусах - отформатированный результат
  u: number; // передаточное число (для межосевого угла передачи, равного 90 градусам)
  uvb: number; // передаточное число эквивалентной конической передачи (если межосевой угол передачи не равен 90 градусам)
  Zvb: number; // число зубьев эквивалентной конической шестерни (если межосевой угол передачи не равен 90 градусам)
  x1: number; // коэффициент смещения шестерни
  x2: number; // коэффициент смещения колеса
  xt1: any; // коэффициент изменения расчётной толщины зуба шестерни (при u >= 2,5)
  xt2: any; // коэффициент изменения расчётной толщины зуба колеса (при u >= 2,5)
  hae1: number; // внешняя высота головки зуба шестерни
  hae2: number; // внешняя высота головки зуба колеса
  hfe1: number; // внешняя высота ножки зуба шестерни
  hfe2: number; // внешняя высота ножки зуба колеса
  he1: number; // внешняяя высота зуба шестерни
  he2: number; // внешняя высота зуба колеса
  Se1: number; // внешняя окружная толщина зуба шестерни
  Se2: number; // внешняя окружная толина зуба колеса
  Qf1: number; // угол ножки зуба шестерни, градусы
  Qf2: number; // угол ножки зуба колеса, градусы
  Qa1: number; // угол головки зуба шестерни, градусы
  Qa2: number; // угол головки зуба колеса, градусы
  ba1: any; // угол конуса вершин шестерни, градусы
  ba2: any; // угол конуса вершин колеса, градусы
  bf1: any; // угол конуса впадин шестерни, градусы
  bf2: any; // угол конуса впалин колеса, градусы
  de1: number; // внешний делительный диаметр шестерни
  de2: number; // внешний делительный диаметр колеса
  dae1: number; // внешний диаметр вершин зубьев шестерни
  dae2: number; // внешний диаметр вершин зубьев колеса
  B1: number; // расстояние от вершины до плоскости внешней окружности вершин зубьев шестерни
  B2: number; // расстояние от вершины до плоскости внешней окружности вершин зубьев колеса
  we1: number; // половина внешней угловой толщины зуба шестерни, радианы
  we2: number; // половина внешней угловой толщины зуба колеса, радианы
  se1: number; // внешняя делительная толщина зуба шестерни по хорде
  Hae1: number; // высота до внешней делительной хорды зуба шестерни
  se2: number; // внешняя делительная толщина зуба колеса по хорде (при х1 <= 0.4)
  dye2: number; // диаметр концентрической окружности
  Sye2: number; // внешняя делительная толщина зуба колеса по хорде на концентрической окружности (при х1 > 0.4)



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestoreService: FirestoreService
  ) { 
    this.data = this.firestoreService.get();
  }

  ngOnInit() {

    this.data.subscribe( data => {
      this.getData(data);
      this.Zc = this.function_1();
      this.Re = this.function_2();
      this.b = this.function_3();
      this.vg = this.function_4(); 
      this.v1 = this.getDegrees(this.vg);
      this.Vr = (this.Er - this.vr);
      this.Vg = this.Vr * 180 / Math.PI;
      this.v2 = this.getDegrees(this.Vg);
      this.u = this.function_7();
      this.uvb = this.function_8();
      this.Zvb = this.function_9();
    });
  }

  getData( initialData: InitialData[] ) {
    const i = initialData.length - 1; // определяем индеск последней записи в БД
    this.Z1 = initialData[i].z1;
    this.Z2 = initialData[i].z2;
    this.Me = initialData[i].Me;
    this.Eg = initialData[i].E; // в градусах
    this.Er = this.fixPrecision( this.Eg * Math.PI / 180, 4); // в радианах
  }

  showDetails(): boolean {
    return this.details = true;
  }

  // выбор коэффициента смещения шестерни пользователем
  selectX1(i: number): void {
    this.invisible = true; // скрываем таблицу коэффициентов смещения Х1

    this.x1 = i;
    this.x2 = -this.x1;
    this.xt1 = this.function_10();
    this.xt2 = this.function_11();
    this.hae1 = this.function_12();
    this.hae2 = this.function_13();
    this.hfe1 = this.function_14();
    this.hfe2 = this.function_15();
    this.he1 = this.function_16();
    this.he2 = this.function_17();
    this.Se1 = this.function_18();
    this.Se2 = this.function_19();
    this.Qf1 = this.function_20(this.hfe1);
    this.Qf2 = this.function_20(this.hfe2,);
    this.Qa1 = this.Qf1;
    this.Qa2 = this.Qf2;
    this.ba1 = this.function_21(this.vg, this.hfe2);
    this.ba2 = this.function_21(this.Vg, this.hfe1);
    this.bf1 = this.function_22(this.vg, this.hfe1);
    this.bf2 = this.function_22(this.Vg, this.hfe2);
    this.de1 = this.function_23(this. Z1, this.Me);
    this.de2 = this.function_23(this. Z2, this.Me);
    this.dae1 = this.function_24(this.de1, this.hae1, this.vr);
    this.dae2 = this.function_24(this.de2, this.hae2, this.Vr);
    this.B1 = this.function_25(this.Re, this.vr, this.hae1);
    this.B2 = this.function_25(this.Re, this.Vr, this.hae2);
    this.we1 = this.function_26(this.Se1, this.vr, this.de1);
    this.we2 = this.function_26(this.Se2, this.Vr, this.de2);
    this.se1 = this.function_27();
    this.Hae1 = this.function_28();
    this.se2 = this.function_29();
    this.dye2 = this.function_30();
    this.Sye2 = this.function_31();
  }

  // определение числа зубьев плоского колеса
  function_1(): number {
    const a = Math.pow(this.Z1, 2) + Math.pow(this.Z2, 2) + 2 * this.Z1 * this.Z2 * Math.cos(this.Er);
    const b = Math.sqrt(a) / Math.sin(this.Er);
    return this.fixPrecision(b, 0);
  }

  // определение внешнего конусного расстояния
  function_2(): number {
    const a = 0.5 * this.Me * this.Zc;
    return this.fixPrecision(a, 4);
  }

  // определение ширины зубчатого венца
  function_3(): number {
    const a = 0.3 * this.Re;
    const b = 10 * this.Me;
    if ( a <= b ) {
      return this.fixPrecision(a, 2);
    } else {
      return this.fixPrecision(b, 2);
    }
  }

  // определение угла делительного конуса шестерни в градусах
  function_4(): number {
    const a = this.Z2 / this.Z1 + Math.cos(this.Er);
    const b = Math.sin(this.Er) / a;
    this.vr =  Math.atan(b); // в радианах
    this.vg = this.vr * 180 / Math.PI; // переводим в градусы
    return this.vg;
  }

  // определяем передаточное число (для межосевого угла передачи, равного 90 градусам)
  function_7(): number {
    const a = this.Z2 / this.Z1;
    return this.fixPrecision(a, 2);
  }

  // определяем передаточное число эквивалентной конической передачи (если межосевой угол передачи не равен 90 градусам)
  function_8(): number {
    if ( +this.Eg !== 90) {
      const c = Math.sqrt(this.u * Math.cos(this.vr) / Math.cos(this.Vr));
      return this.fixPrecision(c, 2);
    }
  }

  // определяем число зубьев эквивалентной конической шестерни (если межосевой угол передачи не равен 90 градусам)
  function_9(): number {
    this.invisible = false; // показываем таблицу коэффициентов смещения Х1
    if ( +this.Eg !== 90) {
      const a =  this.Z1 / Math.cos(this.vr);
      const b = this.uvb / (Math.sqrt(1 + Math.pow(this.uvb, 2)));
      return this.fixPrecision((a * b), 0);
    }  
  }

  // определение коэффициента изменения расчётной толщины зуба шестерни (при u >= 2,5)
  function_10(): any {
    if ( this.u >= 2.5 ) {
      return (0.003 + 0.008 * (this.u - 2.5));
    } else {
      return 0;
    }
  }

  // определение коэффициента изменения расчётной толщины зуба колеса (при u >= 2,5)
  function_11(): any {
    if ( this.u >= 2.5 ) {
      return -this.xt1;
    } else {
      return 0;
    }
  }

  // определение внешней высоты головки зуба шестерни
  function_12(): number {
    const a = (1 + this.x1) * this.Me;
    return this.fixPrecision(a, 4);
  }

  // определение внешней высоты головки зуба колеса
  function_13(): number {
    const a =  2 * this.Me - this.hae1;
    return this.fixPrecision(a, 4);
  }

  // определение внешней высоты ножки зуба шестерни
  function_14(): number {
    const a = this.hae2 + 0.2 * this.Me;
    return this.fixPrecision(a, 4);
  }

  // определение внешней высоты ножки зуба колеса
  function_15(): number {
    const a = this.hae1 + 0.2 * this.Me;
    return this.fixPrecision(a, 4);
  }

  // определение внешней высоты зуба шестерни
  function_16(): number {
    const a = this.hae1 + this.hfe1;
    return this.fixPrecision(a, 4);
  }

  // определение внешней высоты зуба колеса
  function_17(): number {
    const a = this.hae2 + this.hfe2;
    return this.fixPrecision(a, 4);
  }

  // определение внешней окружной толщины зуба шестерни
  function_18(): number {
    const a = this.Me * ( 0.5 * Math.PI + 2 * this.x1 * Math.tan(20 * Math.PI / 180) + this.xt1);
    return this.fixPrecision(a, 4);
  }

  // определение внешней окружной толщины зуба колеса
  function_19(): number {
    const a = Math.PI * this.Me - this.Se1;
    return this.fixPrecision(a, 4);
  }

  // определение угла ножки зуба шестерни в градусах, аналогично определяется угол ножки зуба колеса в градусах
  function_20( hfei: number): any {
    const a = Math.atan( hfei / this.Re);  // в радианах
    return this.getDegrees(a * 180 / Math.PI); // форматируем результат
  }

  // определение угла конуса вершин шестерни (колеса) в градусах
  function_21 (v, hfe) {
    const a = v + (Math.atan( hfe / this.Re) * 180 / Math.PI); // получаем значение угла конуса вершин шестерни (колеса) в градусах
    return this.getDegrees(a); // форматируем результат
  }

  // определение угла конуса впадин шестерни (колеса) в градусах
  function_22 (v, hfe) {
    const a = v - (Math.atan( hfe / this.Re) * 180 / Math.PI); // получаем значение угла конуса впадин шестерни (колеса) в градусах
    return this.getDegrees(a); // форматируем результат
  }

  // определение внешнего делительного диаметра шестерни (колеса)
  function_23 (z: number, me: number): number {
    return this.fixPrecision((z * me), 4);
  }

  // определение внешнего диаметра вершин зубьев шестерни (колеса)
  function_24 (de: number, hae: number, b: number): number {
    const a = de + 2 * hae * Math.cos(b)
    return this.fixPrecision(a, 4);
  }

  // определение расстояния от вершины до плоскости внешней окружности вершин зубьев шестерни (колеса)
  function_25 (re: number, b: number, hae: number): number {
    const a = re *  Math.cos(b) - hae * Math.sin(b);
    return this.fixPrecision(a, 4);
  }

  // определение половины внешней угловой толщины зуба шестерни (колеса) в радианах
  function_26 (se: number, b: number, de: number): number {
    const a = se * Math.cos(b) / de;
    return this.fixPrecision(a, 5);
  }

  // определение внешней делительной толщины зуба шестерни по хорде
  function_27 () {
    const a = this.de1 * Math.sin( this.we1) / Math.cos(this.vr);
    return this.fixPrecision(a, 4);
  }

  // определение высоты до внешней делительной хорды зуба шестерни
  function_28(): number {
    const a = this.hae1 + 0.25 * this.Se1 * this.we1;
    return this.fixPrecision(a, 4);
  }

  // определение внешней делительной толщины зуба колеса по хорде (при х1 <= 0,4)
  function_29() {
    if (this.x1 <= 0.4) {
      const a = this.de2 / Math.cos(this.Vr) * Math.sin(this.we2);
      return this.fixPrecision(a, 4);
    }
  }

  // определение диаметра концентрической окружности
  function_30(): number {
    const a = this.de2 - this.Me * Math.cos(this.Vr);
    return this.fixPrecision(a, 4);
  }

  // определение внешней делительной толщины зуба колеса по хорде на концентрической окружности (при х1 > 0,4)
  function_31() {
    if (this.x1 > 0.4) {
      const a = this.dye2 / Math.cos(this.Vr)  * Math.sin(this.we2) + Math.tan(20 * Math.PI / 180) * this.Me;
      return this.fixPrecision(a, 4);
    }
  }

  // установление точности производимых расчётов, т.е. количества знаков после запятой
  fixPrecision( n: number, i: number): number {
    const a = Math.pow( 10, i);
    return Math.round( n * a) / a;
  }

  // форматирование результата вычисления в градусы и минуты
  getDegrees(r: number): any {
    const g = Math.floor(r); // округляем до целого числа в меньшую сторону, получаем число градусов
    const b = (r - g) * 60; // получаем дробную часть и переводим её в минуты
    const m = this.fixPrecision(b, 0); // округляем минуты до целого числа
    return {g: g, m: m};
  }

 goToForm(): void {
     this.router.navigate(['../form'], { relativeTo: this.route });
 }
}
