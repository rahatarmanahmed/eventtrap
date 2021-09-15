const express = require('express')
const fs = require('fs');
const path = require('path')
const app = express()
const port = 3000

const HEADER_JS = fs.readFileSync(path.join(__dirname, 'dist/header.js'));
const FOOTER_JS = fs.readFileSync(path.join(__dirname, 'dist/footer.js'));

app.get('/', async (req, res) => {
    res.set('Content-Type', 'text/html')
    res.write(`<html><body>`);
    res.write(`<script>${HEADER_JS}</script>`);
    res.write(`<p>Loaded trap</p>`);
    res.write(`<button type="button" jsaction="click:showAlert">Click me while the page is loading</button>`);
    res.write(`<p>Stalling the rest of the HTML for 3 seconds...</p>`);
    await sleep(1000);
    res.write(`<p>2 seconds left...</p>`);
    await sleep(1000);
    res.write(`<p>1 seconds left...</p>`);
    await sleep(1000);
    res.write(`<p>Loading the rest of the page, include the main JS of the page containing the event handler implementation...</p>`);
    res.write(`<script>${FOOTER_JS}</script>`);
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
