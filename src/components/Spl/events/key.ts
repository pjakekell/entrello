import { select } from "d3-selection";
import store from "../../../store/store";
import { setChangedSeats } from "../logic";

import "d3-transition";
import { isFunction } from "formik";

let svg: any;

export function bindSelection(svgEl: SVGSVGElement) {
  svg = select(svgEl);
}

type tseatMovingActions = {
  [key: number]: Function;
};

const seatMovingActions: tseatMovingActions = {
  38: (val: number) => [0, -1 * val], // up
  40: (val: number) => [0, 1 * val], // down
  37: (val: number) => [-1 * val, 0], // left
  39: (val: number) => [1 * val, 0], //right
};

export function moveSeats(direction: number, shiftKey: boolean = false) {
  const act = seatMovingActions[direction];
  const activeSeats = svg.selectAll(".seat.active");
  if (!isFunction(act) || activeSeats.size() < 1) return;

  const delta = act(shiftKey ? 1000 : 10);

  activeSeats.each(function () {
    // @ts-ignore
    const el = select(this);
    el.classed("has-changes", true);
    el.attr("restore-x", el.attr("x"));
    el.attr("restore-y", el.attr("y"));
    el.attr("x", parseInt(el.attr("x")) + delta[0]);
    el.attr("y", parseInt(el.attr("y")) + delta[1]);
  });

  store.dispatch(setChangedSeats(svg.selectAll(".seat.has-changes").size()));
}
