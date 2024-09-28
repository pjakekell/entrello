import { all, fork } from "redux-saga/effects";
import { sagas as spl } from "../components/Spl/logic";
import { sagas as orders } from "./modules/orders/watcher";
// import { sagas as eventForm } from './components/SeatingPlanWizard/logic';

const collectedSagas: any[] = [spl, orders];

export default function* sagas() {
  const sagasForks = collectedSagas.map((saga) => fork(saga));
  yield all([...sagasForks]);
}

