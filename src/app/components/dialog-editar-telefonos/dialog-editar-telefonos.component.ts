import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import PhoneNumber from 'awesome-phonenumber';
import PhoneNumber2 from 'awesome-phonenumber';
import PhoneNumber3 from 'awesome-phonenumber';
import PhoneNumber4 from 'awesome-phonenumber';
import PhoneNumber5 from 'awesome-phonenumber';
import { ISO_3166_1_CODES } from 'src/app/data/codigoCiudades';
import { PhoneErrorMatcher, phoneValidator } from 'src/app/classes/Phone';
import { FormBuilder, FormControl } from '@angular/forms';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Component({
  selector: 'app-dialog-editar-telefonos',
  templateUrl: './dialog-editar-telefonos.component.html',
  styleUrls: ['./dialog-editar-telefonos.component.css']
})
export class DialogEditarTelefonosComponent implements OnInit {

    /***************************************/
    // TELEFONO 1
    countyCodes = ISO_3166_1_CODES;
    profileForm = this.fb.group({
        phone: this.fb.group({
            country: ['SV'],
            number: [''],
            id:['0'],
            id_usuario:['0']
        }, {validators: phoneValidator})
    });
    phoneErrorMatcher = new PhoneErrorMatcher();
    /***************************************/
    /***************************************/
    // TELEFONO 2
    countyCodes2 = ISO_3166_1_CODES;
    profileForm2 = this.fb.group({
        phone: this.fb.group({
            country: ['SV'],
            number: [''],
            id:['0'],
            id_usuario:['0']
        }, {validators: phoneValidator})
    });
    phoneErrorMatcher2 = new PhoneErrorMatcher();
    /***************************************/
    /***************************************/
    // TELEFONO 3
    countyCodes3 = ISO_3166_1_CODES;
    profileForm3 = this.fb.group({
        phone: this.fb.group({
            country: ['SV'],
            number: [''],
            id:['0'],
            id_usuario:['0']
        }, {validators: phoneValidator})
    });
    phoneErrorMatcher3 = new PhoneErrorMatcher();
    /***************************************/
    /***************************************/
    // TELEFONO 4
    countyCodes4 = ISO_3166_1_CODES;
    profileForm4 = this.fb.group({
        phone: this.fb.group({
            country: ['SV'],
            number: [''],
            id:['0'],
            id_usuario:['0']
        }, {validators: phoneValidator})
    });
    phoneErrorMatcher4 = new PhoneErrorMatcher();
    /***************************************/
    /***************************************/
    // TELEFONO 5
    countyCodes5 = ISO_3166_1_CODES;
    profileForm5 = this.fb.group({
        phone: this.fb.group({
            country: ['SV'],
            number: [''],
            id:['0'],
            id_usuario:['0']
        }, {validators: phoneValidator})
    });
    phoneErrorMatcher5 = new PhoneErrorMatcher();
    /***************************************/

    public idUsuario: number = 0;

    constructor(public dialogRef: MatDialogRef<DialogEditarTelefonosComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService,
                private fb: FormBuilder,
                private dialog: MatDialog) { }

    ngOnInit(): void {
        console.log('datos usuario', this.data);
        console.log('telefonos: ',JSON.parse(this.data.telefonos));
        
        const telefonos = JSON.parse(this.data.telefonos);
        this.idUsuario = this.data.id_usuario;

        switch(JSON.parse(this.data.telefonos).length) {
            case 0:
                console.log('ninguno');
                break;
            case 1:
                // console.log('uno:', telefonos[0].codigo_pais + telefonos[0].codigo_ciudad + telefonos[0].telefono);
                // inicializar valores por defecto telefono 1
                var pn1 = new PhoneNumber( 
                            telefonos[0].codigo_pais + telefonos[0].codigo_ciudad + telefonos[0].telefono, 
                            telefonos[0].codigo 
                        );
                this.profileForm.get('phone').setValue({
                                                        number:pn1.getNumber('significant'),
                                                        country: pn1.getRegionCode(),
                                                        id: telefonos[0].id,
                                                        id_usuario: telefonos[0].id_usuario
                                                    });
                // console.log('form: ', this.profileForm);
                break;
            case 2:
                // console.log('dos');
                // inicializar valores por defecto telefono 1
                var pn1 = new PhoneNumber( 
                    telefonos[0].codigo_pais + telefonos[0].codigo_ciudad + telefonos[0].telefono, 
                    telefonos[0].codigo 
                );
                this.profileForm.get('phone').setValue({
                                                        number:pn1.getNumber('significant'),
                                                        country: pn1.getRegionCode(),
                                                        id: telefonos[0].id,
                                                        id_usuario: telefonos[0].id_usuario
                                                    });
                
                // inicializar valores por defecto telefono 2
                var pn2 = new PhoneNumber( 
                    telefonos[1].codigo_pais + telefonos[1].codigo_ciudad + telefonos[1].telefono, 
                    telefonos[1].codigo 
                );
                this.profileForm2.get('phone').setValue({
                                                        number:pn2.getNumber('significant'),
                                                        country: pn2.getRegionCode(),
                                                        id: telefonos[1].id,
                                                        id_usuario: telefonos[1].id_usuario
                                                    });
                break;
            case 3:
                console.log('tres');
                // inicializar valores por defecto telefono 1
                var pn1 = new PhoneNumber( 
                    telefonos[0].codigo_pais + telefonos[0].codigo_ciudad + telefonos[0].telefono, 
                    telefonos[0].codigo 
                );
                this.profileForm.get('phone').setValue({
                                                        number:pn1.getNumber('significant'),
                                                        country: pn1.getRegionCode(),
                                                        id: telefonos[0].id,
                                                        id_usuario: telefonos[0].id_usuario
                                                    });
                
                // inicializar valores por defecto telefono 2
                var pn2 = new PhoneNumber( 
                    telefonos[1].codigo_pais + telefonos[1].codigo_ciudad + telefonos[1].telefono, 
                    telefonos[1].codigo 
                );
                this.profileForm2.get('phone').setValue({
                                                        number:pn2.getNumber('significant'),
                                                        country: pn2.getRegionCode(),
                                                        id: telefonos[1].id,
                                                        id_usuario: telefonos[1].id_usuario
                                                    });

                // inicializar valores por defecto telefono 3
                var pn3 = new PhoneNumber( 
                    telefonos[2].codigo_pais + telefonos[2].codigo_ciudad + telefonos[2].telefono, 
                    telefonos[2].codigo 
                );
                this.profileForm3.get('phone').setValue({
                                                        number:pn3.getNumber('significant'),
                                                        country: pn3.getRegionCode(),
                                                        id: telefonos[2].id,
                                                        id_usuario: telefonos[2].id_usuario
                                                    });
                break;
            case 4:
                console.log('cuatro');
                // inicializar valores por defecto telefono 1
                var pn1 = new PhoneNumber( 
                    telefonos[0].codigo_pais + telefonos[0].codigo_ciudad + telefonos[0].telefono, 
                    telefonos[0].codigo 
                );
                this.profileForm.get('phone').setValue({
                                                        number:pn1.getNumber('significant'),
                                                        country: pn1.getRegionCode(),
                                                        id: telefonos[0].id,
                                                        id_usuario: telefonos[0].id_usuario
                                                    });
                
                // inicializar valores por defecto telefono 2
                var pn2 = new PhoneNumber( 
                    telefonos[1].codigo_pais + telefonos[1].codigo_ciudad + telefonos[1].telefono, 
                    telefonos[1].codigo 
                );
                this.profileForm2.get('phone').setValue({
                                                        number:pn2.getNumber('significant'),
                                                        country: pn2.getRegionCode(),
                                                        id: telefonos[1].id,
                                                        id_usuario: telefonos[1].id_usuario
                                                    });

                // inicializar valores por defecto telefono 3
                var pn3 = new PhoneNumber( 
                    telefonos[2].codigo_pais + telefonos[2].codigo_ciudad + telefonos[2].telefono, 
                    telefonos[2].codigo 
                );
                this.profileForm3.get('phone').setValue({
                                                        number:pn3.getNumber('significant'),
                                                        country: pn3.getRegionCode(),
                                                        id: telefonos[2].id,
                                                        id_usuario: telefonos[2].id_usuario
                                                    });
                // inicializar valores por defecto telefono 4
                var pn4 = new PhoneNumber( 
                    telefonos[3].codigo_pais + telefonos[3].codigo_ciudad + telefonos[3].telefono, 
                    telefonos[3].codigo 
                );
                this.profileForm4.get('phone').setValue({
                                                        number:pn4.getNumber('significant'),
                                                        country: pn4.getRegionCode(),
                                                        id: telefonos[3].id,
                                                        id_usuario: telefonos[3].id_usuario
                                                    });
                break;
            case 5:
                console.log('cinco');
                // inicializar valores por defecto telefono 1
                var pn1 = new PhoneNumber( 
                    telefonos[0].codigo_pais + telefonos[0].codigo_ciudad + telefonos[0].telefono, 
                    telefonos[0].codigo 
                );
                this.profileForm.get('phone').setValue({
                                                        number:pn1.getNumber('significant'),
                                                        country: pn1.getRegionCode(),
                                                        id: telefonos[0].id,
                                                        id_usuario: telefonos[0].id_usuario
                                                    });
                
                // inicializar valores por defecto telefono 2
                var pn2 = new PhoneNumber( 
                    telefonos[1].codigo_pais + telefonos[1].codigo_ciudad + telefonos[1].telefono, 
                    telefonos[1].codigo 
                );
                this.profileForm2.get('phone').setValue({
                                                        number:pn2.getNumber('significant'),
                                                        country: pn2.getRegionCode(),
                                                        id: telefonos[1].id,
                                                        id_usuario: telefonos[1].id_usuario
                                                    });

                // inicializar valores por defecto telefono 3
                var pn3 = new PhoneNumber( 
                    telefonos[2].codigo_pais + telefonos[2].codigo_ciudad + telefonos[2].telefono, 
                    telefonos[2].codigo 
                );
                this.profileForm3.get('phone').setValue({
                                                        number:pn3.getNumber('significant'),
                                                        country: pn3.getRegionCode(),
                                                        id: telefonos[2].id,
                                                        id_usuario: telefonos[2].id_usuario
                                                    });
                // inicializar valores por defecto telefono 4
                var pn4 = new PhoneNumber( 
                    telefonos[3].codigo_pais + telefonos[3].codigo_ciudad + telefonos[3].telefono, 
                    telefonos[3].codigo 
                );
                this.profileForm4.get('phone').setValue({
                                                        number:pn4.getNumber('significant'),
                                                        country: pn4.getRegionCode(),
                                                        id: telefonos[3].id,
                                                        id_usuario: telefonos[3].id_usuario
                                                    });
                
                // inicializar valores por defecto telefono 5
                var pn5 = new PhoneNumber( 
                    telefonos[4].codigo_pais + telefonos[4].codigo_ciudad + telefonos[4].telefono, 
                    telefonos[4].codigo 
                );
                this.profileForm5.get('phone').setValue({
                                                        number:pn5.getNumber('significant'),
                                                        country: pn5.getRegionCode(),
                                                        id: telefonos[4].id,
                                                        id_usuario: telefonos[4].id_usuario
                                                    });
                break;    
        }
        
    }

        // ************************ metodos telefono 1
        get phoneGroup() {
            // console.log('valido: ', this.profileForm.get('phone').value.number !== '');
            return this.profileForm.get('phone') as FormControl;
        }
        get phoneCountryControl() {
            return this.profileForm.get('phone.country') as FormControl;
        }
        get phoneNumberControl() {
            return this.profileForm.get('phone.number') as FormControl;
        }
        get phoneNumberDigits(): string {
            return this.phoneNumberControl.value.replace(/\D/g, '');
        }
        get phoneNumber(): PhoneNumber {
            return new PhoneNumber(this.phoneNumberDigits, this.phoneCountryControl.value);
        }
        get phoneHint(): string {
            return PhoneNumber.getExample(this.phoneCountryControl.value).getNumber('national');
        }
        get phoneE164(): string {
            return this.phoneNumber.getNumber('e164');
        }
        formatNumber() {
            const natNum = this.phoneNumber.getNumber('national');
            this.phoneNumberControl.setValue((natNum) ? natNum : this.phoneNumberDigits);
        }
    
        obtenerNunmero(): any {
            
            //E.164 formato estandar de numero de telefono
    
            if(this.phoneNumber.getNumber('rfc3966')) {
                // numero de telefono
                console.log('tel: ', this.phoneNumber.getNumber('rfc3966'));
                
                // console.log(this.phoneNumber.getNumber('rfc3966').substr(4).split('-'));
    
                const arregloNumeros = this.phoneNumber.getNumber('rfc3966').substr(4).split('-');
                console.log('length: ', arregloNumeros.length);
    
                let numeroTelefono = {
                    simbolo: '',
                    codigoPais: '',
                    codigoCiudad: '',
                    telefono: '',
                    activado: 0,
                    formato: this.phoneNumber.getNumber('e164'),
                    codigo: this.phoneNumber.getRegionCode()          
                }
                switch(arregloNumeros.length) {
                    case 2:
                        // significa que solo tiene codigo de pais y numero
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono.simbolo = this.phoneNumber.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono.codigoPais = arregloNumeros[0].substr(1);
                        // añadimos telefono
                        numeroTelefono.telefono = arregloNumeros[1];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    case 3:
                        // significa que tiene codigo de pais y numero telefono
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono.simbolo = this.phoneNumber.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono.codigoPais = arregloNumeros[0].substr(1);
                        // añadimos telefono
                        numeroTelefono.telefono = arregloNumeros[1]
                        // añadimos telefono
                        numeroTelefono.telefono += arregloNumeros[2];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    case 4:
                        // significa que tiene codigo de pais codigo de ciudad y numero telefono
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono.simbolo = this.phoneNumber.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono.codigoPais = arregloNumeros[0].substr(1);
                        // añadimos codigo de ciudad
                        numeroTelefono.codigoCiudad = arregloNumeros[1]
                        // añadimos telefono
                        numeroTelefono.telefono = arregloNumeros[2];
                        numeroTelefono.telefono += arregloNumeros[3];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    default:
                        return [];
                        break;
                }
    
                // console.log('telefono: ', numeroTelefono);
                return [numeroTelefono];
            }
            
        }
        // ************************ metodos telefono 1
        // ************************ metodos telefono 2
        get phoneGroup2() {
            return this.profileForm2.get('phone') as FormControl;
        }
        get phoneCountryControl2() {
            return this.profileForm2.get('phone.country') as FormControl;
        }
        get phoneNumberControl2() {
            return this.profileForm2.get('phone.number') as FormControl;
        }
        get phoneNumberDigits2(): string {
            return this.phoneNumberControl2.value.replace(/\D/g, '');
        }
        get phoneNumber2(): PhoneNumber2 {
            return new PhoneNumber2(this.phoneNumberDigits2, this.phoneCountryControl2.value);
        }
        get phoneHint2(): string {
            return PhoneNumber2.getExample(this.phoneCountryControl2.value).getNumber('national');
        }
        get phoneE1642(): string {
            return this.phoneNumber2.getNumber('e164');
        }
        formatNumber2() {
            const natNum = this.phoneNumber2.getNumber('national');
            this.phoneNumberControl2.setValue((natNum) ? natNum : this.phoneNumberDigits2);
        }
    
        obtenerNunmero2(): any {
            
            //E.164 formato estandar de numero de telefono
    
            if(this.phoneNumber2.getNumber('rfc3966')) {
                // numero de telefono
                console.log('tel: ', this.phoneNumber2.getNumber('rfc3966'));
                
                // console.log(this.phoneNumber.getNumber('rfc3966').substr(4).split('-'));
    
                const arregloNumeros2 = this.phoneNumber2.getNumber('rfc3966').substr(4).split('-');
                console.log('length: ', arregloNumeros2.length);
    
                let numeroTelefono2 = {
                    simbolo: '',
                    codigoPais: '',
                    codigoCiudad: '',
                    telefono: '',
                    activado: 0,
                    formato: this.phoneNumber2.getNumber('e164'),
                    codigo: this.phoneNumber2.getRegionCode()          
                }
                switch(arregloNumeros2.length) {
                    case 2:
                        // significa que solo tiene codigo de pais y numero
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono2.simbolo = this.phoneNumber2.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono2.codigoPais = arregloNumeros2[0].substr(1);
                        // añadimos telefono
                        numeroTelefono2.telefono = arregloNumeros2[1];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    case 3:
                        // significa que tiene codigo de pais y numero telefono
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono2.simbolo = this.phoneNumber2.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono2.codigoPais = arregloNumeros2[0].substr(1);
                        // añadimos telefono
                        numeroTelefono2.telefono = arregloNumeros2[1]
                        // añadimos telefono
                        numeroTelefono2.telefono += arregloNumeros2[2];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    case 4:
                        // significa que tiene codigo de pais codigo de ciudad y numero telefono
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono2.simbolo = this.phoneNumber2.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono2.codigoPais = arregloNumeros2[0].substr(1);
                        // añadimos codigo de ciudad
                        numeroTelefono2.codigoCiudad = arregloNumeros2[1]
                        // añadimos telefono
                        numeroTelefono2.telefono = arregloNumeros2[2];
                        numeroTelefono2.telefono += arregloNumeros2[3];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    default:
                        return [];
                        break;
                }
    
                // console.log('telefono: ', numeroTelefono);
                return [numeroTelefono2];
            }
            
        }
        // ************************ metodos telefono 2
        // ************************ metodos telefono 3
        get phoneGroup3() {
            return this.profileForm3.get('phone') as FormControl;
        }
        get phoneCountryControl3() {
            return this.profileForm3.get('phone.country') as FormControl;
        }
        get phoneNumberControl3() {
            return this.profileForm3.get('phone.number') as FormControl;
        }
        get phoneNumberDigits3(): string {
            return this.phoneNumberControl3.value.replace(/\D/g, '');
        }
        get phoneNumber3(): PhoneNumber3 {
            return new PhoneNumber3(this.phoneNumberDigits3, this.phoneCountryControl3.value);
        }
        get phoneHint3(): string {
            return PhoneNumber3.getExample(this.phoneCountryControl3.value).getNumber('national');
        }
        get phoneE1643(): string {
            return this.phoneNumber3.getNumber('e164');
        }
        formatNumber3() {
            const natNum = this.phoneNumber3.getNumber('national');
            this.phoneNumberControl3.setValue((natNum) ? natNum : this.phoneNumberDigits3);
        }
    
        obtenerNunmero3(): any {
            
            //E.164 formato estandar de numero de telefono
    
            if(this.phoneNumber3.getNumber('rfc3966')) {
                // numero de telefono
                // console.log('tel: ', this.phoneNumber3.getNumber('rfc3966'));
                
                // console.log(this.phoneNumber.getNumber('rfc3966').substr(4).split('-'));
    
                const arregloNumeros3 = this.phoneNumber3.getNumber('rfc3966').substr(4).split('-');
                // console.log('length: ', arregloNumeros3.length);
    
                let numeroTelefono3 = {
                    simbolo: '',
                    codigoPais: '',
                    codigoCiudad: '',
                    telefono: '',
                    activado: 0,
                    formato: this.phoneNumber3.getNumber('e164'),
                    codigo: this.phoneNumber3.getRegionCode()          
                }
                switch(arregloNumeros3.length) {
                    case 2:
                        // significa que solo tiene codigo de pais y numero
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono3.simbolo = this.phoneNumber3.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono3.codigoPais = arregloNumeros3[0].substr(1);
                        // añadimos telefono
                        numeroTelefono3.telefono = arregloNumeros3[1];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    case 3:
                        // significa que tiene codigo de pais y numero telefono
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono3.simbolo = this.phoneNumber3.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono3.codigoPais = arregloNumeros3[0].substr(1);
                        // añadimos telefono
                        numeroTelefono3.telefono = arregloNumeros3[1]
                        // añadimos telefono
                        numeroTelefono3.telefono += arregloNumeros3[2];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    case 4:
                        // significa que tiene codigo de pais codigo de ciudad y numero telefono
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono3.simbolo = this.phoneNumber3.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono3.codigoPais = arregloNumeros3[0].substr(1);
                        // añadimos codigo de ciudad
                        numeroTelefono3.codigoCiudad = arregloNumeros3[1]
                        // añadimos telefono
                        numeroTelefono3.telefono = arregloNumeros3[2];
                        numeroTelefono3.telefono += arregloNumeros3[3];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    default:
                        return [];
                        break;
                }
    
                // console.log('telefono: ', numeroTelefono);
                return [numeroTelefono3];
            }
            
        }
        // ************************ metodos telefono 3
        // ************************ metodos telefono 4
        get phoneGroup4() {
            return this.profileForm4.get('phone') as FormControl;
        }
        get phoneCountryControl4() {
            return this.profileForm4.get('phone.country') as FormControl;
        }
        get phoneNumberControl4() {
            return this.profileForm4.get('phone.number') as FormControl;
        }
        get phoneNumberDigits4(): string {
            return this.phoneNumberControl4.value.replace(/\D/g, '');
        }
        get phoneNumber4(): PhoneNumber4 {
            return new PhoneNumber4(this.phoneNumberDigits4, this.phoneCountryControl4.value);
        }
        get phoneHint4(): string {
            return PhoneNumber3.getExample(this.phoneCountryControl4.value).getNumber('national');
        }
        get phoneE1644(): string {
            return this.phoneNumber4.getNumber('e164');
        }
        formatNumber4() {
            const natNum = this.phoneNumber4.getNumber('national');
            this.phoneNumberControl4.setValue((natNum) ? natNum : this.phoneNumberDigits4);
        }
    
        obtenerNunmero4(): any {
            
            //E.164 formato estandar de numero de telefono
    
            if(this.phoneNumber4.getNumber('rfc3966')) {
                // numero de telefono
                // console.log('tel: ', this.phoneNumber3.getNumber('rfc3966'));
                
                // console.log(this.phoneNumber.getNumber('rfc3966').substr(4).split('-'));
    
                const arregloNumeros4 = this.phoneNumber4.getNumber('rfc3966').substr(4).split('-');
                // console.log('length: ', arregloNumeros3.length);
    
                let numeroTelefono4 = {
                    simbolo: '',
                    codigoPais: '',
                    codigoCiudad: '',
                    telefono: '',
                    activado: 0,
                    formato: this.phoneNumber4.getNumber('e164'),
                    codigo: this.phoneNumber4.getRegionCode()          
                }
                switch(arregloNumeros4.length) {
                    case 2:
                        // significa que solo tiene codigo de pais y numero
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono4.simbolo = this.phoneNumber4.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono4.codigoPais = arregloNumeros4[0].substr(1);
                        // añadimos telefono
                        numeroTelefono4.telefono = arregloNumeros4[1];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    case 3:
                        // significa que tiene codigo de pais y numero telefono
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono4.simbolo = this.phoneNumber4.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono4.codigoPais = arregloNumeros4[0].substr(1);
                        // añadimos telefono
                        numeroTelefono4.telefono = arregloNumeros4[1]
                        // añadimos telefono
                        numeroTelefono4.telefono += arregloNumeros4[2];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    case 4:
                        // significa que tiene codigo de pais codigo de ciudad y numero telefono
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono4.simbolo = this.phoneNumber4.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono4.codigoPais = arregloNumeros4[0].substr(1);
                        // añadimos codigo de ciudad
                        numeroTelefono4.codigoCiudad = arregloNumeros4[1]
                        // añadimos telefono
                        numeroTelefono4.telefono = arregloNumeros4[2];
                        numeroTelefono4.telefono += arregloNumeros4[3];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    default:
                        return [];
                        break;
                }
    
                // console.log('telefono: ', numeroTelefono);
                return [numeroTelefono4];
            }
            
        }
        // ************************ metodos telefono 4
        // ************************ metodos telefono 5
        get phoneGroup5() {
            return this.profileForm5.get('phone') as FormControl;
        }
        get phoneCountryControl5() {
            return this.profileForm5.get('phone.country') as FormControl;
        }
        get phoneNumberControl5() {
            return this.profileForm5.get('phone.number') as FormControl;
        }
        get phoneNumberDigits5(): string {
            return this.phoneNumberControl5.value.replace(/\D/g, '');
        }
        get phoneNumber5(): PhoneNumber5 {
            return new PhoneNumber4(this.phoneNumberDigits4, this.phoneCountryControl4.value);
        }
        get phoneHint5(): string {
            return PhoneNumber5.getExample(this.phoneCountryControl5.value).getNumber('national');
        }
        get phoneE1645(): string {
            return this.phoneNumber5.getNumber('e164');
        }
        formatNumber5() {
            const natNum = this.phoneNumber5.getNumber('national');
            this.phoneNumberControl5.setValue((natNum) ? natNum : this.phoneNumberDigits5);
        }
    
        obtenerNunmero5(): any {
            
            //E.164 formato estandar de numero de telefono
    
            if(this.phoneNumber5.getNumber('rfc3966')) {
                // numero de telefono
                // console.log('tel: ', this.phoneNumber3.getNumber('rfc3966'));
                
                // console.log(this.phoneNumber.getNumber('rfc3966').substr(4).split('-'));
    
                const arregloNumeros5 = this.phoneNumber5.getNumber('rfc3966').substr(4).split('-');
                // console.log('length: ', arregloNumeros3.length);
    
                let numeroTelefono5 = {
                    simbolo: '',
                    codigoPais: '',
                    codigoCiudad: '',
                    telefono: '',
                    activado: 0,
                    formato: this.phoneNumber5.getNumber('e164'),
                    codigo: this.phoneNumber5.getRegionCode()          
                }
                switch(arregloNumeros5.length) {
                    case 2:
                        // significa que solo tiene codigo de pais y numero
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono5.simbolo = this.phoneNumber4.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono5.codigoPais = arregloNumeros5[0].substr(1);
                        // añadimos telefono
                        numeroTelefono5.telefono = arregloNumeros5[1];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    case 3:
                        // significa que tiene codigo de pais y numero telefono
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono5.simbolo = this.phoneNumber5.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono5.codigoPais = arregloNumeros5[0].substr(1);
                        // añadimos telefono
                        numeroTelefono5.telefono = arregloNumeros5[1]
                        // añadimos telefono
                        numeroTelefono5.telefono += arregloNumeros5[2];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    case 4:
                        // significa que tiene codigo de pais codigo de ciudad y numero telefono
                        
                        // añadimos el simbolo para llamadas internacionales
                        numeroTelefono5.simbolo = this.phoneNumber5.getNumber('rfc3966').substr(4,1);
                        // añadimos el codigo del pais
                        numeroTelefono5.codigoPais = arregloNumeros5[0].substr(1);
                        // añadimos codigo de ciudad
                        numeroTelefono5.codigoCiudad = arregloNumeros5[1]
                        // añadimos telefono
                        numeroTelefono5.telefono = arregloNumeros5[2];
                        numeroTelefono5.telefono += arregloNumeros5[3];
                        // console.log('telefono: ', numeroTelefono);
                        break;
                    default:
                        return [];
                        break;
                }
    
                // console.log('telefono: ', numeroTelefono);
                return [numeroTelefono5];
            }
            
        }
        // ************************ metodos telefono 4

        actualizarTelefono(tel, usuario) {
            // console.log('id_ususario: ', this.idUsuario);
            // console.log(usuario.value);
            // console.log(tel[0]);

            if(usuario.value.id != 0) {
                // significa que se va a reemplazar el numero de telefono
                const telefono = {
                    activado: 0,
                    codigo: tel[0].codigo,
                    codigo_ciudad: tel[0].codigoCiudad,
                    codigo_pais: tel[0].codigoPais,
                    formato: tel[0].formato,
                    simbolo: tel[0].simbolo,
                    telefono: tel[0].telefono,
                    id: usuario.value.id,
                    id_usuario: this.idUsuario
                }
                console.log(telefono);
                this.restService.actualizarTelefono(telefono).subscribe((res) => {
                    switch(res['codigo']) {
                        case 1:
                            this.openDialog('OK', 'Número de telefono actualizado correctamente');

                            break;
                        case 2:
                            this.openDialog('Error', res['mensaje']);
                            break;
                        case 3:
                            this.openDialog('Error', res['mensaje']);
                            break;    
                    }
                }, (err) => {
                    console.log(err);
                })
            } else {
                // significa que se va agregar un nuevo numero de telefono
                // significa que se va a reemplazar el numero de telefono
                const telefono = {
                    activado: 0,
                    codigo: tel[0].codigo,
                    codigo_ciudad: tel[0].codigoCiudad,
                    codigo_pais: tel[0].codigoPais,
                    formato: tel[0].formato,
                    simbolo: tel[0].simbolo,
                    telefono: tel[0].telefono,
                    id: usuario.value.id,
                    id_usuario: this.idUsuario
                }
                console.log(telefono);
                this.restService.agregarTelefono(telefono).subscribe((res) => {
                    switch(res['codigo']) {
                        case 1:
                            this.openDialog('OK', 'Número de telefono agregado correctamente');

                            break;
                        case 2:
                            this.openDialog('Error', res['mensaje']);
                            break;
                        case 3:
                            this.openDialog('Error', res['mensaje']);
                            break;    
                    }
                }, (err) => {
                    console.log(err);
                })
            }
        }
        
    openDialog(title: string, body: string) {


        const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: {
            title,
            body
        }
        });

        dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed', result);
        });
    }

    eliminarTelefono(tel, usuario) {
        const telefono = {
            activado: 0,
            codigo: tel[0].codigo,
            codigo_ciudad: tel[0].codigoCiudad,
            codigo_pais: tel[0].codigoPais,
            formato: tel[0].formato,
            simbolo: tel[0].simbolo,
            telefono: tel[0].telefono,
            id: usuario.value.id,
            id_usuario: this.idUsuario
        }

        
        this.restService.eliminarTelefono(telefono).subscribe((res) => {
            this.openDialog('OK', 'Telefono eliminado correctamente');
            usuario.setValue({
                number:'',
                country: 'SV',
                id: 0,
                id_usuario: 0
            });
        }, (err) => {
            console.log(err);
        })
    }
}
