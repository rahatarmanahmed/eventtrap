declare const JSACTION_ATTR = "jsaction";
interface EventInfo {
    event: Event;
    action: string;
    actionElement: Element;
}
declare type EventHandler = (eventInfo: EventInfo) => void;
declare class EventTrap {
    private readonly container;
    private handler;
    private queue;
    constructor(container: Element, events: string[]);
    attachHandler(handler: EventHandler): void;
    private installEventCapturer;
    private captureEvent;
    private handleEvent;
    private getActions;
}
