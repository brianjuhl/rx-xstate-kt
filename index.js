import { createMachine, interpret } from "xstate";
import { inspect } from "@xstate/inspect";

// set up the visualizer
inspect({
  iframe: false, // open in new window
});

// select the box in the dom
const elBox = document.querySelector("#box");

// create a new machine
const machine = createMachine({});

// create a new service instance using the new machine
const service = interpret(machine, { devTools: true });

// attach a listener to the service
service.onTransition((state) => {
  console.log(state);
});

// start the service
service.start();

// attach a listener for the mousedown event
elBox.addEventListener("mousedown", (e) => {
  console.log(e);
});

// attach a listener for the mousemove event
elBox.addEventListener("mousemove", (e) => {
  console.log(e);
});

// attach a listener for the mouseup event
elBox.addEventListener("mouseup", (e) => {
  console.log(e);
});
