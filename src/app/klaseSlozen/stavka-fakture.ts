import { Faktura } from "./faktura";
import { Proizvod } from "./proizvod";
import { StavkaFaktureID } from "./stavka-fakture-id";

export class StavkaFakture {

    id!: StavkaFaktureID;
    faktura!: Faktura;
    opis!: String;
    ean!: String;
    kolicina!: number;
    proizvod!: Proizvod;
}
