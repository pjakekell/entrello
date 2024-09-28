import React, { useState, useCallback, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { useIntl } from "react-intl";
import { useParams } from "react-router";

import SuperSwitch from "../Switch/SuperSwitch";
import { useEvent } from "../../hooks/useEvent";

import {
  EVENT_FEATURE_SPL,
  EVENT_FEATURE_SHOP_NO_BESTSEAT,
  EVENT_FEATURE_SHOP_NO_SPL,
  EVENT_FEATURE_SHOP_RES,
  EVENT_FEATURE_PROMO_CODES,
  EVENT_FEATURE_ONLINE_EVENT,
  EVENT_FEATURE_PRODUCTS,
  UPDATE_EVENT,
  GET_EVENT_BY_ID,
} from "../Event/logic";
import messages from "../../i18n/messages";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";

type tEventFeatures = {
  [key: string]: number
};

const EVENT_FEATURES: tEventFeatures = {
  seatingPlan: EVENT_FEATURE_SPL,
  bestSeatBooking: EVENT_FEATURE_SHOP_NO_BESTSEAT,
  onlyBestSeatBooking: EVENT_FEATURE_SHOP_NO_SPL,
  reservation: EVENT_FEATURE_SHOP_RES,
  promoCodes: EVENT_FEATURE_PROMO_CODES,
  onlineEvent: EVENT_FEATURE_ONLINE_EVENT,
  productsSale: EVENT_FEATURE_PRODUCTS
};

const EventFeaturesView = () => {
  const { formatMessage: f } = useIntl();
  const [updateEvent, { error: saveError }] =
    useMutation(UPDATE_EVENT);
  const { id } = useParams();
  const [event] = useEvent(id || "");

  const [enabled, setEnabled] = useState({
    seatingPlan: true,
    bestSeatBooking: true,
    onlyBestSeatBooking: true,
    reservation: true,
    promoCodes: true,
    onlineEvent: true,
    productsSale: true
  });

  const error = saveError;

  useEffect(() => {
    const updateContent = () => {
      setEnabled({
        seatingPlan: !!(event.features & EVENT_FEATURE_SPL),
        bestSeatBooking: !!(event.features & EVENT_FEATURE_SHOP_NO_BESTSEAT),
        onlyBestSeatBooking: !!(event.features & EVENT_FEATURE_SHOP_NO_SPL),
        reservation: !!(event.features & EVENT_FEATURE_SHOP_RES),
        promoCodes: !!(event.features & EVENT_FEATURE_PROMO_CODES),
        onlineEvent: !!(event.features & EVENT_FEATURE_ONLINE_EVENT),
        productsSale: !!(event.features & EVENT_FEATURE_PRODUCTS),
      })
    };
    updateContent();
  }, [event]);

  const handleChangeEnable = useCallback((value: boolean, key: string) => {
    let newValue = {
      ...enabled,
      [key]: value
    };

    if(key === "seatingPlan" && !value) {
      newValue = {
        ...newValue,
        bestSeatBooking: false,
        onlyBestSeatBooking: false
      };
    }
    if(key === "bestSeatBooking" && !enabled.seatingPlan) {
      newValue = {
        ...newValue,
        bestSeatBooking: false
      }
    }
    if(key === "onlyBestSeatBooking" && !enabled.seatingPlan) {
      newValue = {
        ...newValue,
        onlyBestSeatBooking: false
      }
    }
    setEnabled(newValue);
  }, [enabled]);

  const onSave = useCallback(async (value?: boolean, key?: string) => {
    let features = 0;
    if(enabled.seatingPlan && key !== "seatingPlan")
      features |= EVENT_FEATURE_SPL;
    if(enabled.bestSeatBooking && key !== "bestSeatBooking")
      features |= EVENT_FEATURE_SHOP_NO_BESTSEAT;
    if(enabled.onlyBestSeatBooking && key !== "onlyBestSeatBooking")
      features |= EVENT_FEATURE_SHOP_NO_SPL;
    if(enabled.reservation && key !== "reservation")
      features |= EVENT_FEATURE_SHOP_RES;
    if(enabled.promoCodes && key !== "promoCodes")
      features |= EVENT_FEATURE_PROMO_CODES;
    if(enabled.onlineEvent && key !== "onlineEvent")
      features |= EVENT_FEATURE_ONLINE_EVENT;
    if(enabled.productsSale && key !== "productsSale")
      features |= EVENT_FEATURE_PRODUCTS;
    if(value && key !== undefined)
      features |= EVENT_FEATURES[key];

    try {
      await updateEvent({
        variables: {
          id,
          input: { features }
        },
        refetchQueries: [
          {
            query: GET_EVENT_BY_ID,
            variables: { id }
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  }, [enabled, id, updateEvent]);

  const onDebouncedSave = useDebouncedCallback((value?: any, key?: string) => {
    onSave(value, key);
  }, 500);

  return (
    <div className="">
      <div className="border-b border-solid border-gray-200">
        <SuperSwitch
          label={f(messages.seatingPlan)}
          description="I want to define available seats and make visitors pick their seats directly"
          enabled={enabled.seatingPlan}
          setEnabled={(value) => {
            handleChangeEnable(value, "seatingPlan");
            onDebouncedSave(value, "seatingPlan");
          }}
        >
          <SuperSwitch
            label={f(messages.bestSeatBooking)}
            description="I want to offer the best - closest - seats to my visitors automatically in the web shop"
            enabled={enabled.bestSeatBooking}
            setEnabled={(value) => {
              handleChangeEnable(value, "bestSeatBooking");
              onDebouncedSave(value, "bestSeatBooking");
            }}
            isChild={true}
          />
          <SuperSwitch
            label={f(messages.onlyBestSeatBooking)}
            description="Deny visitors to pick any seats from the seating plan"
            enabled={enabled.onlyBestSeatBooking}
            setEnabled={(value) => {
              handleChangeEnable(value, "onlyBestSeatBooking");
              onDebouncedSave(value, "onlyBestSeatBooking");
            }}
            isChild={true}
          />
        </SuperSwitch>
      </div>
      <div className="border-b border-solid border-gray-200">
        <SuperSwitch
          label={f(messages.reservation)}
          description="My visitors should be allowed to make unpaid reservations for this event"
          enabled={enabled.reservation}
          setEnabled={(value) => {
            handleChangeEnable(value, "reservation");
            onDebouncedSave(value, "reservation");
          }}
        />
      </div>
      <div className="border-b border-solid border-gray-200">
        <SuperSwitch
          label={f(messages.promoCodes)}
          description="Allow global promo codes for this event"
          enabled={enabled.promoCodes}
          setEnabled={(value) => {
            handleChangeEnable(value, "promoCodes");
            onDebouncedSave(value, "promoCodes");
          }}
        />
      </div>
      <div className="border-b border-solid border-gray-200">
        <SuperSwitch
          label={f(messages.onlineEvent)}
          description="I want to enter a web address, password and further information"
          enabled={enabled.onlineEvent}
          setEnabled={(value) => {
            handleChangeEnable(value, "onlineEvent");
            onDebouncedSave(value, "onlineEvent");
          }}
        />
      </div>
      <div className="border-b border-solid border-gray-200">
        <SuperSwitch
          label={f(messages.productsSale)}
          description="I want to allow visitors to buy products like drinks, snacks, ... for this event"
          enabled={enabled.productsSale}
          setEnabled={(value) => {
            handleChangeEnable(value, "productsSale");
            onDebouncedSave(value, "productsSale");
          }}
        />
      </div>
      <div className="mt-5 sm:mt-4 sm:flex">
        {error ? (
          <div className="text-center font-medium tracking-wide text-red-600 text-xs mb-4">
            {error.message}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EventFeaturesView;