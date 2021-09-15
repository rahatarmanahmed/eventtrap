const JSACTION_ATTR = 'jsaction';
// TODO allow export once i have proper compilation?
/*export*/ class EventTrap {
    constructor(container, events) {
        this.container = container;
        this.queue = [];
        for (const event of events) {
            this.installEventCapturer(event);
        }
    }
    attachHandler(handler) {
        if (this.handler)
            throw new Error('Handler already attached');
        this.handler = handler;
        for (const eventInfo of this.queue) {
            this.handler(eventInfo);
        }
        this.queue = [];
    }
    installEventCapturer(eventType) {
        // TODO: handle the events that don't bubble
        this.container.addEventListener(eventType, e => this.captureEvent(eventType, e));
    }
    captureEvent(eventType, event) {
        const ancestors = event.composedPath();
        for (const el of ancestors) {
            if (!(el instanceof Element))
                continue;
            const actionMap = this.getActions(el);
            const action = actionMap.get(eventType);
            if (action)
                return this.handleEvent({ event, action, actionElement: el });
        }
    }
    handleEvent(eventInfo) {
        if (this.handler)
            this.handler(eventInfo);
        else
            this.queue.push(eventInfo);
    }
    getActions(el) {
        // TODO: cache parsing
        if (!el.hasAttribute(JSACTION_ATTR))
            return new Map();
        const attr = el.getAttribute(JSACTION_ATTR);
        const bindings = attr.split(/\s*;\s*/);
        const actionMap = new Map();
        for (const binding of bindings) {
            const parts = binding.split(/\s*:\s*/);
            if (parts.length !== 2) {
                console.log(`Invalid jsaction syntax, expected one comma separator in ${binding}`);
                continue;
            }
            const [eventType, action] = parts;
            // TODO: warn about duplicate actions
            actionMap.set(eventType, action);
        }
        return actionMap;
    }
}
