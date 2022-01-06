import { Adresa } from "../klase/adresa";
import { Zaposleni } from "../klase/zaposleni";
import { NacinIsporuke } from "./nacin-isporuke";
import { NacinPlacanja } from "./nacin-placanja";

export class Faktura {

    sifraFakture!: number;
    datumPrometa!: Date;
    valuta!: String;
    nacinPlacanja!: NacinPlacanja;
    nacinIsporuke!: NacinIsporuke;
    zaposleni!: Zaposleni;
    adresa!: Adresa;
}
