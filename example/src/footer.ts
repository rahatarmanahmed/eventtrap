// Only import the type here, the actual code will be loaded in the header bundle.
import type {EventTrap, EventInfo} from '../../eventtrap';

const eventTrap = window['__eventTrap__'] as EventTrap;

// A hardcoded set of handlers. Theoretically you could do something more dynamic like look at the DOM for declared handlers.
const actionHandlers = {
    showAlert: (e) => alert('Handled the showAlert action')
}

// This will attach the handler, which will dequeue events that have happened, and immediately handles future events.
eventTrap.attachHandler((eventInfo: EventInfo) => {
    // TODO: have a more elaborate dispatching scheme
    const handler = actionHandlers[eventInfo.action];
    if (!handler) console.error(`Handler not defined for ${eventInfo.action} action`);
    handler(eventInfo.event);
})

console.log('Loaded footer');
