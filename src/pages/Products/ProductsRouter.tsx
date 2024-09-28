import React from "react";
import Layout from "../../components/Layout/Layout";
import { Route, Routes } from "react-router-dom";
import ProductsListing from "./ProductsListing";
import ProductModal from "./ProductModal";
import OrderModal from "../../components/common/OrderModal/OrderModal";
import OrderSideCard from "../../components/Orders/OrderSideCard";
import SellOrderDialog from "../../components/Orders/SellOrderDialog";
import EditContactModal from "../../components/Contact/EditContactModal";
import OrderHistoryDialog from "../../components/Orders/OrderHistoryDialog";


export default function ProductsRouter() {
    return (
        <Layout>
            <Routes>
                <Route path="*" element={<ProductsListing />} >
                    <Route path="new" element={<ProductModal />} />
                    <Route path=":productId" element={<ProductModal />} />
                    <Route path="o/new" element={<OrderModal />} />
                    <Route path="o/:orderId" element={<OrderSideCard />}>
                        <Route path="sell" element={<SellOrderDialog />} />
                        <Route path="contact/edit/:id" element={<EditContactModal />} />
                        <Route path="history" element={<OrderHistoryDialog />} />
                        <Route path="editOrder" element={<OrderModal />} />
                    </Route>
                </Route>
            </Routes>
        </Layout>
    )
}