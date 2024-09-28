import { select } from "d3-selection";
import { SEAT_WIDTH } from "./seat_dimensions";
import { IOrder, IOrderItem } from "../../Orders/interfaces";
import { convertOrderStatus2SeatStatus } from "../../Orders/logic";

export function disableInactiveSeats(orderID: string) {
  select(".drawing-area")
    .selectAll(`.seat:not(.order-${orderID})`)
    .classed("disabled", true);
  select(".drawing-area")
    .selectAll(`.order-${orderID}`)
    .classed("active", false);
  select(".shadow-area").selectAll(".shadow").remove();
}

export function enableAllSeats() {
  select(".drawing-area").selectAll(".seat").classed("disabled", false);
}

export function addOrderIdToSeats(seatIDs: string[], orderID: string) {
  seatIDs.forEach((seatID: string) => {
    // @ts-ignore
    const s = window.document.getElementById(`${seatID}`);
    select(s)
      .classed(`order-${orderID}`, true)
      .classed("active", true)
      .classed("status-16", true)
      .classed("status-0", false);
    addShadow(s);
  });
}

export function setActiveSeatsByOrderId(id: string) {
  select(".drawing-area").selectAll(".active").classed("active", false);
  select(".drawing-area").selectAll(".deleted").classed("deleted", false);
  select(".drawing-area").selectAll(".shadow").remove();
  select(".drawing-area")
    .selectAll(`.seat.order-${id}`)
    .classed("active", true)
    .each(function () {
      // @ts-ignore
      addShadow(this);
    });
}

export const addShadow = (node: any) => {
  const el = select(node);
  select(".shadow-area")
    .insert("circle", ":first-child")
    .classed("shadow active-shadow", true)
    .classed(`shadow-${el.attr("id")}`, true)
    .attr("r", SEAT_WIDTH)
    .attr("filter", 'url("#blur-eff")')
    .attr("cx", parseInt(el.attr("x")) + SEAT_WIDTH / 2)
    .attr("cy", parseInt(el.attr("y")) + SEAT_WIDTH / 2);
};

export const removeShadow = (node: any) => {
  const el = select(node);
  select(".shadow-area")
    .select(`.shadow-${el.attr("id")}`)
    .remove();
};

export function setHighlightSeat(
  id: string | undefined,
  className: string,
  on: boolean
) {
  if (!id) return;

  if (className === "highlight") {
    select(".drawing-area")
      .selectAll(`.${className}`)
      .classed(className, false);
  }
  const seatEl = select(`#seat-${id}`);
  seatEl.classed(className, on);
  if (className === "active") {
    on ? addShadow(seatEl.node()) : select(`.shadow-seat-${id}`).remove();
  }
  select(`.shadow-seat-${id}`).classed(className, on);
}

const updateSeatsWithOrderId = (id: string, items: IOrderItem[]) => {
  select(".drawing-area")
    .selectAll(`.order-${id}`)
    .classed(`order-${id}`, false);

  items.forEach((item: IOrderItem) => {
    if (!item.seat_id) return;

    select(".drawing-area")
      .select(`#${item.seat_id}`)
      .classed(`order-${id}`, true);
  });
};

export function updateOrderSeats(order: IOrder) {
  const removeStatus = (el: any) =>
    el
      .attr("class")
      .split(" ")
      .filter((cn: string) => !cn.includes("status-"))
      .join(" ");

  if (order.order_items) updateSeatsWithOrderId(order.id, order.order_items);

  select(".drawing-area")
    .selectAll(`.seat.order-${order.id}`)
    .each(function () {
      // @ts-ignore
      const el = select(this);
      removeStatus(el);
      const status = convertOrderStatus2SeatStatus(order.status_code);
      el.attr("class", `seat status-${status} order-${order.id}`);
    });
}

export function deleteSvgSeats(ids: Array<string>) {
  ids.forEach((id: string) => {
    console.log(
      "deleting",
      id,
      select(".drawing-area").select(`#${id}`).remove()
    );
    select(".drawing-area").select(`#${id}`).remove();
  });
}
