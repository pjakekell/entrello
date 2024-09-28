import { combineReducers } from "redux";
import { reducer as spl } from "../components/Spl/logic";
import { reducer as orders } from "../store/modules/orders/reducer";
import { reducer as toaster } from "../components/Toaster/logic";

export default combineReducers({
  spl,
  orders,
  toaster,
});
