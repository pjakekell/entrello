import React from "react";
import CmdKey from "./CmdKey";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { faLongArrowLeft } from "@fortawesome/pro-regular-svg-icons/faLongArrowLeft";
import { faLongArrowRight } from "@fortawesome/pro-regular-svg-icons/faLongArrowRight";
import { faLongArrowUp } from "@fortawesome/pro-regular-svg-icons/faLongArrowUp";
import { faLongArrowDown } from "@fortawesome/pro-regular-svg-icons/faLongArrowDown";

export default function EditingKeys() {
  const { formatMessage: f } = useIntl();
  return (
    <>
      <CmdKey label="D" desc={f(messages.duplicateSelection)} />
      <CmdKey label="DEL" desc={f(messages.deleteSelection)} />
      <CmdKey
        icon={faLongArrowLeft}
        desc={f(messages.moveSelectionTo, { direction: f(messages.left) })}
      />
      <CmdKey
        icon={faLongArrowRight}
        desc={f(messages.moveSelectionTo, { direction: f(messages.right) })}
      />
      <CmdKey
        icon={faLongArrowUp}
        desc={f(messages.moveSelectionTo, { direction: f(messages.up) })}
      />
      <CmdKey
        icon={faLongArrowDown}
        desc={f(messages.moveSelectionTo, { direction: f(messages.down) })}
      />
    </>
  );
}
