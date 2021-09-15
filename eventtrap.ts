// TODO: write tests
const JSACTION_ATTR = 'jsaction'

export interface EventInfo {
    event: Event;
    action: string;
    actionElement: Element;
}

export type EventHandler = (eventInfo: EventInfo) => void;

export class EventTrap {
    private handler: EventHandler|null;
    private queue: EventInfo[] = [];

    /**
     * @param container The container within events are captured
     * @param events A list of browser events to capture. It's recommended to avoid noisy events such as "mousemove", since this does register a listener for each type, even if they are not used.
     */
    constructor(private readonly container: Element, events: string[]) {
        // TODO: support custom events, by monkeypatching EventTarget.prototype.dispatchEvent and calling installEventCapturer if there isn't one already
        for (const event of events) {
            this.installEventCapturer(event);
        }
    }

    /**
     * Attaches a handler to this trap. This can only be done once. If events were trapped before this handler was attached, they will be dispatched to the handler in the order they were received. After this call, all captured events will directly call the handler.
     */
    attachHandler(handler: EventHandler) {
        if (this.handler) throw new Error('Handler already attached');
        this.handler = handler;
        for (const eventInfo of this.queue) {
            this.handler(eventInfo);
        }
        this.queue = [];
    }

    /** Install a listener at the root of the container to capture events during their bubble phase. */
    private installEventCapturer(eventType: string) {
        // TODO: handle the events that don't bubble
        this.container.addEventListener(eventType, e => this.captureEvent(eventType, e));
    }

    /** Captures an event, and decides to handle it or not depending on if it has a matching jsaction attribute */
    private captureEvent(eventType: string, event: Event) {
        const ancestors = event.composedPath();
        for (const el of ancestors) {
            if (!(el instanceof Element)) continue;
            const actionMap = this.getActions(el);
            const action = actionMap.get(eventType);
            if (action) return this.handleEvent({event, action, actionElement: el});
        }
    }

    /** Either calls the attached handler, or queues up the event. */
    private handleEvent(eventInfo: EventInfo) {
        // TODO: probably want to prevent default on <a> tags with actions
        // TODO: make a clickonly event
        if (this.handler) this.handler(eventInfo);
        else this.queue.push(eventInfo);
    }

    /** Get all declared actions on the element as a map from event type to action name. */
    private getActions(el: Element): Map<string, string> {
        // TODO: cache parsing
        if (!el.hasAttribute(JSACTION_ATTR)) return new Map();

        const attr = el.getAttribute(JSACTION_ATTR);
        const bindings = attr.split(/\s*;\s*/);
        const actionMap = new Map<string, string>();
        for (const binding of bindings) {
            const parts = binding.split(/\s*:\s*/);
            if (parts.length !== 2) {
                console.log(
                    `Invalid jsaction syntax, expected one comma separator in ${binding}`);
                continue;
            }
            const [eventType, action] = parts;
            // TODO: warn about duplicate actions
            actionMap.set(eventType, action);

        }
        return actionMap;
    }
}
