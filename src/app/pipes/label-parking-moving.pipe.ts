import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'labelParkingMoving'
})
export class LabelParkingMovingPipe implements PipeTransform {

    transform(ign: string, timer: any, texto1: any, texto2: string, texto3: string): unknown {
        if (ign === 'on') {
            return this.tiempoMovimiento(ign, timer, texto1, texto2)
        } else {
            return this.tiempoParqueo(ign, timer, texto1, texto2, texto3)
        }
    }

    public tiempoMovimiento(ign: string, timerMoving: number, texto1: string, texto2: string): string {
        // console.log('tiempo movimiento gggg: ', timerMoving);
        if (ign === 'on') {
            if (timerMoving === 0) {
                return texto1;
            } else {
                if (timerMoving >= 60 && timerMoving <= 3600) {
                    if (Math.trunc((timerMoving / 60)) === 1) {
                        return texto2 + ' ' + Math.trunc((timerMoving / 60)) + ' min';
                    } else {
                        return texto2 + ' ' + Math.trunc((timerMoving / 60)) + ' min';
                    }
                } else {
                    if (timerMoving > 3600 && timerMoving <= 86400) {
                        if (Math.trunc((timerMoving / 3600)) === 1) {
                            let hour = Math.floor(timerMoving / 3600);
                            hour = Number((hour < 10) ? '0' + hour : hour);
                            let minute = Math.floor((timerMoving / 60) % 60);
                            minute = Number((minute < 10) ? '0' + minute : minute);
                            let second = timerMoving % 60;
                            second = Number((second < 10) ? '0' + second : second);
                            return texto2 + ' ' + Math.trunc((timerMoving / 3600)) + ' h ' + minute + ' min';
                        } else {
                            let hour = Math.floor(timerMoving / 3600);
                            hour = Number((hour < 10) ? '0' + hour : hour);
                            let minute = Math.floor((timerMoving / 60) % 60);
                            minute = Number((minute < 10) ? '0' + minute : minute);
                            let second = timerMoving % 60;
                            second = Number((second < 10) ? '0' + second : second);
                            return texto2 + ' ' + Math.trunc((timerMoving / 3600)) + ' h ' + minute + ' min';
                        }
                    } else {
                        const numdays = Math.floor(timerMoving / 86400);
                        const numhours = Math.floor((timerMoving % 86400) / 3600);
                        const numminutes = Math.floor(((timerMoving % 86400) % 3600) / 60);
                        const numseconds = ((timerMoving % 86400) % 3600) % 60;
                        if (numdays === 1) {
                            return texto2 + ' ' + numdays + ' d ' + numhours + ' h ';
                        } else {
                            return texto2 + ' ' + numdays + ' d ' + numhours + ' h ';
                        }
                    }
                }
            }
        } else {
            return '';
        }
    }

    public tiempoParqueo(ign: string, timerParking: number, text1: string, text2: string, text3: string): string {
        // console.log('tiempo parqueo kkk: ', timerParking);
        if (ign === 'off') {
            if (timerParking === 0) {
                return text1;
            } else {
                if (timerParking >= 60 && timerParking <= 3600) {
                    if (Math.trunc((timerParking / 60)) === 1) {
                        return text2 + ' ' + Math.trunc((timerParking / 60)) + ' min';
                    } else {
                        return text2 + ' ' + Math.trunc((timerParking / 60)) + ' min';
                    }
                } else {
                if (timerParking > 3600 && timerParking <= 86400) {
                    if (Math.trunc((timerParking / 3600)) === 1) {
                        let hour = Math.floor(timerParking / 3600);
                        hour = Number((hour < 10) ? '0' + hour : hour);
                        let minute = Math.floor((timerParking / 60) % 60);
                        minute = Number((minute < 10) ? '0' + minute : minute);
                        let second = timerParking % 60;
                        second = Number((second < 10) ? '0' + second : second);
                        // return hour + ':' + minute + ':' + second;
                        return text2 + ' ' + hour + ' h ' + minute + ' min';
                    } else {
                        let hour = Math.floor(timerParking / 3600);
                        hour = Number((hour < 10) ? '0' + hour : hour);
                        let minute = Math.floor((timerParking / 60) % 60);
                        minute = Number((minute < 10) ? '0' + minute : minute);
                        let second = timerParking % 60;
                        second = Number((second < 10) ? '0' + second : second);
                        return text2 + ' ' + hour + ' h ' + minute + ' min';
                    }
                } else {
                        var numdays = Math.floor(timerParking / 86400);
                        var numhours = Math.floor((timerParking % 86400) / 3600);
                        var numminutes = Math.floor(((timerParking % 86400) % 3600) / 60);
                        var numseconds = ((timerParking % 86400) % 3600) % 60;
                        if (numdays === 1) {
                            return text2 + ' ' + numdays + ' d ' + numhours + ' h';
                        } else {
                            return text2 + ' ' + numdays + ' d ' + numhours + ' h';
                        }
                    }
                }
            }
        } else {
            return text3;
        }
    }

}
