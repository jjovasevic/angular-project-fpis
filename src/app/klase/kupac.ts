import { Adresa } from "./adresa";
import { Zaposleni } from "./zaposleni";

export class Kupac {

    //dodajemo propertie koji su isti kao i json fajl

    pib!: number;
    naziv_kupca!: String;
    email_kupca!: String;
    telefon_kupca!: String;
    potpis!: String;
    adresa!: Adresa;
    zaposleni!: Zaposleni;

}
