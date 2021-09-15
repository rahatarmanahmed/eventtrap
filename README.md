# EventTrap

A rewrite of [jsaction](https://github.com/google/jsaction), without the old browser support cruft.

## What is this?

Server rendered webpages show content to users much faster than client-side rendered pages, because HTML is nearly the very first thing sent over the wire to the browser. This improves time to first paint. However, there's a tradeoff on time to interactivity; your JavaScript is loaded at the end of the page and any user input will be ignored until the JS loads and registers event listeners. You could inline the JS at the top of the page, but this means your entire application's JS blocks your rendered HTML, delaying your time to first paint.

EventTrap lets you have your cake and eat it, too, by inlining a small bit of JS at the top of the page. This traps early user input on your page and queues them until your application code loads at the end. This way you minimize the impact on time to first paint, and also never miss any user inputs due to slow devices or network conditions.

EventTrap is a rewrite of [jsaction](https://github.com/google/jsaction). jsaction was written ~15 years ago with support for ancient browsers that makes it difficult to read and maintain. I wrote this to be a modern reference implementation of jsaction that can be much easier to understand.

## Usage

Using your favorite bundler, create a bundle with the following code:

```typescript
import {EventTrap} from '../../eventtrap';

// The Element within which events are trapped
const trapScope = document.documentElement;
// The event types the application needs to trap.
// This can be all browser events, but you may want to omit noisy ones like `mousemove`.
const trappedEventTypes = ['click', 'keyup', 'mouseover', ...];

window['__eventTrap__'] = new EventTrap(trapScope, trappedEventTypes);
```

Then inline it in a script tag in the `<head>` of your page.

```html
<head>
    <script>TODO: inline the bundle here</script>
</head>
```

Then when you server render your application, add `jsaction` attributes to declare which elements you want to handle events on. The value should be `eventType:actionName` pairs separated by a semicolon. The action name is just some arbitrary string name.

```html
<button type="button" jsaction="click:handleClick; focus:handleFocus">Click Me</button>
```

Then when your main application bundle loads, attach a handler to the event trap to start handling events.

```typescript
// Only import the type here to avoid double bundling eventtrap
import type {EventTrap, EventInfo} from '../../eventtrap';

const eventTrap = window['__eventTrap__'] as EventTrap;

function handleClick(event) {...}
function handleFocus(event) {...}

eventTrap.attachHandler((eventInfo: EventInfo) => {
    console.log(
        `Handling ${eventInfo.event.type} event with ${eventInfo.action} action`,
        eventInfo);

    if (eventInfo.action === 'handleClick') handleClick(eventInfo.event);
    if (eventInfo.action === 'handleFocus') handleFocus(eventInfo.event);
})
```

If you triggered any event before the main bundle was loaded, it will run the handlers for them now. Any future events will immediately trigger handlers.

This example is a bit contrived, in real life you would not attach a handler that calls statically defined functions like this, but rather integrate it into a larger framework that knows how to further late load handler code.

## Example

To run an example:

1. Clone this repo
2. `npm install`
3. `npm run example`
4. Open printed URL in a browser

Take a look at `example/server.js`. Notice that it inlines an early bundle of js at the top, outputs some HTML with some delays, and then adds a late bundle of js at the bottom. The early bundle will capture all events, so even though the HTML loads slowly, the events will be queued, and handled by the event handler implementation in the late bundle.
