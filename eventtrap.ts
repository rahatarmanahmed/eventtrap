const JSACTION_ATTR = 'jsaction'

interface EventInfo {
    event: Event;
    action: string;
    actionElement: Element;
}

type EventHandler = (eventInfo: EventInfo) => void;

// TODO allow export once i have proper compilation?
/*export*/ class EventTrap {
    private handler: EventHandler|null;
    private queue: EventInfo[] = [];

    constructor(private readonly container: Element, events: string[]) {
        for (const event of events) {
            this.installEventCapturer(event);
        }
    }

    attachHandler(handler: EventHandler) {
        if (this.handler) throw new Error('Handler already attached');
        this.handler = handler;
        for (const eventInfo of this.queue) {
            this.handler(eventInfo);
        }
        this.queue = [];
    }

    private installEventCapturer(eventType: string) {
        // TODO: handle the events that don't bubble
        this.container.addEventListener(eventType, e => this.captureEvent(eventType, e));
    }

    private captureEvent(eventType: string, event: Event) {
        const ancestors = event.composedPath();
        for (const el of ancestors) {
            if (!(el instanceof Element)) continue;
            const actionMap = this.getActions(el);
            const action = actionMap.get(eventType);
            if (action) return this.handleEvent({event, action, actionElement: el});
        }
    }

    private handleEvent(eventInfo: EventInfo) {
        if (this.handler) this.handler(eventInfo);
        else this.queue.push(eventInfo);
    }

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



