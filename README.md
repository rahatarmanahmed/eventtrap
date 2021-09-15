# EventTrap

A rewrite of jsaction, without the old browser support cruft.

TODO: more docs

## Example

To run an example:

1. Clone this repo
2. `npm install`
3. `npm run example`
4. Open printed URL in a browser

Take a look at `example/server.js`. Notice that it inlines an early bundle of js at the top, outputs some HTML with some delays, and then adds a late bundle of js at the bottom. The early bundle will capture all events, so even though the HTML loads slowly, the events will be queued, and handled by the event handler implementation in the late bundle.
