export class AnimacionViaje {
    // Si existe una instancia creada retornaremos la misma instancia
    // con esto aseguramos el patron de diseño SINGLETON
    private static _intance: AnimacionViaje;

    private count: number = 0;
    private arrayLatLng: number[] = [];
    private flag = false;

    constructor() {

    }

    // patron singleton
    // para asegurarnos que solo haya una instancia en todo el proyecto.
    public static get instance() {
        // si ya existe una instancia, regrese esa instancia,
        // sino existe crear una nueva instancia y será unica
        return this._intance || (this._intance = new this());
    }

    

    async ejecutor() {

        let timer;

        if (this.flag === true) {

            timer = await setTimeout(() => { 
                this.ejecutor();
            }, 2000);

            console.log('ejecutor: ', this.flag);
            console.log('se esta ejecutando animacion de viaje: ', this.count+=1);

            // actualizamos la bandera
            this.flag = true;
        } else {
            console.log('x: ', this.flag);
        }
        
    }

    // iniciar/continuar animacion
    play() {
        console.log('se ha iniciado o  continuado animacion de viaje');
        this.flag = true;
        this.ejecutor();
    } 

    // pausar animacion
    pause() {
        console.log('se ha pausado animacion de viaje');
        this.flag = false;
        this.ejecutor();
    }
    
    // terminar animacion
    stop() {
        console.log('se ha detenido animacion de viaje');
        this.flag = false;
        this.ejecutor();
    }
}
