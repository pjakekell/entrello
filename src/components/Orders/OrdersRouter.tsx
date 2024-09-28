import React from "react";
import Layout from "../Layout/Layout";
import { Route, Routes } from "react-router-dom";
import OrdersListing from "./OrdersListing";
import OrderSideCard from "./OrderSideCard";
import SellOrderDialog from "./SellOrderDialog";
import EditContactModal from "../Contact/EditContactModal";
import OrderHistoryDialog from "./OrderHistoryDialog";
import OrderModal from "../common/OrderModal/OrderModal";

export default function OrdersRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="e/:eventId" element={<OrdersListing />} />
        <Route path="*" element={<OrdersListing />}>
          <Route path="o/:orderId" element={<OrderSideCard />}>
            <Route path="sell" element={<SellOrderDialog />} />
            <Route path="contact/edit/:id" element={<EditContactModal />} />
            <Route path="history" element={<OrderHistoryDialog />} />
            <Route path="editOrder" element={<OrderModal />} />
          </Route>
        </Route>
      </Routes>
    </Layout>
  );
}
