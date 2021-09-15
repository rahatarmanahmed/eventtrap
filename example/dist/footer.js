(() => {
  // example/src/footer.ts
  var eventTrap = window["__eventTrap__"];
  var actionHandlers = {
    showAlert: (e) => alert("Handled the showAlert action")
  };
  eventTrap.attachHandler((eventInfo) => {
    const handler = actionHandlers[eventInfo.action];
    if (!handler)
      console.error(`Handler not defined for ${eventInfo.action} action`);
    handler(eventInfo.event);
  });
  console.log("Loaded footer");
})();
