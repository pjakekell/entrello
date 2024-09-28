import React, { useEffect, useState } from "react";
import SvgLogo from "../../logo.svg";
import Error from "../Error";
import InfoAlert from "../Alert/InfoAlert";
import { useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { IPrice } from "./interfaces";
import { IEventDeal } from "../Event/interfaces";

import messages from "../../i18n/messages.js";
import NumberFormat from "react-number-format";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import { usePrices } from "../../hooks/usePrices";

import { classNames } from "../../utils/misc";
import { faDiagramNested } from "@fortawesome/pro-regular-svg-icons/faDiagramNested";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useEventDeals from "../../hooks/useEventDeals";
import { useToggleEntrelloDeal } from "../../hooks/useToggleEntrelloDeal";
import LoadingIcon from "../Btn/LoadingIcon";
import { faSquareChevronRight } from "@fortawesome/pro-regular-svg-icons/faSquareChevronRight";
import { faGripDotsVertical } from "@fortawesome/pro-regular-svg-icons/faGripDotsVertical";
import { faSquareChevronDown } from "@fortawesome/pro-regular-svg-icons/faSquareChevronDown";
import PriceRowOptions from "./PriceRowOptions";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_PRICES_BY_EVENT_ID, UPDATE_PRICE } from "./logic";
import cloneDeep from "lodash/cloneDeep";

interface IPriceItem {
  price: IPrice;
  eventDeal: IEventDeal | undefined | null;
  entrelloDeal: IEventDeal | undefined | null;
  idx: number;
  eventId: string;
  taxGroupName?: string;
  isConcession?: boolean;
  handleCollapsable?: (parentId?: string) => void;
}

const PriceItem = ({
  price,
  eventDeal,
  entrelloDeal,
  idx,
  eventId,
  taxGroupName,
  isConcession = false,
  handleCollapsable,
}: IPriceItem) => {
  const navigate = useNavigate();
  const [toggleEntrelloDeal, loadingToggleEntrelloDeal] = useToggleEntrelloDeal(
    eventId,
    price.id
  );
  const [isOpen, setIsOpen] = useState(true);
  const [subpricesCount, setSubpricesLength] = useState(0);
  const [draggedOverRow, setDraggedOverRow] = useState<string | null>(null);
  const [updatePrice] = useMutation(UPDATE_PRICE);

  const updatePrices = async (
    draggedRowId: string,
    draggedRowPosition: number,
    targetRowId: string | null,
    targetRowPosition: number,
    targetParentId: string,
    draggedRowParentId: string
  ) => {
    if (draggedRowId === targetRowId || targetRowId === null) return;
    if (targetParentId !== draggedRowParentId) return;
    let draggedRowNewPosition = 0;
    let targetRowNewPosition = targetRowPosition;

    if (draggedRowPosition <= targetRowPosition) {
      if (targetRowPosition === 0) {
        draggedRowNewPosition = 1;
      } else {
        draggedRowNewPosition = targetRowPosition;
        targetRowNewPosition -= 1;
      }
    } else {
      if (targetRowPosition === 0) {
        draggedRowNewPosition = 0;
        targetRowNewPosition = 1;
      } else {
        draggedRowNewPosition = targetRowPosition;
        targetRowNewPosition += 1;
      }
    }

    await updatePrice({
      variables: {
        id: draggedRowId,
        input: {
          pos: draggedRowNewPosition,
        },
      },
      onCompleted: async () => {
        const { data } = await updatePrice({
          variables: {
            id: targetRowId,
            input: {
              pos: targetRowNewPosition,
            },
          },
          refetchQueries: [
            {
              query: FETCH_PRICES_BY_EVENT_ID,
              variables: { event_id: eventId },
            },
          ],
        });
        if (data.UpdatePrice!) return;
        console.error("unexpected return value from server", data);
      },
    });
  };

  const draggedOverHandler = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLTableRowElement | HTMLTableCellElement;
    const isTargetARow = target instanceof HTMLTableRowElement;
    const row = isTargetARow ? target : target.parentElement?.closest("tr");
    const rowId = row?.id ? row.id : null;
    setDraggedOverRow(rowId);
  };

  useEffect(() => {
    if (price.concessions && price.concessions.length > 0) {
      const concessionsCount = price.concessions.reduce((acc, curr) => {
        if (!curr.deleted_at) return (acc += 1);
        return acc;
      }, 0);
      setSubpricesLength(concessionsCount);
    }
  }, [price]);
  const link = `/events/${eventId}/prices/edit/${price.id}`;

  const handleToggleEntrelloDeal = (e: any) => {
    e.stopPropagation();
    if (!entrelloDeal) {
      console.log(
        "price",
        price.id,
        "has no event_deal for entrello org. should not happen"
      );
      return;
    }
    toggleEntrelloDeal(entrelloDeal.deal_id);
  };

  const handleEditPrice = () => {
    navigate(link);
  };
  return (
    <tr
      draggable={true}
      id={price.id}
      data-position={price.pos}
      onDragStart={(e: React.DragEvent<HTMLTableRowElement>) => {
        e.dataTransfer.setData(
          "text/plain",
          `${price.pos}, ${price.id}, ${price.parent_id}`
        );
      }}
      onDrop={(e) => {
        e.preventDefault();
        const draggedRowData = e.dataTransfer.getData("text/plain");
        const [draggedRowPos, draggedRowId, draggedRowParentId] =
          draggedRowData.split(", ");
        const target = e.target as HTMLTableRowElement | HTMLTableCellElement;
        const isTargetARow = target instanceof HTMLTableRowElement;
        const targetRow = isTargetARow
          ? target
          : target.parentElement?.closest("tr");
        const targetRowId = targetRow?.id ? targetRow.id : null;
        setDraggedOverRow(null);
        updatePrices(
          draggedRowId,
          parseInt(draggedRowPos),
          targetRowId,
          parseInt(targetRow?.dataset.position!),
          targetRow?.dataset.parentid!,
          draggedRowParentId
        );
      }}
      onDragLeave={() => setDraggedOverRow(null)}
      onDragOver={draggedOverHandler}
      data-parentid={price.parent_id}
      className={classNames(
        "hover:bg-gray-100 align-middle hover:cursor-pointer",
        idx % 2 === 0 ? "bg-white" : "bg-gray-50",
        draggedOverRow === price.id
          ? "border border-dashed border-brand-200"
          : "border-brand-700"
      )}
    >
      <td className="pr-6 pl-1 whitespace-nowrap">
        <div className="flex align-center">
          <FontAwesomeIcon icon={faGripDotsVertical} className={"w-4 h-4"} />
          <div
            className="rounded-full w-5 h-5 mr-2 ml-2"
            style={{ backgroundColor: price.color || "none" }}
          />
          <div
            className={classNames(
              "text-sm font-medium text-gray-900 cursor-pointer",
              isConcession && "pl-4"
            )}
            onClick={handleEditPrice}
          >
            {price.name}
          </div>
          {!isConcession ? (
            <div className="ml-4 text-xs inline-block flex items-center border border-gray-300 bg-gray-100 px-2 rounded rounded-full">
              <FontAwesomeIcon icon={faDiagramNested} />
              <div className="ml-1 border-l border-gray-300 pl-1">
                {subpricesCount}
              </div>
            </div>
          ) : null}
        </div>
      </td>
      <td
        className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
        onClick={handleEditPrice}
      >
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
      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 cursor-pointer">
        {price.tax_group_name ? price.tax_group_name : taxGroupName}
      </td>
      <td className="text-center">
        <div
          className="flex justify-center hover:border-brand-500 border-2 border-transparent w-8 h-8 items-center rounded group cursor-pointer"
          onClick={handleToggleEntrelloDeal}
        >
          {loadingToggleEntrelloDeal ? <LoadingIcon /> : null}
          {eventDeal && !loadingToggleEntrelloDeal ? (
            <CheckIcon className="h-5 w-5 text-brand-500" />
          ) : null}
          {!eventDeal && !loadingToggleEntrelloDeal ? (
            <XIcon className="h-5 w-5 text-gray-300 group-hover:text-brand-500" />
          ) : null}
        </div>
      </td>

      <td className="text-center hover:cursor-pointer pl-6 pt-2">
        {isConcession || subpricesCount === 0 ? null : (
          <FontAwesomeIcon
            icon={isOpen ? faSquareChevronDown : faSquareChevronRight}
            className={classNames("w-5 h-5")}
            onClick={() => {
              handleCollapsable && handleCollapsable(price.id);
              setIsOpen((prevState) => !prevState);
            }}
          />
        )}
      </td>
      <td className="pr-6 pt-2 whitespace-nowrap text-right text-sm font-medium align-center">
        <PriceRowOptions
          parentId={price.parent_id}
          isConcession={isConcession}
          link={link}
          priceId={price.id}
        />
      </td>
    </tr>
  );
};

const getPriceDeal = (deals: IEventDeal[] | null, price: IPrice) => {
  if (!deals) return null;

  return deals.find((deal: IEventDeal) => deal.price_ids.includes(price.id));
};

const getEntrelloDeal = (deals: IEventDeal[] | null) => {
  if (!deals) return null;

  return deals.find(
    (deal: IEventDeal) =>
      deal.reseller_org_id === "org_000000000000000000000001"
  );
};

export default function PricesListing() {
  const { formatMessage: f } = useIntl();
  const { id } = useParams();
  const [dealsData, loadingDeals] = useEventDeals(id);
  const [prices, { loading, error }] = usePrices(id);
  const [pricesList, setPricesList] = useState([]);

  useEffect(() => {
    if (prices) {
      const list = prices
        .filter((price: IPrice) => !price.parent_id)
        .sort((a: { pos: number }, b: { pos: number }) => a.pos - b.pos)
        .map((price: IPrice) => {
          if (price.concessions && price.concessions.length > 1) {
            let newPrice = cloneDeep(price);
            newPrice.concessions!.sort((a, b) => a.pos! - b.pos!);
            return newPrice;
          }
          return price;
        });
      setPricesList(list);
    }
  }, [prices]);

  if (loading) return <div>loading...</div>;
  if (error) return <Error error={error} />;

  const handleCollapsable = (parentId?: string) => {
    const concessions = document.querySelectorAll(
      '[data-parentid="' + parentId + '"]'
    ) as NodeListOf<HTMLTableRowElement>;
    concessions.forEach((el) => {
      el.classList.toggle("hidden");
    });
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-y-visible sm:-mx-6 lg:-mx-8">
        {loadingDeals ? <InfoAlert>loading reseller deals...</InfoAlert> : null}
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="">
                  <th
                    scope="col"
                    className="align-bottom px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex">
                      <div>{f(messages.name)}</div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {f(messages.value)}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {f(messages.taxGroup)}
                  </th>
                  <th className="w-12">
                    <div className="flex items-center">
                      <img
                        src={SvgLogo}
                        className="h-6 w-8"
                        alt="entrello logo"
                      />
                    </div>
                  </th>
                  <th scope="col" className="relative px-6 py-3 w-10">
                    <span className="sr-only">{f(messages.edit)}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pricesList.map((price: IPrice, priceIdx: number) => {
                  if (price.concessions && price.concessions.length > 0) {
                    return (
                      <>
                        <PriceItem
                          key={price.id}
                          price={price}
                          eventDeal={getPriceDeal(dealsData, price)}
                          entrelloDeal={getEntrelloDeal(dealsData)}
                          handleCollapsable={handleCollapsable}
                          idx={priceIdx}
                          eventId={id || ""}
                        />

                        {price.concessions.map((concession: IPrice) => {
                          if (concession.deleted_at) return null;
                          return (
                            <PriceItem
                              key={concession.id}
                              price={concession}
                              taxGroupName={price.tax_group_name}
                              eventDeal={getPriceDeal(dealsData, concession)}
                              entrelloDeal={getEntrelloDeal(dealsData)}
                              idx={priceIdx}
                              isConcession
                              eventId={id || ""}
                            />
                          );
                        })}
                      </>
                    );
                  }
                  return (
                    <PriceItem
                      key={price.id}
                      price={price}
                      eventDeal={getPriceDeal(dealsData, price)}
                      entrelloDeal={getEntrelloDeal(dealsData)}
                      idx={priceIdx}
                      eventId={id || ""}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
