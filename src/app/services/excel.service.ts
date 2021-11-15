import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor() { }

    // ----------------------------------------------- exportar datos generales -----------------------------
    public exportAsExcelFile(json: any[], excelFileName: string): void {
    // tslint:disable-next-line: forin
    let nuevoDatos: any[] = [];
    // tslint:disable-next-line: forin
    for (let j in json) {
        json[j].event_time = moment.utc(json[j].event_time).local().format('YYYY-MM-DD HH:mm:ss');
        json[j].system_time = moment.utc(json[j].system_time).local().format('YYYY-MM-DD HH:mm:ss');
        let obj = {
                    imei: json[j].imei,
                    nombre_vehiculo: json[j].nombre_vehiculo,
                    event_time: json[j].event_time,
                    etiqueta: json[j].etiqueta,
                    evento: json[j].evento,
                    SA: json[j].SA,
                    lat: json[j].lat,
                    lng: json[j].lng,
                    address: json[j].address,
                    system_time: json[j].system_time,
                    id: json[j].id,
                    vel: json[j].vel,
                    direccion: json[j].direccion,
                    modo_adqui: json[j].modo_adqui,
                    calidad_datos: json[j].calidad_datos,
                    SV: json[j].SV,
                    BL: json[j].BL,
                    DOP: json[j].DOP,
                    CF: json[j].CF,
                    AL: json[j].AL,
                    AC: json[j].AC,
                    IX: json[j].IX,
                    TI: json[j].TI,
                    CE: json[j].CE,
                    CL: json[j].CL,
                    CS: json[j].CS,
                    VO: json[j].VO,
                    SC: json[j].SC,
                    PS00: json[j].PS00,
                    RE: json[j].RE,
                    movimiento: json[j].movimiento,
                    desde: json[j].desde,
                    hasta: json[j].hasta,
                    nombre: json[j].nombre,
                    AD: json[j].AD
        };
        nuevoDatos.push(obj);
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(nuevoDatos);
    // tslint:disable-next-line: object-literal-key-quotes
    const workbook: XLSX.WorkBook = {
                                        Sheets: {
                                            'data': worksheet
                                        },
                                        SheetNames: ['data']
                                    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
        FileSaver.saveAs(data, fileName + '_datos_generales_' + new  Date().getTime() + EXCEL_EXTENSION);
    }

    // ----------------------------------------------- exportar datos rutas -----------------------------
    public exportAsExcelRoutReport(json: any[], tercerReporte, cuartoReporte, excelFileName: string, nombreGrupo: string) {
        console.log('datos procesados exportable: ', json);
        /*let nuevoDatos = [{

        }];

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(nuevoDatos);
        
        const workbook: XLSX.WorkBook = {
            Sheets: {
                'hoja1': worksheet
            },
            SheetNames: ['hoja1']
        };*/
        // ******************************************************************
        //
        // pasos para crear un archivo excel
        //
        // ******************************************************************
        /* crear un nuevo libro de trabajo en blanco */
        // var wb = XLSX.utils.book_new();

        /* Nombre del libro */
        // var ws_name = "SheetJS";
 
        /* Hacer la hora de trabajo */
        /*var ws_data = [
            [ "S", "h", "e", "e", "t", "J", "S" ],
            [  1 ,  2 ,  3 ,  4 ,  5 ],
            [],
            ['datro','dato 2', 'dato 3', 'dato4', 'dato5']
        ];*/

        /* Convertimos un array en un libro */
        // var ws = XLSX.utils.aoa_to_sheet(ws_data);
        // ws['D20'].v = 'NEW VALUE from NODE';

        /* Write data starting at A2 */
        // XLSX.utils.sheet_add_aoa(ws, [[1,2], [2,3], [3,4]], {origin: "A10"});
        
        /* Agregue la hoja de trabajo al libro de trabajo */
        // XLSX.utils.book_append_sheet(wb, ws, ws_name);

        /* Escribir en excel */
        // const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // exportar archivo
        // this.saveAsExcelRoutReport(excelBuffer, excelFileName);

        // ******************************************************************
        //
        // pasos para crear un archivo excel
        //
        // ******************************************************************
        /* notice the hole where cell "B1" would be */
        
        // Reporte 1
        let dataReporte1 = [
            ['VARIANCE REPORTS - DAILY VISITS SCHEDULE'],
            [`${nombreGrupo}`],
            ['DAILY SCHEDULED STOPS'],
            ['************************************************************************************************************************'],
            []
        ];

        // Reporte 2
        let dataReporte2 = [
            ['VARIANCE REPORTS - STOPS MADE OUTSIDE OF DAILY SCHEDULE'],
            [`${nombreGrupo}`],
            ['STOPS MADE OUTSIDE OF DAILY SCHEDULE'],
            ['************************************************************************************************************************'],
            []
        ];

        // Reporte 3
        let dataReporte3 = [
            ['VARIANCE REPORTS - TOTAL STOP FOR THE WEEK'],
            [`${nombreGrupo}`],
            ['TOTAL STOP FOR THE WEEK'],
            ['************************************************************************************************************************'],
            []
        ];

        // Reporte 4
        let dataReporte4 = [
            ['VARIANCE REPORTS - TOTAL STOP FOR THE WEEK'],
            [`${nombreGrupo}`],
            ['TOTAL STOP FOR THE WEEK'],
            ['************************************************************************************************************************'],
            []
        ];

        // llenamos el primero reporte con una iteración
        for (const paradasDentroRuta of json) {
            // reporte 1

            const totalesAsignadasRuta = (paradasDentroRuta.c_domingo +
                                        paradasDentroRuta.c_lunes +
                                        paradasDentroRuta.c_martes +
                                        paradasDentroRuta.c_miercoles +
                                        paradasDentroRuta.c_jueves +
                                        paradasDentroRuta.c_viernes +
                                        paradasDentroRuta.c_sabado);
            dataReporte1.push(['___________________________________________________________________________________________________________________________________']);
            dataReporte1.push(['DRIVER', `${paradasDentroRuta.nombre_conductor}`, , , , , , ,'FROM', `${moment(paradasDentroRuta.fecha_inicio).format('YYYY-MM-DD')}`]);
            dataReporte1.push(['VEHICLE', `${paradasDentroRuta.nombre_vehiculo}`, , , , , , ,'TO', `${moment(paradasDentroRuta.fecha_final).format('YYYY-MM-DD')}`]);
            dataReporte1.push([]);
            dataReporte1.push([ , , , , 'Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday', 'total']);
            dataReporte1.push(['Scheduled Customer Stops', , , , `${ paradasDentroRuta.c_domingo}`,
                                                                 `${ paradasDentroRuta.c_lunes}`, 
                                                                 `${ paradasDentroRuta.c_martes}`,
                                                                 `${ paradasDentroRuta.c_miercoles}`, 
                                                                 `${ paradasDentroRuta.c_jueves}`, 
                                                                 `${ paradasDentroRuta.c_viernes}`, 
                                                                 `${ paradasDentroRuta.c_sabado}`,
                                                                 `${ totalesAsignadasRuta }`]);

            const sumVDR = (this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,0) +
                            this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,1) +
                            this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,2) +
                            this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,3) +
                            this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,4) +
                            this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,5) +
                            this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,6));
    
            dataReporte1.push(['Actual Number of Scheduled Stops Made', , , , 
                                `${this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,0)}`, 
                                `${this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,1)}`, 
                                `${this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,2)}`,
                                `${this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,3)}`, 
                                `${this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,4)}`, 
                                `${this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,5)}`, 
                                `${this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,6)}`, 
                                `${sumVDR}`]);
            const value1 = parseFloat(String((this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,0)/paradasDentroRuta.c_domingo)*100)).toFixed(2);
            const value2 = parseFloat(String((this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,1)/paradasDentroRuta.c_lunes)*100)).toFixed(2);
            const value3 = parseFloat(String((this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,2)/paradasDentroRuta.c_martes)*100)).toFixed(2);
            const value4 = parseFloat(String((this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,3)/paradasDentroRuta.c_miercoles)*100)).toFixed(2);
            const value5 = parseFloat(String((this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,4)/paradasDentroRuta.c_jueves)*100)).toFixed(2);
            const value6 = parseFloat(String((this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,5)/paradasDentroRuta.c_viernes)*100)).toFixed(2);
            const value7 = parseFloat(String((this.sumatoriaVisitadaDentroRuta(paradasDentroRuta.paradas_dentro_ruta,6)/paradasDentroRuta.c_sabado)*100)).toFixed(2);
           

            dataReporte1.push(['total', , , ,
                                `${ value1 } %`, 
                                `${ value2 } %`, 
                                `${ value3 } %`,
                                `${ value4 } %`, 
                                `${ value5 } %`, 
                                `${ value6 } %`, 
                                `${ value7 } %`, 
                                `${ parseFloat(String((sumVDR/totalesAsignadasRuta)*100)).toFixed(2) } %`]);
            dataReporte1.push(['___________________________________________________________________________________________________________________________________']);
            dataReporte1.push([]);
            dataReporte1.push([]);
            dataReporte1.push([]);


            // reporte 2
            dataReporte2.push(['___________________________________________________________________________________________________________________________________']);
            dataReporte2.push(['DRIVER', `${paradasDentroRuta.nombre_conductor}`, , , , , , ,'FROM', `${moment(paradasDentroRuta.fecha_inicio).format('YYYY-MM-DD')}`]);
            dataReporte2.push(['VEHICLE', `${paradasDentroRuta.nombre_vehiculo}`, , , , , , ,'TO', `${moment(paradasDentroRuta.fecha_final).format('YYYY-MM-DD')}`]);
            dataReporte2.push([]);
            dataReporte2.push([ , , , , 'Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday', 'total']);

            const totalRef = (this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,0) +
                            this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,1) +
                            this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,2) +
                            this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,3) +
                            this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,4) +
                            this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,5) +
                            this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,6)
                            );

            dataReporte2.push(['Referenced', , , , 
                                `${this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,0)}`, 
                                `${this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,1)}`, 
                                `${this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,2)}`,
                                `${this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,3)}`, 
                                `${this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,4)}`, 
                                `${this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,5)}`, 
                                `${this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,6)}`, 
                                 `${totalRef}`]);
            
            const totalNoRef = (this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,0) +
                                this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,1) +
                                this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,2) +
                                this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,3) +
                                this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,4) +
                                this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,5) +
                                this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,6)
                            );
            dataReporte2.push(['No-referenced', , , ,
                                `${this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,0)}`, 
                                `${this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,1)}`, 
                                `${this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,2)}`,
                                `${this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,3)}`, 
                                `${this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,4)}`, 
                                `${this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,5)}`, 
                                `${this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,6)}`, 
                                `${totalNoRef}`]);
            dataReporte2.push(['total', , , ,
                                `${this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,0) + this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,0)}`, 
                                `${this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,1) + this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,1)}`, 
                                `${this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,2) + this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,2)}`,
                                `${this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,3) + this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,3)}`, 
                                `${this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,4) + this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,4)}`, 
                                `${this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,5) + this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,5)}`, 
                                `${this.sumatoriaVisitadaFueraRutaNoref(paradasDentroRuta.paradas_fuera_ruta_noref,6) + this.sumatoriaVisitadaFueraRutaRef(paradasDentroRuta.paradas_fuera_ruta_ref,6)}`, 
                                `${(totalRef + totalNoRef)}`]);
            dataReporte2.push(['___________________________________________________________________________________________________________________________________']);
            dataReporte2.push([]);
            dataReporte2.push([]);
            dataReporte2.push([]); 

        }
        
        for (const tercer of tercerReporte) {
            // Reporte 3
            dataReporte3.push(['_________________________________________________________________________________________________________________________________________________________']);
            dataReporte3.push(['DRIVER', `${tercer.nombre_conductor}`, , , , , , ,'FROM', `${moment(tercer.fecha_inicio).format('YYYY-MM-DD')}`]);
            dataReporte3.push(['VEHICLE', `${tercer.nombre_vehiculo}`, , , , , , ,'TO', `${moment(tercer.fecha_final).format('YYYY-MM-DD')}`]);
            dataReporte3.push([]);
            dataReporte3.push([ , , , , 'Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday', 'total', 'Average per day']);
            
            const sumaTercerRef = ( tercer.suma_referenciadas_domingo+
                                    tercer.suma_referenciadas_lunes+
                                    tercer.suma_referenciadas_martes+
                                    tercer.suma_referenciadas_miercoles+
                                    tercer.suma_referenciadas_jueves+
                                    tercer.suma_referenciadas_viernes+
                                    tercer.suma_referenciadas_sabado
                                );
            
            let numPromedioRef = 0
            if (tercer.suma_referenciadas_domingo > 0) {
                numPromedioRef += 1;
            }
            if (tercer.suma_referenciadas_lunes > 0) {
                numPromedioRef += 1;
            }
            if (tercer.suma_referenciadas_martes > 0) {
                numPromedioRef += 1;
            }
            if (tercer.suma_referenciadas_miercoles > 0) {
                numPromedioRef += 1;
            }
            if (tercer.suma_referenciadas_jueves > 0) {
                numPromedioRef += 1;
            }
            if (tercer.suma_referenciadas_viernes > 0) {
                numPromedioRef += 1;
            }
            if (tercer.suma_referenciadas_sabado > 0) {
                numPromedioRef += 1;
            }
            
            const promRef = Math.floor(sumaTercerRef / numPromedioRef);

            dataReporte3.push(['Total Stops referenced', , , , 
                                `${tercer.suma_referenciadas_domingo}`, 
                                `${tercer.suma_referenciadas_lunes}`, 
                                `${tercer.suma_referenciadas_martes}`,
                                `${tercer.suma_referenciadas_miercoles}`, 
                                `${tercer.suma_referenciadas_jueves}`, 
                                `${tercer.suma_referenciadas_viernes}`, 
                                `${tercer.suma_referenciadas_sabado}`, 
                                `${sumaTercerRef}`,
                                `${promRef}`]);

            const sumaTercerNoRef = ( tercer.suma_noreferenciada_domingo+
                                    tercer.suma_noreferenciada_lunes+
                                    tercer.suma_noreferenciada_martes+
                                    tercer.suma_noreferenciada_miercoles+
                                    tercer.suma_noreferenciada_jueves+
                                    tercer.suma_noreferenciada_viernes+
                                    tercer.suma_noreferenciada_sabado
                                );
            
            
            const promNoRef = Math.floor(sumaTercerNoRef / numPromedioRef);

            dataReporte3.push(['Total Stops Non-referenced', , , ,
                                `${tercer.suma_noreferenciada_domingo}`, 
                                `${tercer.suma_noreferenciada_lunes}`, 
                                `${tercer.suma_noreferenciada_martes}`,
                                `${tercer.suma_noreferenciada_miercoles}`, 
                                `${tercer.suma_noreferenciada_jueves}`, 
                                `${tercer.suma_noreferenciada_viernes}`, 
                                `${tercer.suma_noreferenciada_sabado}`, 
                                `${sumaTercerNoRef}`,
                                `${promNoRef}`]);
            dataReporte3.push(['total', , , ,
                                `${tercer.suma_referenciadas_domingo + tercer.suma_noreferenciada_domingo}`, 
                                `${tercer.suma_referenciadas_lunes + tercer.suma_noreferenciada_lunes}`, 
                                `${tercer.suma_referenciadas_martes + tercer.suma_noreferenciada_martes}`,
                                `${tercer.suma_referenciadas_miercoles + tercer.suma_noreferenciada_miercoles}`, 
                                `${tercer.suma_referenciadas_jueves + tercer.suma_noreferenciada_jueves}`, 
                                `${tercer.suma_referenciadas_viernes + tercer.suma_noreferenciada_viernes}`, 
                                `${tercer.suma_referenciadas_sabado + tercer.suma_noreferenciada_sabado}`, 
                                `${sumaTercerRef+sumaTercerNoRef}`,
                                `${promRef+promNoRef}`]);
            dataReporte3.push(['_________________________________________________________________________________________________________________________________________________________']);
            dataReporte3.push([]);
            dataReporte3.push([]);
            dataReporte3.push([]); 
        }

        for (const cuarto of cuartoReporte) {
            // Reporte 4
            dataReporte4.push(['___________________________________________________________________________________________________________________________________']);
            dataReporte4.push(['DRIVER', `${cuarto.nombre_conductor}`, , , , , , ,'FROM', `${moment(cuarto.fecha_inicio).format('YYYY-MM-DD')}`]);
            dataReporte4.push(['VEHICLE', `${cuarto.nombre_vehiculo}`, , , , , , ,'TO', `${moment(cuarto.fecha_final).format('YYYY-MM-DD')}`]);
            dataReporte4.push([]);
            dataReporte4.push([ , , , , 'Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday', 'total']);
            const cuartoTotalRef = (cuarto.total_paradas_domingo +
                                    cuarto.total_paradas_lunes +
                                    cuarto.total_paradas_martes +
                                    cuarto.total_paradas_miercoles +
                                    cuarto.total_paradas_jueves +
                                    cuarto.total_paradas_viernes +
                                    cuarto.total_paradas_sabado);
            dataReporte4.push(['Total Stops referenced', , , , 
                                `${cuarto.total_paradas_domingo}`, 
                                `${cuarto.total_paradas_lunes}`, 
                                `${cuarto.total_paradas_martes}`,
                                `${cuarto.total_paradas_miercoles}`, 
                                `${cuarto.total_paradas_jueves}`, 
                                `${cuarto.total_paradas_viernes}`, 
                                `${cuarto.total_paradas_sabado}`, 
                                `${cuartoTotalRef}`]);

            const cuartoTotalNoRef = (cuarto.total_paradas_fuera_ruta_domingo +
                                    cuarto.total_paradas_fuera_ruta_lunes +
                                    cuarto.total_paradas_fuera_ruta_martes +
                                    cuarto.total_paradas_fuera_ruta_miercoles +
                                    cuarto.total_paradas_fuera_ruta_jueves +
                                    cuarto.total_paradas_fuera_ruta_viernes +
                                    cuarto.total_paradas_fuera_ruta_sabado);

            dataReporte4.push(['Total Stops Non-referenced', , , ,
                                `${cuarto.total_paradas_fuera_ruta_domingo}`, 
                                `${cuarto.total_paradas_fuera_ruta_lunes}`, 
                                `${cuarto.total_paradas_fuera_ruta_martes}`,
                                `${cuarto.total_paradas_fuera_ruta_miercoles}`, 
                                `${cuarto.total_paradas_fuera_ruta_jueves}`, 
                                `${cuarto.total_paradas_fuera_ruta_viernes}`, 
                                `${cuarto.total_paradas_fuera_ruta_sabado}`, 
                                `${cuartoTotalNoRef}`]);
            
            const value1 = parseFloat(String(cuarto.total_paradas_fuera_ruta_domingo/cuarto.total_paradas_domingo*100)).toFixed(2);
            const value2 = parseFloat(String(cuarto.total_paradas_fuera_ruta_lunes/cuarto.total_paradas_lunes*100)).toFixed(2);
            const value3 = parseFloat(String(cuarto.total_paradas_fuera_ruta_martes/cuarto.total_paradas_martes*100)).toFixed(2);
            const value4 = parseFloat(String(cuarto.total_paradas_fuera_ruta_miercoles/cuarto.total_paradas_miercoles*100)).toFixed(2);
            const value5 = parseFloat(String(cuarto.total_paradas_fuera_ruta_jueves/cuarto.total_paradas_jueves*100)).toFixed(2);
            const value6 = parseFloat(String(cuarto.total_paradas_fuera_ruta_viernes/cuarto.total_paradas_viernes*100)).toFixed(2);
            const value7 = parseFloat(String(cuarto.total_paradas_fuera_ruta_sabado/cuarto.total_paradas_sabado*100)).toFixed(2);                    
            const totalCuarto = parseFloat(String(cuartoTotalNoRef/cuartoTotalRef*100)).toFixed(2)
            
            dataReporte4.push(['total', , , ,
                                `${value1} %`, 
                                `${value2} %`, 
                                `${value3} %`,
                                `${value4} %`, 
                                `${value5} %`, 
                                `${value6} %`, 
                                `${value7} %`, 
                                `${totalCuarto} %`]);
            dataReporte4.push(['___________________________________________________________________________________________________________________________________']);
            dataReporte4.push([]);
            dataReporte4.push([]);
            dataReporte4.push([]); 
        }

        /* merge cells A1:B1 */
        // var merge = { s: {r:0, c:0}, e: {r:0, c:1} };
        var merge = XLSX.utils.decode_range("A1:K1"); // this is equivalent
        var merge11 = XLSX.utils.decode_range("A2:K2"); // this is equivalent
        var merge12 = XLSX.utils.decode_range("A3:K3"); // this is equivalent
        var merge2 = XLSX.utils.decode_range("A5:K5"); // this is equivalent
        

        //repetitivo
        var merge4 = XLSX.utils.decode_range("B7:D7"); // this is equivalent
        var merge8 = XLSX.utils.decode_range("B8:D8"); // this is equivalent
        var merge9 = XLSX.utils.decode_range("J7:K7"); // this is equivalent
        var merge10 = XLSX.utils.decode_range("J8:K8"); // this is equivalent

        var merge5 = XLSX.utils.decode_range("A11:D11"); // this is equivalent
        var merge6 = XLSX.utils.decode_range("A12:D12"); // this is equivalent
        var merge7 = XLSX.utils.decode_range("A13:D13"); // this is equivalent
        
        /* generate worksheet */
        let ws = XLSX.utils.aoa_to_sheet(dataReporte1);
        let ws2 = XLSX.utils.aoa_to_sheet(dataReporte2);
        let ws3 = XLSX.utils.aoa_to_sheet(dataReporte3);
        let ws4 = XLSX.utils.aoa_to_sheet(dataReporte4);
        
        /* add merges */
        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push(merge);

        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push(merge2);

        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push(merge4);

        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push(merge5);

        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push(merge6);

        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push(merge7);

        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push(merge8);
        
        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push(merge9);
        
        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push(merge10);

        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push(merge11);

        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push(merge12);

        // fin de iteracion

        /* generate workbook */
        var wb = XLSX.utils.book_new();

        // agregar nuevo libro a excel
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.utils.book_append_sheet(wb, ws2, "sheet2");
        XLSX.utils.book_append_sheet(wb, ws3, "sheet3");
        XLSX.utils.book_append_sheet(wb, ws4, "sheet4");

        /* Escribir en excel */
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // exportar archivo
        this.saveAsExcelRoutReport(excelBuffer, excelFileName);
    }

    public saveAsExcelRoutReport(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
        FileSaver.saveAs(data, fileName + '_' + new  Date().getTime() + EXCEL_EXTENSION);
    }

    // ----------------------------------------------- exportar datos -----------------------------

    sumatoriaVisitadaDentroRuta(paradasDentroRuta: any[], dia: number): any {
        let sum = 0;
        if (paradasDentroRuta !== undefined || paradasDentroRuta !== null) {
            for (const j of paradasDentroRuta) {
                if (j.dia === dia) {
                    sum += 1;
                }
            }
        }
        return sum;
    }

    sumatoriaVisitadaFueraRutaRef(paradasFueraRutaRef: any[], dia: number): any {
        let sum = 0;
        // console.log('ITERAR FUERA RUTA REF: ', paradasFueraRutaRef);
        if (paradasFueraRutaRef) {
            for (const j of paradasFueraRutaRef) {
                if (dia === -1) {
                    sum += 1;
                } else {
                    if (j.dia === dia) {
                        sum += 1;
                    }
                }
            }
        }
        return sum;
    }

    sumatoriaVisitadaFueraRutaNoref(paradasFueraRutaNoRef: any[], dia: number): any {
        let sum = 0;
        if (paradasFueraRutaNoRef !== undefined || paradasFueraRutaNoRef !== null) {
            for (const j of paradasFueraRutaNoRef) {

                if (dia === -1) {
                    sum += 1;
                } else {
                    const date1 = moment(j.event_time);
                    const dow1 = date1.day();
                    if (dow1 === dia) {
                        sum += 1;
                    }
                }
            }
        }

        return sum;
    }
}
