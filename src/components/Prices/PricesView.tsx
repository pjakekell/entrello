import React from "react";
import PricesListing from "./PricesListing";
import { Outlet } from "react-router-dom";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import messages from "../../i18n/messages.js";

const PricesView = () => {
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleToggleNewPriceForm = () => {
    navigate(`/events/${id}/prices/new`);
  };

  return (
    <div className="p-4 mt-2">
      <div className="mb-4 pb-2">
        <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {f(messages.prices)}
            </h3>
          </div>
          <div className="ml-4 mt-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleToggleNewPriceForm}
              className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-brand-600 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              {f(messages.createPrice)}
            </button>
          </div>
        </div>
      </div>
      <PricesListing />
      <Outlet />
    </div>
  );
};

export default PricesView;
