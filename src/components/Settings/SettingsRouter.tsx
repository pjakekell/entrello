import React from "react";
import Layout from "../Layout/Layout";
import PaymentInfo from "./PaymentInfo";
import SettingsView from "./SettingsView";
import PayoutSettings from "./PayoutSettings";
import TaxSettings from "./TaxSettings";
import NewTaxGroupForm from "../TaxGroup/NewTaxGroup";
import EditTaxGroupForm from "../TaxGroup/EditTaxGroup";
import DealSettings from "./DealSettings";
import NewDealForm from "../Deal/NewDeal";
import EditDealForm from "../Deal/EditDeal";
import { Profile } from "../../pages/Profile";
import { Routes, Route } from "react-router-dom";
import { OrganizationDetails } from "../../pages/Settings/OrganizationDetails";
import Container from "../Layout/Container";
import { Branding } from "../../pages/Settings/Branding";
import { Shop } from "../../pages/Settings/Shop";
import LocationSettings from "./LocationSettings";
import LocationModal from "../Location/LocationModal";
import MembersSettings from "./MembersSettings";
import InviteUsersModal from "../Members/InviteUsersModal";
import PriceNamesSettings from "./PriceNamesSettings";
import PriceNameModal from "../Prices/PriceName/PriceNameModal";
import PriceCategoriesSettings from "./PriceCategoriesSettings";
import PriceCategoryModal from "../Prices/PriceCategories/PriceCategoryModal";
import PriceTemplatesSettings from "./PriceTemplatesSettings";
import PriceTemplateModal from "../Prices/PriceTemplates/PriceTemplateModal";
import PromoCodeModal from "../Prices/PromoCode/PromoCodeModal";
import PromoCodeSettings from "./PromoCodeSettings";

export default function SettingsRouter() {
  return (
    <Layout>
      <Container>
        <Routes>
          <Route index element={<SettingsView />} />
          <Route path="profile" element={<Profile />} />
          <Route path="payout" element={<PayoutSettings />} />
          <Route path="legal" element={<OrganizationDetails />} />
          <Route path="branding" element={<Branding />} />
          <Route path="shop" element={<Shop />} />
          <Route path="taxes" element={<TaxSettings />} />
          <Route path="taxes/new" element={<NewTaxGroupForm />} />
          <Route
            path="taxes/edit/:id"
            element={<EditTaxGroupForm />}
          />
          <Route path="deals" element={<DealSettings />} />
          <Route path="deals/new" element={<NewDealForm />} />
          <Route path="deals/edit/:id" element={<EditDealForm />} />
          <Route path="payment_info" element={<PaymentInfo />} />
          <Route path="locations/*" element={<LocationSettings />} >
            <Route path="new" element={<LocationModal />} />
            <Route path=":locationId/edit" element={<LocationModal />} />
          </Route>
          <Route path="members/*" element={<MembersSettings />} >
            <Route path="new" element={<InviteUsersModal />} />
          </Route>
          <Route path="pricenames/*" element={<PriceNamesSettings />} >
            <Route path="new" element={<PriceNameModal />} />
            <Route path=":priceNameId/edit" element={<PriceNameModal />} />
          </Route>
          <Route path="pricecategories/*" element={<PriceCategoriesSettings />} >
            <Route path="new" element={<PriceCategoryModal />} />
            <Route path=":priceCategoryId/edit" element={<PriceCategoryModal />} />
          </Route>
          <Route path="pricetemplates/*" element={<PriceTemplatesSettings />} >
            <Route path="new" element={<PriceTemplateModal />} />
            <Route path=":priceTemplateId/edit" element={<PriceTemplateModal />} />
          </Route>
          <Route path="promocode/*" element={<PromoCodeSettings />} >
            <Route path="new" element={<PromoCodeModal />} />
            <Route path=":promoCodeId/edit" element={<PromoCodeModal />} />
          </Route>
        </Routes>
      </Container>
    </Layout>
  );
}
