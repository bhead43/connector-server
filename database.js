import { parse } from "csv-parse";
import { createReadStream, writeFile, readFile } from "fs";
import { pipeline } from "stream/promises";

export async function initDB(csvEndpoint) {
    // Assume fetching the CSV
    const csv = await fetch(csvEndpoint);
    const csvData = [];
    const parser = parse({ columns: true });
    writeFile('./resources/loadedFile.csv', await csv.text(), err => {
        if (err) {
            console.error(err);
        }
    });

    // Read raw CSV as stream, then parse to array of JSONs using csv-parse
    return new Promise((res, rej) => {
        createReadStream("./resources/loadedFile.csv")
            .pipe(parser)
            .on('data', (r) => {
                csvData.push(r);
            });
        parser.on('end', () => {
            res({
                getRecord: (searchOn, query) => {
                    // needs some basic handling for records not found
                    return csvData.find(record => record[searchOn] == query);
                },
                // Probably won't use, but nice to have just in case
                getSheet: () => {
                    return csvData;
                }
            });
        });
    })
}