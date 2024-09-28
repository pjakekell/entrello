import { MouseEvent } from "react";
import store from "../../../store/store";
import { select } from "d3-selection";
import "d3-transition";
import { setSeatCandidates, setActiveTool } from "../logic";
import { ISeat } from "../interfaces";
import { IPrice } from "../../Prices/interfaces";
import { SEAT_WIDTH, SEAT_BORDER_WIDTH } from "./seat_dimensions";
import moment from "moment";
import {
  updateHelpTips,
  toggleDragSelectedSeats,
  draggingSeats,
  deselectAllSeats,
} from "../events/mouse";
import { 
  setCurOrder,
  toggleSeatOrderItem,
  toggleSplitOrderSeatIds,
} from "../../../store/modules/orders/actions";
import { addShadow, removeShadow } from "./seat_active_toggles";

let svg: any;
let canvas: SVGSVGElement;

export function bindSeatDrawingTool(svgEl: SVGSVGElement) {
  svg = select(svgEl);
}

// export function enableDrawSeats() {
//   if (!svg || svg.size() < 1)
//     throw Error("svg element not initialized in draw_shape");

//   svg.on("mousedown", mousedown).on("mouseup", mouseup);

//   function mousedown(e: MouseEvent) {
//     mStart = pointer(e, e.target);

//     selectionRect = svg
//       .select(".drawing-area")
//       .append("rect")
//       .classed("spl-shape temp-drawing-shape", true)
//       .attr("x", mStart[0])
//       .attr("y", mStart[1])
//       .attr("height", 0)
//       .attr("width", 0);

//     svg.on("mousemove", mousemove);
//   }

//   function mousemove(e: MouseEvent) {
//     mEnd = pointer(e, e.target);

//     if (mEnd[0] < mStart[0])
//       selectionRect
//         .attr("x", mEnd[0])
//         .attr("width", Math.max(0, mStart[0] - +mEnd[0]));
//     else
//       selectionRect
//         .attr("x", mStart[0])
//         .attr("width", Math.max(0, mEnd[0] - +mStart[0]));

//     if (mEnd[1] < mStart[1])
//       selectionRect
//         .attr("y", mEnd[1])
//         .attr("height", Math.max(0, mStart[1] - +mEnd[1]));
//     else
//       selectionRect
//         .attr("y", mStart[1])
//         .attr("height", Math.max(0, mEnd[1] - +mStart[1]));
//   }

//   function mouseup() {
//     svg.on("mousemove", null);
//     mStart = null;
//     mEnd = null;
//   }
// }

function filterSeatsChanges(seat: ISeat) {
  return (
    // @ts-ignore this
    moment(select(this).attr("timestamp")).toDate().getTime() !==
    moment(seat.updated_at).toDate().getTime()
  );
}

export function bindSeats(canvasEl: SVGSVGElement) {
  canvas = canvasEl;
}

const toggleSeatActive = (e: MouseEvent, _: any) => {
  if (window.location.pathname.includes("/edit")) return;
  if (store.getState().spl.activeTool !== "select") return;
  if (draggingSeats()) return;

  const targetNode = e.target as SVGSVGElement | null;
  if (!targetNode) return;

  const seatNode = targetNode.parentElement;
  const seat = select(seatNode);

  const state = store.getState();
  const isEditing = state.orders.editCurOrderSeats;
  const splittingOrder = state.orders.splitOrderId;
  const seatId = seat.attr("id");
  if (isEditing && seatId)
    return store.dispatch(toggleSeatOrderItem(seatId.replace("seat-", "")));
  if (splittingOrder && seatId) {
    store.dispatch(toggleSplitOrderSeatIds([seatId.replace("seat-", "")]));
    seat.classed("active", !seat.classed("active"));
    seat.classed("active") ? addShadow(seat.node()) : removeShadow(seat.node());
    return;
  }
  let orderId = null;
  if (seatNode) {
    orderId = Array.from(seatNode.classList).find((i: string) =>
      i.includes("order-")
    );
    if (orderId && orderId.includes("order-"))
      orderId = orderId.replace("order-", "");
    if (orderId) store.dispatch(setCurOrder(orderId));
  }
  if (!seatNode || !orderId) seat.classed("active", !seat.classed("active"));
  // updateSelectedNodesList()
  updateHelpTips();
  toggleDragSelectedSeats();
};

export function addPricesStylesToDocumentHead(prices: IPrice[]) {
  const css = [] as string[];
  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");

  prices.forEach((price: IPrice) => {
    css.push(
      `.seat.prc_${price.id}{ stroke: ${price.color}; fill: ${price.color} }`
    );
  });

  head.appendChild(style);

  style.type = "text/css";
  style.appendChild(document.createTextNode(css.join("\n")));
}

export function removeTmpSeatCandidates() {
  select(canvas).selectAll(".tmp-spl-seat-candidate").remove();
  updateHelpTips();
}

export function revertChangedSeats() {
  select(canvas)
    .selectAll(".seat.has-changes")
    .each(function () {
      // @ts-ignore
      var el = select(this);
      el.attr("x", el.attr("restore-x"))
        .attr("y", el.attr("restore-y"))
        .classed("has-changes", false)
        .classed("active", false);
    });
  updateHelpTips();
}

const newRandomSeatID = () => `unsaved-seat-${Math.random()}`;

export function drawSeats(seats: ISeat[], selectSeats: boolean = false) {
  select(canvas)
    .selectAll("g.seat")
    .data(seats)
    .join(
      (enter: any) => {
        const g = enter
          .append("svg")
          .attr("x", (seat: ISeat) => seat.x)
          .attr("y", (seat: ISeat) => seat.y)
          .attr("width", SEAT_WIDTH)
          .attr("height", SEAT_WIDTH)
          .attr("timestamp", (seat: ISeat) =>
            moment(seat.updated_at).toDate().getTime()
          )
          .attr("class", (seat: ISeat) => {
            const css = [seat.price_id ? seat.price_id : ""];
            css.push(`status-${seat.status_code}`);
            if (seat.order_id) {
              css.push(`order-${seat.order_id}`);
            }
            if (seat.split_order_id) {
              css.push(`split-order order-${seat.split_order_id}`);
            }
            if (seat.status_code > 8 && !seat.order_id) {
              css.push("corrupt-seat");
            }
            if (!seat.id) {
              // new temporary seat is added
              css.push("tmp-spl-seat-candidate");
            }
            return css.join(" ");
          })
          .classed("seat", true)
          .attr("price-id", (seat: ISeat) => seat.price_id)
          .attr("seat-group-id", (seat: ISeat) => seat.seat_group_id)
          .attr("id", (seat: ISeat) => (seat.id ? seat.id : newRandomSeatID()))
          .on("mousedown.seat", toggleSeatActive);

        g.append("circle")
          .attr("cx", SEAT_WIDTH / 2)
          .attr("cy", SEAT_WIDTH / 2)
          .attr("stroke-width", SEAT_BORDER_WIDTH)
          .attr("r", SEAT_WIDTH / 2 - SEAT_BORDER_WIDTH);
        g.append("text")
          .attr("x", SEAT_WIDTH / 2)
          .attr("y", SEAT_WIDTH / 2 + 70)
          .attr("width", SEAT_WIDTH)
          .attr("height", SEAT_WIDTH)
          .attr("class", "seat-label")
          .attr("dominant-baseline", "baseline")
          .attr("text-anchor", "middle")
          .text((seat: ISeat) => seat.num);
        return g;
      },
      (update: any) => update.filter(filterSeatsChanges),
      (exit: any) => exit.transition().duration(1000).attr("width", 0).remove()
    );

  if (selectSeats) {
    deselectAllSeats();
    store.dispatch(setActiveTool(null));
    select(canvas)
      .selectAll(".tmp-spl-seat-candidate")
      .classed("active", true)
      .classed("active-mem", true);
    updateHelpTips();
    toggleDragSelectedSeats();
  }
}

export const duplicateSeats = () => {
  const seats: ISeat[] = [];
  const sgrs = [] as any;
  svg.selectAll(".seat.active").each(function () {
    // @ts-ignore
    const s = select(this);
    const sgrID = s.attr("seat-group-id");
    if (!sgrs.includes(sgrID)) sgrs.push(sgrID);
    seats.push({
      x: parseInt(s.attr("x")),
      y: parseInt(s.attr("y")) + SEAT_WIDTH + SEAT_BORDER_WIDTH,
      seat_group_id: sgrID,
      duplicate: true,
      num: parseInt(s.select("text").text()),
      price_id: s.attr("price-id"),
      status_code: 0,
    });
  });
  drawSeats(seats, true);
  store.dispatch(setSeatCandidates(seats));
};

export const getSvgSeatData = (seatId: string): ISeat | null => {
  if (!svg) return null;
  if (seatId.includes("unsaved")) return null;

  const seatEl = svg.select(`#${seatId}`);
  return {
    x: parseInt(seatEl.attr("x")),
    y: parseInt(seatEl.attr("y")),
    num: parseInt(seatEl.select("text").text()),
    status_code: 0,
    seat_group_id: "",
  };
};

export const setPriceIdForSeats = (priceId: string) => {
  if (!svg) return null;

  svg.selectAll(".seat.active").each(function () {
    // @ts-ignore this
    const svgSeat = select(this);
    if (svgSeat.attr("price-id")) {
      svgSeat.classed(svgSeat.attr("price-id"), false);
    }
    svgSeat.attr("price-id", priceId).classed(priceId, true);
  });
};
