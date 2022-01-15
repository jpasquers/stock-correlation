import axios from "axios";
import {logger} from "./logger";


export const exchanges = ["nasdaq", "other"];

export interface Generator {
    generate(): Promise<string>;
    download(): Promise<string>;
    process(): Promise<string>;
}

export const generatorFor = (exchange: string) => {

}

export class SimpleDownloadGenerator implements Generator {
    name: string;
    downloadLink: string;

    constructor(name: string, downloadLink: string) {
        this.name = name;
        this.downloadLink = downloadLink;
    }

    async generate(): void {
        logger.info(`Downloading exchange for ${this.name} from ${this.downloadLink}`);
        axios.get(this.downloadLink).then(data => {

        });
    }

    
}