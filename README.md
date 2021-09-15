# EventTrap

A rewrite of [jsaction](https://github.com/google/jsaction), without the old browser support cruft.

## What is this?

Server rendered webpages show content to users much faster than client-side rendered pages, because HTML is nearly the very first thing sent over the wire to the browser. This improves time to first paint. However, there's a tradeoff on time to interactivity; your JavaScript is loaded at the end of the page and any user input will be ignored until the JS loads and registers event listeners. You could inline the JS at the top of the page, but this means your entire application's JS blocks your rendered HTML, delaying your time to first paint.

EventTrap lets you have your cake and eat it, too, by inlining a small bit of JS at the top of the page. This traps early user input on your page and queues them until your application code loads at the end. This way you minimize the impact on time to first paint, and also never miss any user inputs due to slow devices or network conditions.

EventTrap is a rewrite of [jsaction](https://github.com/google/jsaction). jsaction was written ~15 years ago with support for ancient browsers that makes it difficult to read and maintain. I wrote this to be a modern reference implementation of jsaction that can be much easier to understand.
## Example

To run an example:

1. Clone this repo
2. `npm install`
3. `npm run example`
4. Open printed URL in a browser

Take a look at `example/server.js`. Notice that it inlines an early bundle of js at the top, outputs some HTML with some delays, and then adds a late bundle of js at the bottom. The early bundle will capture all events, so even though the HTML loads slowly, the events will be queued, and handled by the event handler implementation in the late bundle.
