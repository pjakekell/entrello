import React from "react";
import Layout from "../Layout/Layout";
import { Route, Routes } from "react-router-dom";
import EventsListing from "./EventsListing";
import EventView from "../Event/EventView";
import SplView from "../Spl/SplView";
import NewEvent from "../Event/NewEvent";
import PricesView from "../Prices/PricesView";
import Overview from "../Event/Overview";
import EventSettingsView from "../Event/EventSettingsView";
import EventWebShopView from "../Event/EventWebShopView";
import EventFeaturesView from "../Event/EventFeaturesView";
import OrderSideCard from "../Orders/OrderSideCard";
import EditContactModal from "../Contact/EditContactModal";
import NewPrice from "../Prices/NewPrice";
import SellOrderDialog from "../Orders/SellOrderDialog";
import OrderHistoryDialog from "../Orders/OrderHistoryDialog";
import EditPrice, {
  PriceFormWrap,
  DealsWrap,
  SubpricesWrap,
} from "../Prices/EditPrice";
import { EventMediaView } from "../EventMediaView/EventMediaView";
import OrderModal from "../common/OrderModal/OrderModal";
import LocationModal from "../Location/LocationModal";

export default function EventsRouter() {
  return (
    <Layout>
      <Routes>
        <Route index element={<EventsListing />} />
        <Route path="new" element={<NewEvent />} />
        {/* <Route path=":id/spl" element={<SplView />}>
          <Route path="o/:orderId" element={<OrderSideCard />}>
            <Route path="sell" element={<SellOrderDialog />} />
            <Route path="contact/edit/:id" element={<EditContactModal />} />
          </Route>
        </Route> */}
        <Route path=":id/spl/*" element={<SplView />}>
          <Route path="o/:orderId/editOrder" element={<OrderModal />} />
          <Route path="o/:orderId" element={<OrderSideCard />}>
            <Route path="history" element={<OrderHistoryDialog />} />
            <Route path="sell" element={<SellOrderDialog />} />
            <Route path="contact/edit/:id" element={<EditContactModal />} />
            <Route path="editOrder" element={<OrderModal />} />
          </Route>
        </Route>
        <Route path=":id" element={<EventView />}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="prices" element={<PricesView />}>
            <Route path="new" element={<NewPrice />} />
            <Route path="edit/:priceId" element={<EditPrice />}>
              <Route index element={<PriceFormWrap />} />
              <Route path="subprices" element={<SubpricesWrap />} />
              <Route path="deals" element={<DealsWrap />} />
            </Route>
          </Route>
          <Route path="settings" element={<EventSettingsView />} >
            <Route path=":locationId/edit" element={<LocationModal />} />
          </Route>
          <Route path="media" element={<EventMediaView />} />
          <Route path="webshop" element={<EventWebShopView />} />
          <Route path="o/:orderId" element={<OrderSideCard />}>
            <Route path="sell" element={<SellOrderDialog />} />
            <Route path="contact/edit/:id" element={<EditContactModal />} />
            <Route path="history" element={<OrderHistoryDialog />} />
            <Route path="editOrder" element={<OrderModal />} />
          </Route>
          <Route path="features" element={<EventFeaturesView />} />
        </Route>
      </Routes>
    </Layout>
  );
}
