import React, { useEffect, useState } from "react";
import Error from "../Error";
import { useIntl } from "react-intl";
import { useQuery } from "@apollo/react-hooks";
import { buildPrice, FETCH_PRICES_BY_EVENT_ID, FETCH_PRICES_BY_PARENT_ID } from "./logic";
import { IPrice } from "./interfaces";
import { useMutation } from "@apollo/react-hooks";
import { useParams, useLocation } from "react-router-dom";
import NumberFormat from "react-number-format";
import { DELETE_PRICE } from "./logic";
import Tooltip from "../Tooltip/Tooltip";
import { TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/outline";
import messages from "../../i18n/messages.js";
import { classNames } from "../../utils/misc";
import SubpriceForm from "./SubpriceForm";
import LoadingIcon from "../Btn/LoadingIcon";

interface ISubprices {
  parent: IPrice;
}

interface ISubpriceItem {
  price: IPrice;
  idx: number;
  eventID: string | undefined;
}

const SubpriceItem = ({ price, idx }: ISubpriceItem) => {
  const [showEdit, setShowEdit] = useState(false);
  const { formatMessage: f } = useIntl();
  const [deletePrice, { loading: deleting }] = useMutation(DELETE_PRICE);
  const handleDelete = async () => {
    await deletePrice(
      {
        variables: { id: price.id },
        refetchQueries: [
          {
            query: FETCH_PRICES_BY_EVENT_ID,
            variables: { event_id: price.event_id }
          },
          {
            query: FETCH_PRICES_BY_PARENT_ID,
            variables: { parent_id: price.parent_id },
          },
        ]
      }
    );
  };
  const { state } = useLocation();
  useEffect(() => {
    const subpriceItemState = state as { concessionId?: string };
    if (subpriceItemState && subpriceItemState.concessionId && price.id === subpriceItemState.concessionId) {
      setShowEdit(true);
    }
  }, [state, price])

  const handleEdit = () => setShowEdit(true);

  if (showEdit)
    return (
      <SubpriceForm price={price} handleClose={() => setShowEdit(false)} />
    );

  return (
    <tr
      key={price.id}
      className={classNames(
        "hover:bg-gray-100",
        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
      )}
    >
      <td className="px-6 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
        {price.name}
      </td>
      <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
        <NumberFormat
          value={price.value / 100.0}
          thousandSeparator=" "
          decimalSeparator=","
          fixedDecimalScale
          decimalScale={2}
          displayType="text"
          prefix="€ "
        />
      </td>
      <td className="pl-6 pr-2 py-1 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end">
          <Tooltip content={f(messages.edit)}>
            <PencilIcon
              onClick={handleEdit}
              className="w-7 cursor-pointer h-7 block text-gray-400 p-1 rounded-full border-2 border-transparent hover:border-gray-400 group"
            />
          </Tooltip>
          <Tooltip content={f(messages.delete)}>
            {deleting ? (
              <LoadingIcon color="text-red-600" />
            ) : (
              <TrashIcon
                onClick={handleDelete}
                className="w-7 cursor-pointer h-7 block text-red-600 p-1 rounded-full border-2 border-transparent hover:border-red-600 group"
                aria-hidden="true"
              />
            )}
          </Tooltip>
        </div>
      </td>
    </tr>
  );
};

const Subprices = ({ parent }: ISubprices) => {
  const { formatMessage: f } = useIntl();
  const { state } = useLocation();
  const [showAddSubprice, setShowAddSubprice] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const concessionId = state as { concessionId?: string };
    if (!(concessionId && concessionId.concessionId)) {
      setShowAddSubprice(true);
    }
  }, [state])

  const { loading, error, data } = useQuery(FETCH_PRICES_BY_PARENT_ID, {
    variables: { parent_id: parent.id },
    skip: !parent
  });

  if (loading) return <div>loading...</div>;
  if (error) return <Error error={error} />;

  const prices = data ? data.prices : null;

  const handleToggleNewPriceForm = () => {
    setShowAddSubprice(!showAddSubprice);
  };

  return (
    <div className="overflow-hidden sm:rounded-lg">
      <div className="flex items-center justify-end flex-wrap sm:flex-nowrap">
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            tabIndex={-1}
            onClick={handleToggleNewPriceForm}
            className="relative inline-flex items-center py-1 px-3 text-sm font-medium rounded-full focus:outline-none hover:bg-brand-500 group focus:ring-2 focus:ring-offset-2 focus:ring-offset-orange-400 focus:ring-brand-500"
          >
            <PlusIcon className="w-5 h-5 text-brand-500 group-hover:text-white" />
            <div className="group-hover:text-white text-brand-500 ml-2">
              {f(messages.createConcession)}
            </div>
          </button>
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {f(messages.name)}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {f(messages.value)}
            </th>
            <th scope="col" className="relative px-6 py-3 w-10">
              <span className="sr-only">{f(messages.edit)}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {prices &&
            prices.map((price: IPrice, priceIdx: number) => (
              <SubpriceItem
                key={price.id}
                price={price}
                idx={priceIdx}
                eventID={id}
              />
            ))}
          {showAddSubprice ? (
            <SubpriceForm
              price={buildPrice(
                parent.event_id,
                parent.id,
                parent.tax_group_id
              )}
              handleClose={handleToggleNewPriceForm}
            />
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default Subprices;
