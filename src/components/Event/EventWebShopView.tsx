import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useIntl } from "react-intl";
import { useFormik } from "formik";
import { useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router";
import { sprintf } from "sprintf-js";
import CodeMirror from "@uiw/react-codemirror";
import { faCode } from "@fortawesome/pro-light-svg-icons";
import { faLink } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { toast } from "react-toastify";

import StepRange from "../Range/StepRange";
import HtmlEditor from "../common/HtmlEditor";
import UnitInputField from "../FormHelpers/UnitInputField";
import FormatDateTime from "../common/FormatDateTime";
import SuperSwitch from "../Switch/SuperSwitch";

import messages from "../../i18n/messages";
import { UPDATE_EVENT_SETTINGS, EVENT_RULE_FORCE_FULL_GROUP, EVENT_RULE_NO_SINGLE_SEAT_GAP } from "./logic";
import { useEvent } from "../../hooks/useEvent";
import { useOrgInfo } from "../../hooks/useOrgInfo";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { convertHtml } from "../../utils/common";

interface ICopyBtn {
  onClick?: any;
  icon: IconProp;
  tooltip?: any;
}
const CopyBtn = ({ icon, tooltip, onClick }: ICopyBtn) => {
  return (
    <button
      type="button"
      className="group relative flex justify-center items-center rounded-full ml-1 w-6 h-6 border border-solid border-slate-700 hover:bg-slate-700 hover:text-white"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className="w-3 h-3" />
      {tooltip ? (
        <div className="absolute tooltip-text bottom-6 hidden group-hover:block">
          <div className="flex flex-col relative z-10 h-8 items-center justify-center">
            <div className="p-2 text-xs leading-none text-white whitespace-nowrap bg-gray-600 shadow-lg z-10 min-w-min">
              {tooltip}
            </div>
          </div>
        </div>
      ) : null}
    </button>
  );
};

const EventWebShopView = () => {
  const edjsHTML = require("editorjs-html");
  const edjsParser = edjsHTML();
  const { formatMessage: f } = useIntl();
  const { dataOrgInfo } = useOrgInfo();
  const { id } = useParams();
  const [event] = useEvent(id || "");
  const linkRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const eventStartsAt = useMemo(() => {
    const element = document.getElementById("event_starts_at");
    return element?.innerText || "";
  }, []);
  const ticketLink = useMemo(() => {
    return `${process.env.REACT_APP_SHOP_HOSTNAME}/${dataOrgInfo?.org.slug}/e/${id}`;
  }, [dataOrgInfo, id]);
  let toastId = useRef<any | null>(null);
  const [switchEnabled, setSwitchEnabled] = useState({
    forceFullGroup: false,
    noSingleSatGap: false
  });

  useEffect(() => {
    const initializeValues = () => {
      formik.setFieldValue("rules", event.rules);
      setSwitchEnabled({
        forceFullGroup: !!(event.rules & EVENT_RULE_FORCE_FULL_GROUP),
        noSingleSatGap: !!(event.rules & EVENT_RULE_NO_SINGLE_SEAT_GAP)
      });
    }
    initializeValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async () => {
    try {
      const settings = { 
        ...formik.values,
        additional_info_email: {
          ...formik.values.additional_info_email,
          html: convertHtml(edjsParser.parse(formik.values.additional_info_email))
        },
        visitor_reminder: {
          ...formik.values.visitor_reminder,
          html: convertHtml(edjsParser.parse(formik.values.visitor_reminder))
        },
        custom_booking_locked: {
          ...formik.values.custom_booking_locked,
          html: convertHtml(edjsParser.parse(formik.values.custom_booking_locked))
        }
      };
      let rules = 0;
      if(switchEnabled.forceFullGroup)
        rules |= EVENT_RULE_FORCE_FULL_GROUP;
      if(switchEnabled.noSingleSatGap)
        rules |= EVENT_RULE_NO_SINGLE_SEAT_GAP;
      settings.rules = rules;

      const response = await updateEventSettings({
        variables: { id, input: { settings } },
      });
      if (response) {
        navigate("/events");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onDebouncedSave = useDebouncedCallback(() => {
    onSubmit();
  }, 500);

  const copyContentLink = useCallback(
    (key) => {
      if (!linkRef.current) return;

      if (key === "content") {
        navigator.clipboard.writeText(linkRef.current.innerHTML);
      }
      if (key === "link") {
        navigator.clipboard.writeText(ticketLink);
      }

      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success(f(messages.copiedClipboard), {
          closeOnClick: false,
          toastId: "copy_clipboard",
          autoClose: 3000,
          closeButton: false,
        });
      } else {
        console.error("Toast already active");
      }
    },
    [f, ticketLink]
  );

  const formik = useFormik({
    initialValues: {
      additional_info_email: {},
      visitor_reminder: {},
      enable_reminder: false,
      custom_printer_code: "",
      custom_printer_title: "",
      rules: 0,
      close_sale_min_before_starts_at: 60,
      hold_claims_min: 15,
      close_sale_booking_perc: 1,
      qty_preselected_tickets: 2,
      max_qty_tickets: 8,
      custom_booking_locked: {},
    },
    onSubmit,
  });
  const [editedHtml, setEditedHtml] = useState({
    customBooking: {},
    additionalInfoEmail: {},
    visitorReminder: {
      time: 1635603431943,
      blocks: [
        {
          type: "paragraph",
          data: {
            text: sprintf(
              f(messages.visitorReminderDefaultText),
              formik.values.qty_preselected_tickets,
              event?.title,
              eventStartsAt
            ),
          },
        },
      ],
    },
  });
  
  const [updateEventSettings] = useMutation(
    UPDATE_EVENT_SETTINGS
  );

  const handleChangeSwitch = useCallback((value: boolean, key: string) => {
    if(key === "forceFullGroup" || key === "noSingleSatGap") {
      setSwitchEnabled(prev => ({
        ...prev,
        [key]: value
      }))
    }
    else {
      formik.setFieldValue(key, value);
    }
  }, [formik]);

  const handleRangeChange = useCallback(
    (value, hiddenValues, key) => {
      if (
        !hiddenValues.find((v: string) => parseFloat(v) === parseFloat(value))
      )
        formik.setFieldValue(key, value);
    },
    [formik]
  );

  useEffect(() => {
    onDebouncedSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik?.values, switchEnabled]);

  useEffect(() => {
    formik.setFieldValue("custom_booking_locked", editedHtml.customBooking);
    formik.setFieldValue(
      "additional_info_email",
      editedHtml.additionalInfoEmail
    );
    formik.setFieldValue("visitor_reminder", editedHtml.visitorReminder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedHtml]);

  return (
    <>
      <form className="p-10" onSubmit={formik.handleSubmit}>
        <div>
          <h2 className="mb-4 text-xl font-medium text-gray-400">
            {f(messages.visitorNotifications)}
          </h2>
          <div className="ml-4 mb-6">
            <h3 className="text-lg font-medium text-gray-400 leading-5">
              {f(messages.additionalEmailInformation)}
            </h3>
            <label className="text-sm font-normal text-gray-400">
              {f(messages.addBookingConfirmatioinEmailInformation)}
            </label>
            <HtmlEditor
              holder="additionalInfoEmail"
              className="text-sm font-normal text-gray-400 toolbar-small-right"
              setData={(value: any) =>
                setEditedHtml({
                  ...editedHtml,
                  additionalInfoEmail: value,
                })
              }
              data={editedHtml.additionalInfoEmail}
              minHeight={20}
            />
          </div>
          <div className="ml-4 mb-6">
            <h3 className="text-lg font-medium text-gray-400 leading-5">
              {f(messages.visitorReminder)}
            </h3>
            <label className="text-sm font-normal text-gray-400">
              {f(messages.remindVisitorsXDays)}
            </label>
            <HtmlEditor
              holder="visitorReminder"
              className="text-sm font-normal text-gray-400 toolbar-small-right"
              setData={(value: any) =>
                setEditedHtml({
                  ...editedHtml,
                  visitorReminder: value,
                })
              }
              data={editedHtml.visitorReminder}
              minHeight={20}
            />
          </div>
          <div className="ml-4 mb-12">
            <SuperSwitch
              label={f(messages.enableReminder)}
              description=""
              enabled={formik.values.enable_reminder}
              setEnabled={(value) => handleChangeSwitch(value, "enable_reminder")}
            />
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-xl font-medium text-gray-400">
            {f(messages.ticketPrinter)}
          </h2>
          <div className="ml-4 mb-6">
            <h3 className="text-lg font-medium text-gray-400 leading-5">
              {f(messages.customPrinterCode)}
            </h3>
            <div className="mt-1 shadow-sm border border-solid border-slate-200">
              <CodeMirror
                value={formik.values.custom_printer_code}
                height="100px"
                onChange={(value: any) =>
                  formik.setFieldValue("custom_printer_code", value)
                }
              />
            </div>
          </div>
          <div className="ml-4 mb-12">
            <h3 className="text-lg font-medium text-gray-400 leading-5">
              {f(messages.customTitlePrintTicket)}
            </h3>
            <div className="mt-1 shadow-sm border border-solid border-slate-200">
              <CodeMirror
                value={formik.values.custom_printer_title}
                height="100px"
                onChange={(value: any) =>
                  formik.setFieldValue("custom_printer_title", value)
                }
              />
            </div>
          </div>
        </div>
        <div className="mb-12">
          <h3 className="text-lg font-medium text-gray-400 leading-5">
            {f(messages.bookingRules)}
          </h3>
          <label className="text-sm font-normal text-gray-400">
            {f(messages.notAllowSingleSeat)}
          </label>
          <SuperSwitch
            label={f(messages.fullGroupBookings)}
            description={f(messages.mustSelectAllTickets)}
            enabled={switchEnabled.forceFullGroup}
            setEnabled={(value) => handleChangeSwitch(value, "forceFullGroup")}
          />
          <SuperSwitch
            label={f(messages.preventDefragmentation)}
            description={f(messages.denyVisitors)}
            enabled={switchEnabled.noSingleSatGap}
            setEnabled={(value) => handleChangeSwitch(value, "noSingleSatGap")}
          />
        </div>
        <div className="mb-12">
          <h2 className="mb-4 text-xl font-medium text-gray-400">
            {f(messages.integration)}
          </h2>
          <div className="flex justify-between">
            <p className="text-md font-medium text-gray-400">{event.title}</p>
            <div className="flex">
              <div ref={linkRef}>
                <a href={ticketLink} target="__blank">
                  <div className="flex items-center bg-brand-500 rounded-full pl-3 pr-1">
                    <p className="text-white text-md font-semibold">
                      {f(messages.tickets).toUpperCase()}
                    </p>
                    <div className="flex items-center justify-center font-medium rounded-full bg-white text-brand-500 w-5 h-5 ml-1">
                      tt
                    </div>
                  </div>
                </a>
              </div>
              <CopyBtn
                icon={faCode}
                tooltip={f(messages.copyContent)}
                onClick={() => copyContentLink("content")}
              />
              <CopyBtn
                icon={faLink}
                tooltip={f(messages.copyLink)}
                onClick={() => copyContentLink("link")}
              />
            </div>
          </div>
        </div>
        <div className="mb-12">
          <h3 className="text-lg font-medium text-gray-400 leading-5">
            {f(messages.shopCloseTime)}
          </h3>
          <label className="text-sm font-normal text-gray-400">
            {f(messages.defineMinuteHourAmount)}
          </label>
          <div className="flex items-center px-3 py-2 bg-white border border-solid border-gray-200 rounded-sm">
            <UnitInputField
              unit="min"
              value={formik.values.close_sale_min_before_starts_at}
              onChange={(e: any) =>
                handleRangeChange(e, [], "close_sale_min_before_starts_at")
              }
            />
          </div>
          <p className="text-sm mt-2 font-normal text-gray-400">
            {f(messages.notBuyTicket)}
          </p>
        </div>
        <div className="mb-12">
          <StepRange
            min={1}
            max={4}
            step={1}
            title={f(messages.ticketQuantityPreselect)}
            label={f(messages.defaultPreselectedQuantity)}
            value={formik.values.qty_preselected_tickets}
            onChange={(e: any, hiddenValues: Array<string>) =>
              handleRangeChange(e, hiddenValues, "qty_preselected_tickets")
            }
          />
        </div>
        <div className="mb-12">
          <StepRange
            min={1}
            max={10}
            step={1}
            title={f(messages.maxQuantityTicketPerOrder)}
            label={f(messages.bookSeatPerOrder)}
            value={formik.values.max_qty_tickets}
            onChange={(e: any, hiddenValues: Array<string>) =>
              handleRangeChange(e, hiddenValues, "max_qty_tickets")
            }
            hiddenValues={["6", "7", "9"]}
          />
        </div>
        <div className="mb-12">
          <StepRange
            min={15}
            max={30}
            step={5}
            title={f(messages.claimExpiry)}
            label={f(messages.claimSelectedTickets)}
            value={formik.values.hold_claims_min}
            onChange={(e: any, hiddenValues: Array<string>) =>
              handleRangeChange(e, hiddenValues, "hold_claims_min")
            }
            unit="min"
          />
        </div>
        <div>
          <StepRange
            min={10}
            max={100}
            step={5}
            title={f(messages.limitBookings)}
            label={f(messages.lockBooking)}
            value={formik.values.close_sale_booking_perc}
            onChange={(e: any, hiddenValues: Array<string>) =>
              handleRangeChange(e, hiddenValues, "close_sale_booking_perc")
            }
            unit="%"
            hiddenValues={[
              "15",
              "20",
              "25",
              "30",
              "35",
              "40",
              "45",
              "55",
              "60",
              "65",
              "70",
              "75",
              "85",
            ]}
          />
          <div className="mt-4">
            <HtmlEditor
              holder="customBooking"
              className="text-sm font-normal text-gray-400 toolbar-small-right"
              setData={(value: any) =>
                setEditedHtml({
                  ...editedHtml,
                  customBooking: value,
                })
              }
              data={editedHtml.customBooking}
              minHeight={20}
              placeholder={f(messages.inputText)}
            />
          </div>
          <p id="event_starts_at" className="hidden">
            <FormatDateTime timeZone="Europe/Berlin" date={event.starts_at} />
          </p>
        </div>
      </form>
    </>
  );
};

export default EventWebShopView;
