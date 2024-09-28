import { MouseEvent } from "react";
import { select, pointer } from "d3-selection";
import first from "lodash/first";
import "d3-transition";
import { CREATE_SHAPE } from "../logic";
import { FETCH_EVENT_BY_ID } from "../../Event/logic";
import { client } from "../../../apollo-client";
import { setMsg } from "../../Toaster/logic";
import store from "../../../store/store";
import { intl } from "../../../locale";
import messages from "../../../i18n/messages";
import update from "immutability-helper";
import { ILayer } from "../interfaces";

let selectionRect: any;
let mStart: any;
let mEnd: any;
let svg: any;
// let canvas: SVGSVGElement;
let eventID: string;

const { formatMessage: f } = intl;

export function bindShapeDrawingTool(svgEl: SVGSVGElement, dateID: string) {
  svg = select(svgEl);
  eventID = dateID;
}

export function enableDrawShapes() {
  if (!svg || svg.size() < 1)
    throw Error("svg element not initialized in draw_shape");

  svg.on("mousedown", mousedown).on("mouseup", mouseup);

  function mousedown(e: MouseEvent) {
    mStart = pointer(e, e.target);

    selectionRect = svg
      .select(".drawing-area")
      .append("rect")
      .classed("spl-shape temp-drawing-shape", true)
      .attr("x", mStart[0])
      .attr("y", mStart[1])
      .attr("height", 0)
      .attr("width", 0);

    svg.on("mousemove", mousemove);
  }

  function mousemove(e: MouseEvent) {
    mEnd = pointer(e, e.target);

    if (mEnd[0] < mStart[0])
      selectionRect
        .attr("x", mEnd[0])
        .attr("width", Math.max(0, mStart[0] - +mEnd[0]));
    else
      selectionRect
        .attr("x", mStart[0])
        .attr("width", Math.max(0, mEnd[0] - +mStart[0]));

    if (mEnd[1] < mStart[1])
      selectionRect
        .attr("y", mEnd[1])
        .attr("height", Math.max(0, mStart[1] - +mEnd[1]));
    else
      selectionRect
        .attr("y", mStart[1])
        .attr("height", Math.max(0, mEnd[1] - +mStart[1]));
  }

  function mouseup() {
    svg.on("mousemove", null);
    createShape();
    mStart = null;
    mEnd = null;
    svg.selectAll(".temp-drawing-shape").remove();
  }
}

async function createShape() {
  if (!mStart || !mEnd) return;

  const x = mStart[0] < mEnd[0] ? mStart[0] : mEnd[0];
  const y = mStart[1] < mEnd[1] ? mStart[1] : mEnd[1];
  const w =
    mStart[0] < mEnd[0]
      ? Math.max(0, mEnd[0] - +mStart[0])
      : Math.max(0, mStart[0] - +mEnd[0]);
  const h =
    mStart[1] < mEnd[1]
      ? Math.max(0, mEnd[1] - +mStart[1])
      : Math.max(0, mStart[1] - +mEnd[1]);
  const variables = {
    location: [parseInt(x), parseInt(y)],
    dim: [w | 0, h | 0], // bitwise or operator truncates out all floating positions
    event_id: eventID,
  };
  const updateMutation = (_cache: any, result: any) => {
    const { seating_plan }: any = client.readQuery({
      query: FETCH_EVENT_BY_ID,
      variables: { id: eventID },
    });
    const layer: ILayer = first(seating_plan.layers) as ILayer; // this is just fake should be set somewhere in redux
    const layerIndex = seating_plan.layers.findIndex(
      (lyr: any) => lyr.id === layer.id
    );
    const data = {
      seating_plan: update(seating_plan, {
        layers: {
          [layerIndex]: {
            fixtures: {
              $push: [result.data.createFixture],
            },
          },
        },
      }),
    };
    client.writeQuery({
      query: FETCH_EVENT_BY_ID,
      variables: { id: eventID },
      data,
    });
    drawFixtures(data.seating_plan.layers[layerIndex].fixtures);
  };
  try {
    const { data } = await client.mutate({
      variables,
      mutation: CREATE_SHAPE,
      update: updateMutation,
    });
    console.log("data here", data);
  } catch (error) {
    store.dispatch(setMsg({ title: f(messages.abortedShapeTooSmall) }));
  }
}

// function filterFixtureChanges(fi: IFixture) {
//   // @ts-ignore this
//   const dateStr = select(this).attr("timestamp");
//   if (!dateStr) return true;

//   return (
//     moment(dateStr).toDate().getTime() !==
//     moment(fi.updated_at).toDate().getTime()
//   );
// }

// export function bindFixtures(canvasEl: SVGSVGElement) {
//   canvas = canvasEl;
// }

export function drawFixtures(fixtures: any[]) {
  return;
  // select(canvas)
  //   .selectAll("g.fixture")
  //   .data(fixtures)
  //   .join(
  //     (enter: any) =>
  //       enter
  //         .append("g")
  //         .classed("fixture", true)
  //         .attr("id", (fi: IFixture) => fi.id)
  //         .append("rect")
  //         .attr("width", (fi: IFixture) => fi.dim[0])
  //         .attr("height", (fi: IFixture) => fi.dim[1])
  //         .attr("x", (fi: IFixture) => fi.location[0])
  //         .attr("timestamp", (fi: IFixture) =>
  //           moment.isDate(fi.updated_at)
  //             ? moment(fi.updated_at).toDate().getTime()
  //             : null
  //         )
  //         .attr("y", (fi: IFixture) => fi.location[1]),
  //     (update: any) => update.filter(filterFixtureChanges),
  //     (exit: any) => exit.transition().duration(1000).attr("width", 0).remove()
  //   );
}
