import fs from "fs";
import path from "path";
import {logger} from "./logger";

const symbolsPath = path.join(__dirname,"../.symbols");


const dirPresent = async (): Promise<boolean> => {
    try {
        await fs.promises.access(symbolsPath);
        return true;
    }
    catch(e) {
        return false;
    }
}

const fullyBuiltExchangePath = (exchange: string) => path.join(symbolsPath, `${exchange}-formatted.json`);

const exchangeFilesPresent = async (): Promise<boolean> => {
    let allSuccess = true;
    for (let exchange of exchanges) {
        try {
            await fs.promises.stat(fullyBuiltExchangePath(exchange));
            logger.info(`✅ exchange ${exchange} present and ready in current symbol store`);
        }
        catch(e) {
            logger.info(`❌ exchange ${exchange} missing from current symbol store`);
            allSuccess = false;
        }
    }
    return allSuccess;
}

export const generateIfMissing = async () => {
    if (await exchangeFilesPresent()) {
        logger.info("All exchanges present and ready... Continuing to processor");
        return;
    }

    logger.info("One or more exchanges not available. Re-downloading all");

}