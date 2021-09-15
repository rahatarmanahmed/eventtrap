const eventTrap = window['__eventTrap__'];

const actionHandlers = {
    showAlert: (e) => alert('Handled the showAlert action')
}

eventTrap.attachHandler((eventInfo) => {
    // TODO: have a more elaborate dispatching scheme
    const handler = actionHandlers[eventInfo.action];
    if (!handler) console.error(`Handler not defined for ${eventInfo.action} action`);
    handler(eventInfo.event);
})

console.log('Loaded footer');
