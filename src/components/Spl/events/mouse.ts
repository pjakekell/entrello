import { MouseEvent } from "react";
import { select, pointer } from "d3-selection";
import store from "../../../store/store";
import { setCurOrder } from "../../../store/modules/orders/actions";
import { setChangedSeats, setActiveSeatIds, setActiveTool } from "../logic";
import { panZoom } from "../SeatingPlan";
import { SEAT_WIDTH } from "../tools/seat_dimensions";

import "d3-transition";

let selectionRect: any;
let mStart: any;
let mEnd: any;
let svg: any;
let svgRect: SVGRect;
let matrix: any;
let mousedownPanning: boolean;

export const draggingSeats = () => !!mStart;

export function bindSelection(svgEl: SVGSVGElement) {
  svg = select(svgEl);
}

export function disableSelection() {
  // svg.on("mousedown", null).on("mouseup", null);
}

export function enableSeatsRectSelection() {
  svg.on("mousedown.select", mousedown).on("mouseup", mouseup);
}

export function disablePanCanvasMouseDown() {
  // svg.on("mousedown", null).on("mouseup", null);
}

export function enablePanCanvasMouseDown() {
  svg.on("mousedown.pan", mousedownPan).on("mouseup", mouseupPan);
}

function mousedownPan(_e: MouseEvent) {
  panZoom.enablePan();
  mousedownPanning = true;
  select(svg.node().parentNode.parentNode).classed("grabbing", true);
}

function mouseupPan(_e: MouseEvent) {
  panZoom.disablePan();
  mousedownPanning = false;
  select(svg.node().parentNode.parentNode).classed("grabbing", false);
}

function mousedown(e: MouseEvent) {
  if (store.getState().spl.activeTool !== "select") return;

  if (e.buttons === 4 || (e.buttons === 1 && e.altKey)) {
    mousedownPan(e);
  }
  if (e.buttons !== 1 || e.altKey) return;
  const state = store.getState();
  const isEditing = state.orders.editCurOrderSeats;
  if (isEditing) return;
  const target: any = e.target;
  if (target && target.closest(".seat")) return;
  // if (!window.location.pathname.includes("/edit")) return;

  mStart = pointer(e, e.target);

  // break if inside a seat element
  const t = e.target as HTMLElement;
  if (t.closest(".seat")) return;

  svgRect = svg.node().createSVGRect();
  matrix = svg
    .select(".svg-pan-zoom_viewport")
    .style("transform")
    .replace("matrix(", "")
    .replace(")", "")
    .split(", ")
    .map(parseFloat);
  selectionRect = svg
    .select(".drawing-area")
    .append("rect")
    .classed("selection-rect", true)
    .attr("x", mStart[0])
    .attr("y", mStart[1])
    .attr("height", 0)
    .attr("width", 0);

  svg.on("mousemove", mousemove);
  if (e.ctrlKey || e.metaKey) return;

  // store.dispatch(setCurOrder(null));
}

function mousemove(e: MouseEvent) {
  var mMove = pointer(e, svg.select(".drawing-area").node());
  if (mMove[0] < mStart[0])
    selectionRect
      .attr("x", mMove[0])
      .attr("width", Math.max(0, mStart[0] - +mMove[0]));
  else
    selectionRect
      .attr("x", mStart[0])
      .attr("width", Math.max(0, mMove[0] - +mStart[0]));

  if (mMove[1] < mStart[1])
    selectionRect
      .attr("y", mMove[1])
      .attr("height", Math.max(0, mStart[1] - +mMove[1]));
  else
    selectionRect
      .attr("y", mStart[1])
      .attr("height", Math.max(0, mMove[1] - +mStart[1]));

  updateSvgRect();
  if (
    Math.abs(mStart[0] - mMove[0]) < 200 &&
    Math.abs(mStart[1] - mMove[1]) < 200
  )
    return;

  updateSelectedNodesList(e);
  updateHelpTips();
}

function updateSvgRect() {
  svgRect.x = parseFloat(selectionRect.attr("x")) * matrix[0] + matrix[4];
  svgRect.y = parseFloat(selectionRect.attr("y")) * matrix[3] + matrix[5];
  svgRect.width = parseFloat(selectionRect.attr("width")) * matrix[0];
  svgRect.height = parseFloat(selectionRect.attr("height")) * matrix[3];
}

function testDeselectAll(e: MouseEvent) {
  if (!mStart || mStart.length !== 2) return;

  const mMove = pointer(e, e.target);
  const diff = [Math.abs(mStart[0] - mMove[0]), Math.abs(mStart[1] - mMove[1])];
  if (diff[0] >= 1 || diff[1] >= 1) return;

  deselectAllSeats();

  const el = e.target as Element;
  if (!el.closest("svg.seat")) {
    store.dispatch(setCurOrder(null));
  }
}

function mouseup(e: MouseEvent) {
  if (store.getState().spl.activeTool !== "select") return;

  if (mousedownPanning) {
    mouseupPan(e);
    return;
  }
  if (!svgRect) return;

  const el = e.target as Element;
  const doNotDeselect = store.getState().orders.splitOrderId;
  if (
    !doNotDeselect &&
    !e.ctrlKey &&
    !e.metaKey &&
    !el.closest("svg.seat") &&
    !window.location.href.includes("/spl/edit")
  )
    testDeselectAll(e);
  svg.on("mousemove", null);
  mStart = null;
  svg.selectAll(".selection-rect").remove();

  svgRect.x = 0;
  svgRect.y = 0;
  svgRect.width = 0;
  svgRect.height = 0;
}

export function updateHelpTips() {
  const cCount = svg.selectAll(".active.seat");
  if (cCount < 1) return;

  const seatIds = cCount.nodes().map((n: SVGSVGElement) => {
    const id = n.getAttribute("id");
    return id ? id.replace("seat-", "") : "";
  });
  store.dispatch(setActiveSeatIds(seatIds));
  store.dispatch(setActiveTool("select"));
}

export function deselectAllSeats() {
  const selSeats = svg.selectAll(".seat.active");
  selSeats
    .classed("active", false)
    .classed("active-mem", false)
    .classed("deleted", false);
  svg.selectAll(".active-shadow").remove();
  svg.selectAll(".seat").classed("disabled", false);
  updateHelpTips();
}

export function selectAllSeats() {
  let selStr = ".seat";
  if (!window.location.pathname.includes("/spl/edit"))
    selStr = `${selStr}.status-0`;
  const seats = svg.selectAll(selStr);
  seats.classed("active", true);
  updateHelpTips();
}

export function updateSelectedNodesList(e: MouseEvent) {
  const nodeList = svg.node().getIntersectionList(svgRect, null);
  // const splittingOrder = store.getState().orders.splitOrderId;
  if (!e.metaKey && !e.ctrlKey)
    svg.selectAll(".active-mem").classed("active-mem", false);
  nodeList.forEach((el: SVGSVGElement) => {
    const p = el.parentNode as SVGSVGElement;
    if (!p) return;
    if (!p.classList.contains("seat")) return;
    if (
      !window.location.pathname.includes("/spl/edit") &&
      !p.classList.contains("status-0")
      // !splittingOrder
    )
      return;

    p.classList.add("active");
    p.classList.add("active-mem");
    //drawSeatShadow(p);
    toggleDragSelectedSeats();
  });
  if (e.ctrlKey || e.metaKey) return;

  svg.selectAll(".active:not(.active-mem").classed("active", false);
}

export function drawSeatShadow(g: SVGElement) {
  const c = select(g).select("circle");
  svg
    .select(".drawing-area")
    .insert("circle", ":first-child")
    .classed("shadow active-shadow", true)
    .attr("r", SEAT_WIDTH)
    .attr("filter", 'url("#blur-eff")')
    .attr("cx", c.attr("cx"))
    .attr("cy", c.attr("cy"));
}

const dropSelectedSeats = (e: MouseEvent) => {
  svg.on("mousemove", null).on("mouseup", null);
  svg.selectAll(".seat.active").each(function () {
    // @ts-ignore
    const el = select(this);
    el.classed("has-changes", true);
  });
  store.dispatch(setChangedSeats(svg.selectAll(".seat.has-changes").size()));
  mStart = null;
  mEnd = null;
};

export const toggleDragSelectedSeats = () => {
  if (svg.selectAll(".seat.active").size() < 1) return;

  svg.on("mousedown.drag", startDragSelectedSeats);
};

const dragSelectedSeats = (e: MouseEvent) => {
  if (!mStart) return;

  mEnd = pointer(e, svg.select(".drawing-area").node());

  const deltaX = mEnd[0] - mStart[0];
  const deltaY = mEnd[1] - mStart[1];
  svg.selectAll(".seat.active").each(function () {
    // @ts-ignore
    const el = select(this);
    el.attr("x", parseInt(el.attr("orig-x")) + deltaX);
    el.attr("y", parseInt(el.attr("orig-y")) + deltaY);
  });
};

const startDragSelectedSeats = (e: MouseEvent) => {
  const el = e.target as Element;
  if (!el.closest("svg.seat")) {
    if (e.ctrlKey || e.metaKey) return;

    deselectAllSeats();
    return;
  }
  if (!window.location.pathname.includes("/spl/edit")) return;

  store.dispatch(setActiveTool(null));
  svg.selectAll(".seat.active").each(function () {
    // @ts-ignore
    const el = select(this);
    el.attr("orig-x", el.attr("x"));
    el.attr("orig-y", el.attr("y"));
  });

  mStart = pointer(e, svg.select(".drawing-area").node());

  svg.on("mousemove", dragSelectedSeats).on("mouseup", dropSelectedSeats);
};
