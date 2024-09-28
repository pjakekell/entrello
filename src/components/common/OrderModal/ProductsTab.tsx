import React, { useState, useEffect, useCallback } from "react";

import { useIntl } from "react-intl";
import NumberFormat from "react-number-format";
import { SearchIcon } from "@heroicons/react/solid";
import uniqBy from "lodash/uniqBy";
import has from "lodash/has";

import messages from "../../../i18n/messages";
import LoadingData from "../LoadingData";
import { IProduct } from "../../../pages/Products/interfaces";
import InputField from "../../FormHelpers/InputField";
import InsetInputField from "../../FormHelpers/InsetInputField";
import LoadingBtn from "../../Btn/LoadingBtn";
import { classNames } from "../../../utils/misc";
import { IProductsTab } from "./interfaces";
import { useParams } from "react-router";

export default function ProductsTab(props: IProductsTab) {
    const { formik, products, productsLoading } = props;
    const { formatMessage: f } = useIntl();

    const { orderId } = useParams();

    const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
    const [editedProductsList, setEditedProductsList] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [quantityAndTotal, setQuantityAndTotal] = useState({ quantity: 0, total: 0 });
    const [listToBeUsed, setListToBeUsed] = useState<IProduct[]>([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);


    useEffect(() => {
        const values: number[] = Object.values(formik.values.chosenProducts);
        if (values.length > 0) {
            const value = values.find(value => value > 0);
            if (value) {
                setIsSubmitDisabled(false);
                return;
            }
            setIsSubmitDisabled(true);
            return;
        } else {
            setIsSubmitDisabled(true);
        }
    }, [formik.values.chosenProducts])

    useEffect(() => {
        setEditedProductsList(products);
    }, [products])

    useEffect(() => {
        if (products && products.length > 0) {
            if (formik.values.productSearchQuery) {
                setListToBeUsed(filteredProducts);
            } else {
                setListToBeUsed(editedProductsList);
            }
        }
    }, [filteredProducts, editedProductsList, products, formik.values.productSearchQuery])

    const handleProductsFilter = useCallback((filter: string) => {
        let productsFiltered: IProduct[] = [];
        if (products && products.length > 0) {
            const productsFilteredByName = products.filter((product: IProduct) => product.name.toLowerCase().includes(filter.toLowerCase()));
            const productsFilteredByCategory = products.filter((product: IProduct) => product.category.toLowerCase().includes(filter.toLowerCase()));
            const productsFilteredByPos = products.filter((product: IProduct) => String(product.pos).toLowerCase().includes(filter.toLowerCase()));
            productsFiltered = uniqBy([...productsFilteredByName, ...productsFilteredByCategory, ...productsFilteredByPos], 'id');
        }
        return productsFiltered;
    }, [products])


    useEffect(() => {
        const filter = formik.values.productSearchQuery;
        const productsFiltered = handleProductsFilter(filter);
        setFilteredProducts(productsFiltered);

    }, [formik.values.productSearchQuery, handleProductsFilter])


    useEffect(() => {
        if (editedProductsList) {
            const totalCount = editedProductsList.reduce((acc: { quantity: number, total: number }, product: IProduct) => {
                if (product.id && formik.values.chosenProducts.hasOwnProperty(product.id)) {
                    acc.quantity += Number(formik.values.chosenProducts[product.id])
                    const productPrice = product.prices && product.prices[product.prices.length - 1].value;
                    const productPriceAvailable = productPrice && productPrice > 0;
                    acc.total += productPriceAvailable ? formik.values.chosenProducts[product.id] * productPrice : 0;
                    return acc;
                }
                return acc;
            }, { quantity: 0, total: 0 })
            setQuantityAndTotal(totalCount);
            const productsFromList = editedProductsList.filter(editedProduct => {
                if (editedProduct.id) {
                    return formik.values.chosenProducts.hasOwnProperty(editedProduct.id) && formik.values.chosenProducts[editedProduct.id] > 0;
                }
                return false;
            });
            setSelectedProducts(productsFromList);
        }
    }, [formik.values.chosenProducts, editedProductsList])

    const handleProductOrderQuantityChange = (incrementOrDecrement: 'increment' | 'decrement', productId?: string) => {
        if (productId) {
            if (formik.values.chosenProducts.hasOwnProperty(productId)) {
                const formikValue = Number(formik.values.chosenProducts[productId]);
                if (incrementOrDecrement === 'decrement' && formikValue === 0) return;
                formik.setFieldValue('chosenProducts', { ...formik.values.chosenProducts, [productId]: incrementOrDecrement === 'increment' ? formikValue + 1 : formikValue - 1 });
            } else {
                formik.setFieldValue('chosenProducts', { ...formik.values.chosenProducts, [productId]: incrementOrDecrement === 'increment' && 1 });
            }
        };
    }

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const productId = event.target.name.replace('chosenProducts.', '');
        const formikValues = formik.values.chosenProducts;
        formik.setFieldValue('chosenProducts', { ...formikValues, [productId]: event.target.value });
    }

    return (
        <>
            <InsetInputField
                name="productSearchQuery"
                className="mb-2 w-full"
                icon={<SearchIcon
                    className="pointer-events-none text-gray-400 w-5 h-5"
                    aria-hidden="true"
                />}
                formik={formik}
                label={f(messages.price)}
            />
            {productsLoading ? <LoadingData /> : (
                <>
                    <div className="text-sm text-priceColors-1 my-2">{f(
                        { id: "{products} products selected" },
                        { products: selectedProducts.length }
                    )}</div>

                    <div className="max-h-96 overflow-y-scroll relative">
                        <ul className="flex p-0 sm:px-4 list-none m-0 mt-4 mb-5 w-full sticky top-0 bg-white">
                            <li className="text-sm w-2/5">{f(messages.Description)}</li>
                            <li className="text-sm text-right w-1/5">{f(messages.pricePerUnit)}</li>
                            <li className="text-sm text-center w-1/4">{f(messages.qty)}</li>
                            <li className="text-sm w-1/6 text-right">{f(messages.total)}</li>
                        </ul>
                        <ul className="p-0 w-full list-none m-0 bg-white shadow sm:rounded-md divide-y divide-gray-200 ">
                            {listToBeUsed && listToBeUsed.length > 0 && listToBeUsed.map((product: IProduct) => {
                                const { id, name, prices, category, num } = product;
                                const productHasPricesLinked = prices && prices.length > 0;
                                const productPrice = productHasPricesLinked && Number(prices[prices.length - 1].value);
                                const isProductChosenAlready = id && has(formik.values.chosenProducts, id);
                                const productPriceAvailable = productPrice && productPrice > 0;
                                const productTotalOrderValue = productHasPricesLinked && isProductChosenAlready && productPriceAvailable && Number(formik.values.chosenProducts[id]) * Number(productPrice);

                                return (
                                    <li key={product.id} className="px-2 py-2 sm:px-4 hover:bg-gray-50 w-full" >
                                        <div className="flex items-center justify-between w-full">
                                            <p className="text-sm font-medium w-2/5 text-brand-500 truncate">{name}</p>

                                            <div className="w-1/5 ml-1 text-right">{productHasPricesLinked ? (
                                                <NumberFormat
                                                    className="text-sm font-medium"
                                                    value={prices[prices.length - 1].value / 100.0}
                                                    thousandSeparator=" "
                                                    decimalSeparator=","
                                                    fixedDecimalScale
                                                    decimalScale={2}
                                                    displayType="text"
                                                    prefix="€ "
                                                />
                                            ) : null}</div>

                                            <div className="flex justify-center w-1/4">
                                                <button type="button" onClick={() => handleProductOrderQuantityChange("decrement", id)}>-</button>
                                                <InputField
                                                    mask="99"
                                                    name={id ? `chosenProducts.${id}` : ''}
                                                    className="w-10 mx-4"
                                                    nestedProperty="chosenProducts"
                                                    formik={formik}
                                                    number
                                                    onChange={handleOnChange}
                                                    label=""
                                                />

                                                <button type="button" onClick={() => handleProductOrderQuantityChange('increment', product.id)}>+</button>
                                            </div>
                                            <div className="w-1/6 text-right">
                                                <NumberFormat
                                                    className="text-sm font-medium"
                                                    value={productTotalOrderValue ? productTotalOrderValue / 100.0 : 0}
                                                    thousandSeparator=" "
                                                    decimalSeparator=","
                                                    fixedDecimalScale
                                                    decimalScale={2}
                                                    displayType="text"
                                                    prefix="€ "
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-0 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    {category}
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6 ml md:ml-3">
                                                    {num}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <ul className="flex justify-end p-0 sm:px-4 list-none m-0 mt-4 w-full md:pr-8">
                        <li className="text-sm font-medium text-center w-1/4 pl-1.5">
                            {quantityAndTotal.quantity}
                        </li>
                        <li className="text-sm text-right w-1/6">
                            <NumberFormat
                                className="text-sm font-medium"
                                value={quantityAndTotal.total / 100.0}
                                thousandSeparator=" "
                                decimalSeparator=","
                                fixedDecimalScale
                                decimalScale={2}
                                displayType="text"
                                prefix="€ "
                            /></li>
                    </ul>
                </>
            )
            }
            <LoadingBtn
                loading={productsLoading}
                type="submit"
                className={classNames(
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 w-1/5 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ml-auto mt-9",
                    !formik.dirty || !formik.isValid || isSubmitDisabled
                        ? "bg-gray-200 hover:bg-gray-700 focus:ring-gray-500"
                        : "bg-brand-500 hover:bg-brand-700 focus:ring-brand-500"
                )}
                disabled={!formik.dirty || !formik.isValid || isSubmitDisabled}
            >
                {f(messages[orderId ? "update" : "create"])}
            </LoadingBtn>
        </>
    )
}