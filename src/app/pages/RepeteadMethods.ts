import { formatDate } from "@angular/common";
import { format } from "util";

export class RepeteadMethods {

	constructor(){ }

  /**Este es un ayudante para poder insertar datos y que este pueda reflejarse segun su id respectivo */
  buscandoIndice(id:number,ELEMENT_DATA :any) : number{
    let i = 0
    while (true) {
      const element = ELEMENT_DATA[i]["id"];
      if(element===id){
       return i
      }
      i++;
    }
  }

  /**Sirve para mostrar o no el loading individual de cada tabla*/
  hayClientes( ELEMENT_DATA : any, cargando : any) : boolean{
    if(ELEMENT_DATA != 0 || cargando ==false){
      return true;
    }else{
      return false;
    }
  }

  /**Es ayudante para los loading individuales de las tablas */
  hayClientes2(cargando : boolean) :string{
    if(cargando !=false){
      return "table-row";
    }else{
      return "none";
    }
  }

  /**Guardando numero mayor, es ayudante del metodo 'arrayRemove' */
   numeroMayor(numero : number, mayorNumero : number){
    if (mayorNumero <numero){
      mayorNumero = numero
    }
  }

  /**Sirve para remover de forma visible una fila de la tabla */
  arrayRemove(arr : any, index : any) { 
    for( var i = 0; i < arr.length; i++){ 
      if ( arr[i]["id"] === arr[index]["id"]) { 
          arr.splice(i, 1); 
      }
    }
    return arr;
  }

  /**Transforma la representacion de del estatus de numero a letras, es muy usado, en esta proyecto */
  estatus(numero : string) : string {
   if(numero == '1'){
    return "activo"
   }else{
    return "inactivo"
   }
  }

  /**Devuelve string esta en dudas, se reutilizara de nuevo, si no, entonces se borrara */
  tipo(tipo:string) : string{
    if(tipo == '1'){
      return "publico"
     }else{
      return "privado"
     }
  }

  /**Es muy usado es el mismo que 'estatus' pero de letras a numeros */
  estatusNumero(numero : string) : string{
    if (numero == "activo"){
      return '1'
    }else if ( numero == "inactivo"){
      return '2'
    } else if ( numero == "ausente"){
      return '3'
    }else{
      return ''
    }
  }

  /**es para insertar en el mysql fechas, con el formato correcto */
  formatoFechaMysql(fecha: String) : string{
    let splitted : string [] =  fecha.split("/");
    let fecha2 : Date=  new Date(splitted[1]+"-"+splitted[0]+"-"+splitted[2])
  return formatDate(fecha2,'yyyy-MM-dd','en-US');
  }

}