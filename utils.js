import { parse } from "csv-parse";
import { createReadStream } from "fs";

// Basic testing stuff, see how csv-parse works
const test = () => {
    const csvData = [];

    createReadStream("./resources/specsavers_sample.csv")
        .pipe(parse({columns: true}))
        .on('data', (r) => {
            csvData.push(r);
        })
        .on('end', () => {
            // console.log(csvData[2].EposNumber);
            // test searching this
            console.log(csvData.find(record => record.EposNumber == 10));
        })
}

test();