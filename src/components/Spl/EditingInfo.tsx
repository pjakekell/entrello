import React from "react";
// import { IconButton } from '@material-ui/core'
// import { Tooltip } from '@blueprintjs/core'
import { useIntl } from "react-intl";
// import GridOnIcon from '@material-ui/icons/GridOn'
// import GridOffIcon from '@material-ui/icons/GridOff'
// import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap'
// import EventSeatIcon from '@material-ui/icons/EventSeat'
// import AddIcon from '@material-ui/icons/Add'
// import RemoveIcon from '@material-ui/icons/Remove'
// import CheckIcon from '@material-ui/icons/Check'
// import { panZoom } from './SeatingPlan'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { enableDrawShapes } from './tools/draw_shape'

import messages from "../../i18n/messages";

const CmdKey = ({ label, icon, tooltip }: any) => (
  <div className={`cmd-key${label ? " with-lbl" : ""}`}>
    {icon ? <FontAwesomeIcon icon={icon} /> : null}
    {tooltip && label ? <span className="cmd-key-lbl">{label}</span> : null}
  </div>
);

export default function EditingInfo() {
  // const dispatch = useDispatch()
  const { formatMessage: f } = useIntl();

  // const cWrap = useRef(null)
  // let [secs, setSecs] = useState([])

  // useEffect() => {
  //   if (!cWrap.current) return

  //   cWrap.current
  //     .getElementsByClassName('seat active')
  //     .forEach
  //   setSecs()
  // }, [activeSeats, secs])

  return (
    <div className="spl-editing-info">
      <div className="sel-seats-count-shadow" />
      <div className="row">
        <div className="col">
          <label>{f(messages.commandKeys)}</label>
          <div className="cmd-keys justify-content-start">
            <CmdKey label="D" tooltip={f(messages.duplicate)} />
            <CmdKey label="G" tooltip={f(messages.selectGroup)} />
            <CmdKey label="S" tooltip={f(messages.selectSection)} />
            <CmdKey label="DEL" tooltip={f(messages.delete)} />
            <CmdKey label="ESC" tooltip={f(messages.cancelSelection)} />
          </div>
        </div>
        <div className="col text-right">
          <label>{f(messages.move)}</label>
          <div className="cmd-keys justify-content-end">
            <CmdKey icon="arrow-left" />
            <CmdKey icon="arrow-right" />
            <CmdKey icon="arrow-up" />
            <CmdKey icon="arrow-down" />
          </div>
        </div>
      </div>
    </div>
  );
}
