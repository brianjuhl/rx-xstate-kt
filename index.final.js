import { createMachine, interpret, assign } from "xstate";
import { inspect } from "@xstate/inspect";

// set up the visualizer
inspect({
  iframe: false, // open in new window
});

// select the box in the dom
const elBox = document.querySelector("#box");

// create a new machine
const machine = createMachine(
  {
    initial: "idle",
    context: {
      px: 0,
      py: 0,
      dx: 0,
      dy: 0,
      x: 0,
      y: 0,
    },
    states: {
      idle: {
        on: {
          mousedown: {
            target: "dragging",
            actions: "assignPoint",
          },
        },
      },
      dragging: {
        on: {
          mousemove: {
            actions: "assignDelta",
          },
          mouseup: {
            target: "idle",
            actions: "assignPosition",
          },
        },
      },
    },
  },
  {
    actions: {
      assignPoint: assign({
        px: (_, event) => {
          return event.payload.x;
        },
        py: (_, event) => {
          return event.payload.y;
        },
      }),
      assignDelta: assign({
        dx: (context, event) => {
          return event.payload.x - context.px;
        },
        dy: (context, event) => {
          return event.payload.y - context.py;
        },
      }),
      assignPosition: assign({
        x: (context, event) => {
          return (context.x += context.dx);
        },
        y: (context, event) => {
          return (context.y += context.dy);
        },
        dx: 0,
        dy: 0,
        px: 0,
        py: 0,
      }),
    },
  }
);

// create a new service instance using the new machine
const service = interpret(machine, { devTools: true });

// attach a listener to the service
service.onTransition((state) => {
  elBox.dataset.state = state.value;
  elBox.dataset.delta = `${state.context.dx}, ${state.context.dy}`;
  elBox.style.setProperty("--dx", state.context.dx);
  elBox.style.setProperty("--dy", state.context.dy);
  elBox.style.setProperty("--x", state.context.x);
  elBox.style.setProperty("--y", state.context.y);
});

// start the service
service.start();

// attach a listener for the mousedown event
elBox.addEventListener("mousedown", (e) => {
  service.send({
    type: "mousedown",
    payload: {
      x: e.clientX,
      y: e.clientY,
    },
  });
});

// attach a listener for the mouseup event
elBox.addEventListener("mouseup", (e) => {
  service.send({
    type: "mouseup",
  });
});

// attach a listener for the mouseup event
elBox.addEventListener("mousemove", (e) => {
  service.send({
    type: "mousemove",
    payload: {
      x: e.clientX,
      y: e.clientY,
    },
  });
});
