import { Fabrika } from "./fabrika";
import { GrupaProizvoda } from "./grupa-proizvoda";
import { JedinicaMere } from "./jedinica-mere";

export class Proizvod {

    sifraProizvoda!: number;
    nazivProizvoda!: String;
    cenaProizvoda!: number;
    jedinicaMere!: JedinicaMere;
    fabrika!: Fabrika;
    grupaProizvoda!: GrupaProizvoda;
    
}
