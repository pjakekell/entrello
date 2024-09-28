import {
  faSquareCheck,
  faSquarePen,
  faReceipt,
  faCashRegister,
  faArrowLeftLongToLine,
  faFaceScream,
  faDeleteLeft,
  faBadgeCheck,
  faSquareMinus,
  faSquareXmark,
  faDownload,
  faPrint,
} from "@fortawesome/pro-regular-svg-icons";

export const orderStatusIcons = {
  1201: [faSquareCheck, "bg-blue-400"],
  1202: [faSquarePen, "bg-blue-400"],
  1301: [faReceipt, "bg-blue-400"],
  1302: [faCashRegister, "bg-green-400"],
  // refunded
  1501: [faArrowLeftLongToLine, "bg-yellow-400"],
  // deleted
  1502: [faDeleteLeft, "bg-blue-400"],
  7000: [faFaceScream, "bg-blue-400"],
  2201: [faBadgeCheck, "bg-blue-400"],
  2202: [faSquarePen, "bg-blue-400"],
  2501: [faSquareMinus, "bg-blue-400"],
  2502: [faArrowLeftLongToLine, "bg-yellow-400"],
  3203: [faSquareXmark, "bg-blue-400"],
  3201: [faSquareCheck, "bg-blue-400"],
  3202: [faCashRegister, "bg-green-400"],
  3501: [faDeleteLeft, "bg-blue-400"],
  4001: [faDownload, "bg-blue-400"],
  4002: [faPrint, "bg-grey-400"],
} as any;
