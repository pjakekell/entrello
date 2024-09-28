import React, { useState, Fragment, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { Transition, Dialog, Tab } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { useMutation } from "@apollo/react-hooks";
import * as Yup from "yup";

import messages from "../../../i18n/messages";
import GeneralOrderTab from "./GeneralOrderTab";
import ProductsTab from "./ProductsTab";
import { useProducts } from "../../../hooks/useProducts";
import { IProduct } from "../../../pages/Products/interfaces";
import { CREATE_ORDER, CREATE_SPLIT_ORDER, FETCH_ORDERS_BY_FILTER } from "../../Orders/logic";
import { useUpdateOrder } from "../../../hooks/useUpdateOrder";
import { useOrder } from "../../../hooks/useOrder";
import { buildOrder } from "./logic";
import { useEvents } from "../../../hooks/useEvents";
import LoadingData from "../LoadingData";
import Error from "../../Error";

export default function NewOrderModal() {
    const [showNewOrderDialog, setShowNewOrderDialog] = useState<boolean>(true);
    const [categories] = useState(['General', 'Products']);

    const { orderId } = useParams();

    const navigate = useNavigate();
    const { formatMessage: f } = useIntl();
    const focusFieldRef = useRef(null);

    const [events, { loading: eventsLoading, error: eventsError }] = useEvents();
    const [products, { loading: productsLoading, error: productsError }] = useProducts();

    const [updateOrder, { error: updateOrderError }] = useUpdateOrder();
    const [orderData, { loading: orderLoading, error: orderError }] = useOrder(!orderId ? '' : orderId);

    const order = buildOrder(events, orderData);

    const validationSchema = Yup.object().shape({
        linkedEvents: Yup.object(),
        chosenProducts: Yup.object(),
        contact_id: Yup.string(),
        split_order_id: Yup.string().matches(/^ord_[0-9a-zA-Z]{24,27}$/, f(messages.invalidSplitOrderId)),
        productSearchQuery: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            ...order,
            productSearchQuery: ''
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit,
    });

    useEffect(() => {
        if (orderId) {
            const isContactLinkedAlready = order.contact_id !== "";
            const shouldContactBeUpdated = isContactLinkedAlready && order.contact_id !== formik.values.contact_id;
            if (shouldContactBeUpdated) {
                onSubmit();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order.contact_id, formik.values.contact_id, orderId]);
    const [createOrder, { error }] = useMutation(formik.values.split_order_id ? CREATE_SPLIT_ORDER : CREATE_ORDER);

    if (eventsError) return <Error error={eventsError} />;
    if (productsError) return <Error error={productsError} />;
    if (orderError) return <Error error={orderError} />;
    if (error) return <Error error={error} />;

    const saveOrder = async () => {
        try {
            const { chosenProducts, linkedEvent, split_order_id } = formik.values
            const orderItems = [];

            for (const product_id in chosenProducts) {
                const qty = chosenProducts[product_id];
                const product = products.find((p: IProduct) => p.id === product_id);
                const price_id = product.prices[product.prices.length - 1].id;
                const event_id = linkedEvent.id ? linkedEvent.id : '';
                qty > 0 && orderItems.push({
                    product_id,
                    qty,
                    price_id,
                    event_id,
                })
            }
            const isContactChosen = formik.values.contact_id !== '';
            if (orderItems.length > 0) {

                const { data, errors } = await createOrder(
                    {
                        variables: {
                            split_order_id,
                            items: orderItems
                        },
                        refetchQueries: [
                            {
                                query: FETCH_ORDERS_BY_FILTER,
                                variables: {}
                            },
                        ],
                        onCompleted: async (createdOrder) => {
                            if (isContactChosen) {
                                const { CreateOrder: order } = createdOrder;
                                const { id } = order;
                                await updateOrder({ contact_id: formik.values.contact_id }, id);
                                if (updateOrderError) {
                                    console.error("Error durring updating order contact", updateOrderError.message);
                                }
                            }
                        },
                    }

                )
                if (data.CreateOrder) {
                    handleClose(data.CreateOrder.id);
                    return;
                }
                console.error("unexpected return value from server", errors, data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const update = async () => {
        try {
            const isContactUpdated = formik.values.contact_id && formik.values.contact_id !== order.contact_id;
            if (isContactUpdated) {
                await updateOrder({ contact_id: formik.values.contact_id }, orderId);
                if (updateOrderError) {
                    console.error("Error durring updating order contact", updateOrderError.message);
                }
            }
        } catch (error) {
            console.error(error);

        }
    }
    async function onSubmit() {
        if (!orderId) {
            saveOrder()
        } else {
            update()
        }
    }

    const handleClose = (createOrderId?: string) => {
        if (createOrderId) {
            navigate(`/products/o/${createOrderId}`);
        } else {
            navigate(-1);
        }
        setShowNewOrderDialog(false);
    }

    return (
        <Transition.Root show={showNewOrderDialog} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-10 inset-0 overflow-y-auto"
                initialFocus={focusFieldRef}
                open
                onClose={() => handleClose()}
            >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block overflow-visible align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-screen-md sm:w-full sm:p-6 w- ">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg leading-6 font-medium text-brand-600"
                                    >
                                        {f(messages.order)}
                                    </Dialog.Title>
                                </div>
                                <div
                                    className="mx-auto flex-shrink-0 flex items-center justify-center h-8 w-8 sm:-mt-2 sm:-mr-2 sm:h-10 sm:w-10 cursor-pointer"
                                    onClick={() => handleClose()}
                                >
                                    <XIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <Tab.Group>
                                    <Tab.List>
                                        {categories.map(category => {
                                            return (
                                                <Tab key={category}
                                                    className={({ selected }) => selected ? 'inline-flex items-center justify-center sm:justify-start text-center sm:text-left px-1 sm:px-2 sm:py-1 border-2 rounded-full shadow-sm text-sm font-medium text-brand-500 hover:text-white border-brand-500 hover:bg-brand-500 mr-2 last:mr-0 last:ml-2' : ''}
                                                >{category}</Tab>
                                            )
                                        })}
                                    </Tab.List>
                                    {orderId && orderLoading ? <LoadingData /> : (
                                        <Tab.Panels>
                                            <form onSubmit={formik.handleSubmit}>
                                                <Tab.Panel>
                                                    <GeneralOrderTab events={events} eventsLoading={eventsLoading} formik={formik} />
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <ProductsTab products={products} productsLoading={productsLoading} formik={formik} />
                                                </Tab.Panel>
                                            </form>
                                        </Tab.Panels>
                                    )}
                                </Tab.Group>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}