import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import * as fs from 'fs';
import { initDB } from './database.js';

const app = new Hono();
let db;
// Very simple check if /initDB will actually do anything, no reason to parse sheet every time a call gets made from connector
let dbLastSheet = "";

app.get("/resources/:sheetName", async(context) => {
    const csv = await fs.promises.readFile(`./resources/${context.req.param('sheetName')}`, 'utf8');
    return context.text(csv);
});

app.post("/initDB", async (context) => {
    const body = await context.req.json();
    // Check if a new sheet is being passed through or not
    if(body.sheetEndpoint !== dbLastSheet) {
        db = await initDB(body.sheetEndpoint);
        dbLastSheet = body.sheetEndpoint;
        return context.text("DB Initialized from sheet")
    } else {
        return context.text("DB already initialized!")
    }
});

app.get("/search/:searchOn/:searchQuery", async(context) => {
    const searchOn = context.req.param('searchOn');
    const searchQuery = context.req.param('searchQuery');
    return context.json(db.getRecord(searchOn, searchQuery), 201);
});

app.get("/search/all"), async(context) => {
    return context.json(db.getSheet(), 201);
}

app.get("/resources/dummyimg", async (context) => {
    const img = await fs.promises.readFile(`./resources/test1.png`);
    context.header("Access-Control-Allow-Origin", "*");
    context.header("Cache-Control", "no-cache");
    context.header("Accept-Ranges", "bytes");

    return context.body(img, 201, {
        'Content-Type': "img/png"
    });
})

serve(app);