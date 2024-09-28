import React, { useEffect, useState, useCallback } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useMatch } from "react-router-dom";
import { panZoom } from "./SeatingPlan";
import { enableDrawShapes } from "./tools/draw_shape";
import messages from "../../i18n/messages";

import {
  selectAllSeats,
  deselectAllSeats,
  // disableSelection,
  enablePanCanvasMouseDown,
  disablePanCanvasMouseDown,
  enableSeatsRectSelection,
} from "./events/mouse";

import { duplicateSeats } from "./tools/draw_seat";

import { moveSeats } from "./events/key";

import { classNames } from "../../utils/misc";

import AddSeatsModal from "./AddSeatsModal";

import {
  setActiveTool,
  selectActiveTool,
  selectActiveSeatIds,
  toggleGrid,
  selectShowGrid,
} from "./logic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMousePointer } from "@fortawesome/pro-solid-svg-icons/faMousePointer";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEye } from "@fortawesome/pro-regular-svg-icons/faEye";
import { faArrowsAlt } from "@fortawesome/pro-regular-svg-icons/faArrowsAlt";
import { faSearchPlus } from "@fortawesome/pro-regular-svg-icons/faSearchPlus";
import { faSearchMinus } from "@fortawesome/pro-regular-svg-icons/faSearchMinus";
import { faBorderAll } from "@fortawesome/pro-regular-svg-icons/faBorderAll";
import { faPencilAlt } from "@fortawesome/pro-regular-svg-icons/faPencilAlt";
import { faChair } from "@fortawesome/pro-regular-svg-icons/faChair";
import { faCompress } from "@fortawesome/pro-regular-svg-icons/faCompress";

function enablePanCanvas() {
  const splWrap = document.getElementsByClassName("spl-canvas");
  if (splWrap && splWrap.length > 0) splWrap[0].className = "spl-canvas grab";
  panZoom.enablePan();
  enablePanCanvasMouseDown();
}

function disablePanCanvas() {
  const splWrap = document.getElementsByClassName("spl-canvas");
  if (splWrap && splWrap.length > 0) splWrap[0].className = "spl-canvas";
  panZoom.disablePan();
  disablePanCanvasMouseDown();
}

interface IToolbarBtn {
  onClick?: any;
  icon: IconProp;
  name?: string;
  border?: boolean;
  tooltip?: any;
}

function ToolbarBtn({ icon, border, tooltip, onClick, name }: IToolbarBtn) {
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const activeTool = useSelector(selectActiveTool);

  const handleClick: any = (e: React.MouseEventHandler) => {
    if (onClick) return onClick(e);
    if (!name) return;

    dispatch(setActiveTool(name));
    enableTool(name);
  };

  const enableTool = (name: string) => {
    const tools = {
      select: enableSeatsRectSelection,
      shape: enableDrawShapes,
      seat: () => {},
      move: enablePanCanvas,
      null: () => {},
    } as any;
    if (!tools[name]) throw Error(`tool with name ${name} has no listener`);
    // if (name !== "select") disableSelection();
    if (name !== "move") disablePanCanvas();
    tools[name]();
  };

  const enableToolCallback = useCallback(enableTool, []);

  useEffect(() => {
    enableToolCallback(activeTool);
    return;
  }, [activeTool, enableToolCallback]);

  return (
    <div
      className={classNames(
        "w-10 h-10 cursor-pointer group hover:bg-gray-400 relative",
        activeTool === name ? " bg-indigo-300" : "",
        border ? " border-t border-gray-300" : ""
      )}
      onClick={handleClick}
    >
      <div className="p-2 flex items-center justify-center">
        <FontAwesomeIcon
          icon={icon}
          className={classNames(
            "group-hover:text-white w-6 h-6 flex items-center justify-center",
            activeTool === name ? " text-white" : "text-gray-500"
          )}
        />
      </div>
      {tooltip ? (
        <div className="absolute left-12 top-1 bottom-0 hidden group-hover:block">
          <div className="flex flex-col relative z-10 h-8 items-center justify-center">
            <div className="absolute top-6 -ml-1 left-0 w-4 h-4 -mt-4 block transform rotate-45 bg-gray-600 z-1"></div>
            <div className="p-2 text-xs leading-none text-white whitespace-nowrap bg-gray-600 shadow-lg z-10 min-w-min">
              {f(tooltip)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Toolbar() {
  const dispatch = useDispatch();
  const [showAddSeatsModal, setShowAddSeatsModal] = useState(false);
  const showGrid = useSelector(selectShowGrid);
  const isEditing = useMatch("/events/:id/spl/edit");
  const navigate = useNavigate();
  const location = useLocation();
  const activeSeatIds = useSelector(selectActiveSeatIds);
  const activeSeatsCount = activeSeatIds.length;

  const activeToolKeys = {
    77: "move", // m
    86: "select", // v
    83: "seat", // s
    82: "shape", // r
  } as any;

  const directToolActions = {
    27: () => deselectAllSeats(), // esc
    71: () => dispatch(toggleGrid(!showGrid)), // g
    48: () => panZoom.fit(), // 0
    187: () => panZoom.zoomIn(), // +
    189: () => panZoom.zoomOut(), // -
    // 46: () => dispatch(deleteActiveElement), // DELETE
    // 8: () => dispatch(deleteActiveElement), // BACKSPACE
  } as any;

  const selectionActions = {
    65: () => selectAllSeats(), // a
  } as any;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      window.location.pathname.split("/spl").length > 1 &&
      window.location.pathname.split("/spl")[1] !== "/edit"
    )
      return;

    // console.log(e.keyCode);
    if (directToolActions[e.keyCode]) {
      directToolActions[e.keyCode]();
    }
    if (selectionActions[e.keyCode]) {
      selectionActions[e.keyCode]();
    }
    if (activeSeatsCount < 1) return;

    if (!window.location.pathname.includes("/spl/edit")) return;

    if (activeToolKeys[e.keyCode]) {
      dispatch(setActiveTool(activeToolKeys[e.keyCode]));
    }
    switch (e.keyCode) {
      case 37:
      case 38:
      case 39:
      case 40:
        moveSeats(e.keyCode, e.shiftKey);
        break;
      case 68:
        duplicateSeats();
    }
  };

  const handleCloseEdit = (_e: MouseEvent) => {
    navigate(location.pathname.replace("/edit", ""));
  };

  const handleOpenEdit = (_e: MouseEvent) => {
    if (location.pathname.includes("/edit")) return;

    navigate(`${location.pathname}/edit`);
  };

  const handleAddSeats = () => setShowAddSeatsModal(true);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  useEffect(() => {
    if (isEditing) return;

    enableSeatsRectSelection();
  }, [isEditing]);

  if (isEditing)
    return (
      <div className="absolute left-2 top-0 bottom-0 flex justify-center items-center">
        <div className="bg-white rounded shadow">
          <ToolbarBtn
            onClick={handleCloseEdit}
            tooltip={messages.backToViewMode}
            icon={faEye}
          />
          <ToolbarBtn
            name="select"
            border
            tooltip={messages.selectSection}
            icon={faMousePointer}
          />
          <ToolbarBtn
            name="move"
            tooltip={messages.moveViewport}
            icon={faArrowsAlt}
          />
          <ToolbarBtn
            onClick={() => panZoom.zoomIn()}
            tooltip={messages.zoomIn}
            icon={faSearchPlus}
          />
          <ToolbarBtn
            onClick={() => panZoom.fit()}
            tooltip={messages.resetZoom}
            icon={faCompress}
          />
          <ToolbarBtn
            onClick={() => panZoom.zoomOut()}
            tooltip={messages.zoomOut}
            icon={faSearchMinus}
          />
          <ToolbarBtn
            onClick={() => dispatch(toggleGrid(!showGrid))}
            tooltip={messages.toggleGrid}
            icon={faBorderAll}
          />
          <ToolbarBtn
            onClick={handleAddSeats}
            border
            tooltip={messages.addSeats}
            icon={faChair}
          />
        </div>
        <AddSeatsModal
          open={showAddSeatsModal}
          handleClose={() => setShowAddSeatsModal(false)}
        />
      </div>
    );

  return (
    <div className="absolute left-2 top-0 bottom-0 flex justify-center items-center">
      <div className="bg-white rounded shadow">
        <ToolbarBtn onClick={handleOpenEdit} icon={faPencilAlt} />
      </div>
    </div>
  );
}
