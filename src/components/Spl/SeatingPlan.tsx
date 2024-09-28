import React, { useEffect, useCallback, useRef, useMemo, memo } from "react";
import { useDispatch } from "react-redux";
import svgPanZoom from "svg-pan-zoom";
import { useMatch } from "react-router-dom";
// import { useDrag } from 'react-dnd'

import { setZoomLevel } from "./logic";
import Grid from "./Grid";
import { bindSelection } from "./events/mouse";
import { bindSelection as bindKeySelection } from "./events/key";
import { bindShapeDrawingTool } from "./tools/draw_shape";
import {
  addPricesStylesToDocumentHead,
  bindSeats,
  drawSeats,
  bindSeatDrawingTool,
} from "./tools/draw_seat";
// import Fixture from './Shapes/Fixture'
// import SeatingPlanLayout from './SeatingPlanLayout'
// import TempSeats from './TempSeats'
// import Selection from './Selection'
// import Seats from './Seats'
// import TempShape from './TempShape'
// import Minimap from 'react-minimap'

export let panZoom: any;

const beforePan = function (_oldPan: any, newPan: any) {
  const gutterWidth = 100,
    gutterHeight = 100,
    // @ts-ignore
    sizes = this.getSizes(),
    leftLimit =
      -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth,
    rightLimit = sizes.width - gutterWidth - sizes.viewBox.x * sizes.realZoom,
    topLimit =
      -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) +
      gutterHeight,
    bottomLimit =
      sizes.height - gutterHeight - sizes.viewBox.y * sizes.realZoom;

  // console.log(rightLimit, topLimit)
  const customPan = { x: 0, y: 0 };
  customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
  customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));

  return customPan;
};

interface IDim {
  width: number;
  height: number;
}

interface ISeatingPlanParams {
  event: any;
  curLayer?: any;
}

export default memo(({ event }: ISeatingPlanParams) => {
  const { seating_plan, id: eventID, prices } = event;
  const isEditing = useMatch("/events/:id/spl/edit");
  const dispatch = useDispatch();

  // const [state, dispatch] = useReducer(reducer, initialState)
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<SVGSVGElement>(null);

  const onZoom = useCallback(
    (zoomLevel: any) => dispatch(setZoomLevel(zoomLevel)),
    [dispatch]
  );
  const dim = useMemo<IDim>(
    () => ({
      width: seating_plan.w || 20000,
      height: seating_plan.h || 20000,
    }),
    [seating_plan.h, seating_plan.w]
  );

  const initSvgPanZoom = useCallback(() => {
    // @ts-ignore
    panZoom = svgPanZoom(svgRef.current, {
      beforePan,
      fit: true,
      center: true,
      panEnabled: false,
      maxZoom: (dim.width * dim.height) / 35000000,
      // customEventsHandler: svgPanZoomEventHandlers,
      onZoom,
    });
  }, [dim, onZoom]);

  const initD3 = useCallback(() => {
    if (canvasRef && canvasRef.current) {
      // bindFixtures(canvasRef.current);
      // drawFixtures(curLayer.fixtures);
    }
    if (!svgRef.current) return;

    bindSelection(svgRef.current);
    bindKeySelection(svgRef.current);
    bindShapeDrawingTool(svgRef.current, eventID);
    bindSeatDrawingTool(svgRef.current);
  }, [eventID]);

  const initSeatsDrawingKit = useCallback(() => {
    if (canvasRef && canvasRef.current) {
      bindSeats(canvasRef.current);
      addPricesStylesToDocumentHead(prices);
      drawSeats(seating_plan.seats);
    }
  }, [seating_plan.seats, prices]);

  useEffect(() => {
    if (!svgRef.current || !canvasRef.current) return;
    initSvgPanZoom();
    initD3();
    initSeatsDrawingKit();
  }, [initD3, initSvgPanZoom, initSeatsDrawingKit]);

  // @ts-ignore
  return (
    <svg
      ref={svgRef}
      width="100%"
      height={window.innerHeight}
      viewBox={`0 0 ${dim.width + 1000} ${dim.height + 1000}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="blur-eff" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="90" />
        </filter>
      </defs>
      <Grid hidden={isEditing === null} />
      <rect className="wall" x={500} y={500} {...dim} />
      <g className="shadow-area" />
      <g className="drawing-area" id="drawing-area" ref={canvasRef} />
    </svg>
  );
});
