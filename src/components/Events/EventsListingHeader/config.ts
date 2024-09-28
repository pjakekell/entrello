import dayjs from "dayjs";

export const labelsOptions = [
  { name: "Orange" },
  { name: "Blue" },
  { name: "Red" },
  { name: "Yellow" },
  { name: "Indigo" },
  { name: "Purple" },
];

export const statusCodeOptions = [
  { name: "Closed" },
  { name: "On sale" },
  { name: "Published" },
  { name: "Moved" },
  { name: "Force Sold Out" },
  { name: "Cancelled" },
  { name: "Waiting Room" },
];

export const DatePickerStyles = {
  weekend: {
    color: "#4F46E5 !important",
  },
  hover: {
    borderRadius: "50%",
  },
  selected: {
    backgroundColor: "rgba(232, 83, 0) !important",
    color: "white !important",
    borderRadius: "50%",
  },
};

// default from is beginning of today
const defaultFrom = dayjs().startOf("day");
export const fromEventFilter =
  localStorage.getItem("fromEventFilter") &&
  dayjs(parseInt(localStorage.getItem("fromEventFilter") || "")).isValid()
    ? dayjs(parseInt(localStorage.getItem("fromEventFilter") || "")).toDate()
    : defaultFrom.toDate();

export const toEventFilter =
  localStorage.getItem("toEventFilter") &&
  dayjs(parseInt(localStorage.getItem("toEventFilter") || "")).isValid()
    ? dayjs(parseInt(localStorage.getItem("toEventFilter") || "")).toDate()
    : null;

export const statuses = Boolean(localStorage.getItem("statuses"))
  ? JSON.parse(localStorage["statuses"] || "[]")
  : [];

export const labels = Boolean(localStorage.getItem("labels"))
  ? JSON.parse(localStorage["labels"] || "[]")
  : [];

export const seasonsOptions = [
  { id: 1, name: "2020/21" },
  { id: 2, name: "2021/22" },
];

export const initialSeason = Boolean(localStorage.getItem("labels"))
  ? JSON.parse(localStorage.getItem("selectedSeason") || "[]")
  : seasonsOptions[0];
