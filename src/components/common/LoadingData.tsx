import React from "react";
import LoadingIcon from "../Btn/LoadingIcon";
import colors from "../../utils/colors";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";

export default function LoadingData() {
    const { formatMessage: f } = useIntl();
    return (
        <div className="text-center my-28">
            <div className="flex justify-center mt-4">
                <LoadingIcon color={colors.brand[500]} size={80} />
            </div>
            <div className="font-bold text-xs uppercase text-brand-500 mt-4 tracking-wide">
                {f(messages.loading)}
            </div>
        </div>
    );
};