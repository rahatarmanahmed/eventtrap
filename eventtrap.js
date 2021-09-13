var JSACTION_ATTR = 'jsaction';
// TODO allow export once i have proper compilation?
/*export*/ var EventTrap = /** @class */ (function () {
    function EventTrap(container, events) {
        this.container = container;
        this.queue = [];
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_1 = events_1[_i];
            this.installEventCapturer(event_1);
        }
    }
    EventTrap.prototype.attachHandler = function (handler) {
        if (this.handler)
            throw new Error('Handler already attached');
        this.handler = handler;
        for (var _i = 0, _a = this.queue; _i < _a.length; _i++) {
            var eventInfo = _a[_i];
            this.handler(eventInfo);
        }
        this.queue = [];
    };
    EventTrap.prototype.installEventCapturer = function (eventType) {
        var _this = this;
        // TODO: handle the events that don't bubble
        this.container.addEventListener(eventType, function (e) { return _this.captureEvent(eventType, e); });
    };
    EventTrap.prototype.captureEvent = function (eventType, event) {
        var ancestors = event.composedPath();
        for (var _i = 0, ancestors_1 = ancestors; _i < ancestors_1.length; _i++) {
            var el = ancestors_1[_i];
            if (!(el instanceof Element))
                continue;
            var actionMap = this.getActions(el);
            var action = actionMap.get(eventType);
            if (action)
                return this.handleEvent({ event: event, action: action, actionElement: el });
        }
    };
    EventTrap.prototype.handleEvent = function (eventInfo) {
        if (this.handler)
            this.handler(eventInfo);
        else
            this.queue.push(eventInfo);
    };
    EventTrap.prototype.getActions = function (el) {
        // TODO: cache parsing
        if (!el.hasAttribute(JSACTION_ATTR))
            return new Map();
        var attr = el.getAttribute(JSACTION_ATTR);
        var bindings = attr.split(/\s*;\s*/);
        var actionMap = new Map();
        for (var _i = 0, bindings_1 = bindings; _i < bindings_1.length; _i++) {
            var binding = bindings_1[_i];
            var parts = binding.split(/\s*:\s*/);
            if (parts.length !== 2) {
                console.log("Invalid jsaction syntax, expected one comma separator in " + binding);
                continue;
            }
            var eventType = parts[0], action = parts[1];
            // TODO: warn about duplicate actions
            actionMap.set(eventType, action);
        }
        return actionMap;
    };
    return EventTrap;
}());
