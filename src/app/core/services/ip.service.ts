import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: "root"
})
export class IpService {
    local = environment.api;
    constructor(private http : HttpClient){}

    insertarIp(input : any){
        return this.http.post(this.local+"Repeater/ip.php", input, {responseType: 'text'})
    }

    select(){
        return this.http.get(this.local+"Repeater/ip.php")
    }
    
    selectIp(segmento :string,segmento2 :string){
        return this.http.get(this.local+"Repeater/ip.php?segmento="+segmento+"&segmentoFinal="+segmento2)
    }

    selectIpParam(segmento :string,segmento2 :string,segmento3 : string){
        return this.http.get(this.local+"Repeater/ip.php?segmento="+segmento+"&segmentoFinal="+segmento2+"&segmentoBuscar="+segmento3)
    }
    selectIpTodosSolo(segmento : string){
        return this.http.get(this.local+"Repeater/ip.php?segmentoBuscarSinParam="+segmento)
    }
    ping(ip : string) {
        return this.http.get(this.local+"ping.php?ip="+ip)
    }

}