interface InitialDataInterface {
    z1: number; // число зубьев шестерни
    z2: number; // число зубьев колеса
    Me: number; // внешний окружной модуль
    E: number; // межосевой угол передачи
}

export class InitialData implements InitialDataInterface {
    constructor (
        public z1: number,
        public z2: number,
        public Me: number,
        public E: number
    ) {}
}