import React from "react";
import Layout from "../../components/Layout/Layout";
import { Route, Routes } from "react-router-dom";
import VouchersListing from "./VouchersListing";
import VoucherModal from "./VoucherModal";
import OrderSideCard from "../../components/Orders/OrderSideCard";
import EditContactModal from "../../components/Contact/EditContactModal";
import SellOrderDialog from "../../components/Orders/SellOrderDialog";
import OrderModal from "../../components/common/OrderModal/OrderModal";

export default function VouchersRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="new" element={<VoucherModal />} />
        <Route path=":voucherId" element={<VoucherModal />} />
        <Route path="*" element={<VouchersListing />}>
          <Route path="o/:orderId" element={<OrderSideCard />}>
            <Route path="sell" element={<SellOrderDialog />} />
            <Route path="contact/edit/:id" element={<EditContactModal />} />
            <Route path="editOrder" element={<OrderModal />} />
          </Route>
        </Route>
      </Routes>
    </Layout>
  );
}
