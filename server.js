const express = require('express')
const fs = require('fs');
const app = express()
const port = 3000

const EVENT_TRAP_JS = fs.readFileSync('eventtrap.js');
const EXAMPLE_HEADER_JS = fs.readFileSync('exampleheader.js');
const EXAMPLE_FOOTER_JS = fs.readFileSync('examplefooter.js');

app.get('/', async (req, res) => {
    res.set('Content-Type', 'text/html')
    res.write(`<html><body>`);
    res.write(`<script>${EVENT_TRAP_JS}</script>`);
    res.write(`<script>${EXAMPLE_HEADER_JS}</script>`);
    res.write(`<p>Loaded trap</p>`);
    res.write(`<button type="button" jsaction="click:showAlert">Click me while the page is loading</button>`);
    res.write(`<p>Stalling the rest of the HTML for 3 seconds...</p>`);
    await sleep(1000);
    res.write(`<p>2 seconds left...</p>`);
    await sleep(1000);
    res.write(`<p>1 seconds left...</p>`);
    await sleep(1000);
    res.write(`<p>Loading the rest of the page, include the main JS of the page containing the event handler implementation...</p>`);
    res.write(`<script>${EXAMPLE_FOOTER_JS}</script>`);
    res.write(`<p>Done.</p>`);

    res.write(`</body></html>`);
    res.end();
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
