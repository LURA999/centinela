
export class rango_ip {

	constructor(){ }

buscandoIndice(id:number,ELEMENT_DATA :any){
    let i = 0
    while (true) {
      const element = ELEMENT_DATA[i]["id"];
      if(element===id){
       return i
      }
      i++;
    }
  }
}