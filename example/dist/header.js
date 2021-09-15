(() => {
  // eventtrap.ts
  var JSACTION_ATTR = "jsaction";
  var EventTrap = class {
    constructor(container, events) {
      this.container = container;
      this.queue = [];
      for (const event of events) {
        this.installEventCapturer(event);
      }
    }
    attachHandler(handler) {
      if (this.handler)
        throw new Error("Handler already attached");
      this.handler = handler;
      for (const eventInfo of this.queue) {
        this.handler(eventInfo);
      }
      this.queue = [];
    }
    installEventCapturer(eventType) {
      this.container.addEventListener(eventType, (e) => this.captureEvent(eventType, e));
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
        actionMap.set(eventType, action);
      }
      return actionMap;
    }
  };

  // example/src/header.ts
  window["__eventTrap__"] = new EventTrap(document.documentElement, [
    "auxclick",
    "blur",
    "change",
    "click",
    "compositionend",
    "compositionstart",
    "compositionupdate",
    "contextmenu",
    "copy",
    "cut",
    "dblclick",
    "dragend",
    "dragenter",
    "dragleave",
    "dragover",
    "dragstart",
    "drop",
    "error",
    "focus",
    "focusin",
    "focusout",
    "input",
    "keydown",
    "keypress",
    "keyup",
    "load",
    "mousedown",
    "mouseenter",
    "mouseleave",
    "mouseout",
    "mouseover",
    "mouseup",
    "pagehide",
    "pageshow",
    "paste",
    "pointerdown",
    "pointerup",
    "submit",
    "touchend",
    "touchmove",
    "touchstart",
    "visibilitychange",
    "wheel"
  ]);
})();
