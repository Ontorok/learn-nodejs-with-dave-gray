const logEvents = require('./utils/logEvents');

const Events = require("events")

class EventsEmitter extends Events { };

// Initialize object
const eventsEmitter = new EventsEmitter();

// add listener for the object
eventsEmitter.on('log', message => logEvents(message));

setTimeout(() => {
    eventsEmitter.emit("log", "Log event emitted")
}, 2000); 