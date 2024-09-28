import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "@apollo/react-hooks";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import pick from "lodash/pick";
import isUndefined from "lodash/isUndefined";
import isEqual from "lodash/isEqual";
import { CashIcon } from "@heroicons/react/outline";

import {
  CREATE_PRODUCT,
  CREATE_PRODUCT_PRICE,
  FETCH_PRODUCTS,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_PRICE,
  FETCH_PRODUCT_CAPACITY,
  EDIT_PRODUCT_CAPACITY,
} from "./logic";
import { IProduct } from "./interfaces";
import InputField from "../../components/FormHelpers/InputField";
import LoadingBtn from "../../components/Btn/LoadingBtn";
import { classNames } from "../../utils/misc";
import messages from "../../i18n/messages";
import TaxGroupInput from "../../components/FormHelpers/TaxGroupInput";
import InsetInputField from "../../components/FormHelpers/InsetInputField";

export default function ProductForm({
  product,
  handleClose,
}: {
  product: IProduct;
  handleClose: () => void;
}) {
  const navigate = useNavigate();
  const { formatMessage: f } = useIntl();
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);

  const [createProduct, { loading: creatingProduct }] =
    useMutation(CREATE_PRODUCT);
  const [updateProduct, { loading: updatingProduct }] =
    useMutation(UPDATE_PRODUCT);

  const [createProductPrice, { loading: creatingPrice }] =
    useMutation(CREATE_PRODUCT_PRICE);
  const [updateProductPrice, { loading: updatingPrice }] =
    useMutation(UPDATE_PRODUCT_PRICE);

  const [updateProductCapacity, { loading: updatingProductCapacity }] =
    useMutation(EDIT_PRODUCT_CAPACITY);

  useEffect(() => {
    if (
      creatingProduct ||
      updatingProduct ||
      creatingPrice ||
      updatingPrice ||
      updatingProductCapacity
    )
      setIsFormDisabled(true);
    if (
      !creatingProduct &&
      !updatingProduct &&
      !creatingPrice &&
      !updatingPrice &&
      !updatingProductCapacity
    )
      setIsFormDisabled(false);
  }, [
    creatingProduct,
    updatingProduct,
    creatingPrice,
    updatingPrice,
    updatingProductCapacity,
  ]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().max(40).required(f(messages.nameRequired)),
    pos: Yup.number().min(0).required(f(messages.productPositionRequired)),
    category: Yup.string().required(),
    num: Yup.string(),
    unit: Yup.string(),
    description: Yup.string(),
    priceName: Yup.string(),
    priceValue: Yup.number().required(),
    tax_group_id: Yup.string(),
    total_qty: Yup.number()
      .required()
      .label("Product capacity")
      .moreThan(product.total_qty === 0 ? 0 : -(product.total_qty + 1)),
  });
  const formik = useFormik({
    initialValues: {
      ...product,
      total_qty: 0,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit,
  });

  const getInputValues = () => {
    return pick(
      formik.values,
      "name",
      "pos",
      "category",
      "num",
      "unit",
      "description"
    );
  };

  const create = async () => {
    try {
      const input = getInputValues();
      const { data, errors } = await createProduct({
        variables: {
          input,
        },
        onCompleted: async (createdProduct) => {
          if (createdProduct.CreateProduct) {
            const { CreateProduct: createdProductData } = createdProduct;
            const { data: productPriceData } = await createProductPrice({
              variables: {
                input: {
                  value: formik.values.priceValue,
                  tax_group_id: formik.values.tax_group_id,
                  name: "", //Currently required - TODO: remove this requirement
                  product_id: createdProductData.id,
                },
              },
            });
            const { data: productCapacityData } = await updateProductCapacity({
              variables: {
                input: {
                  product_id: createdProductData.id,
                  total_qty: formik.values.total_qty,
                },
              },
              refetchQueries: [
                {
                  query: FETCH_PRODUCT_CAPACITY,
                  variables: {
                    product_id: createdProduct.CreateProduct.id,
                  },
                },
                {
                  query: FETCH_PRODUCTS,
                  variables: {
                    limit: 100,
                  },
                },
              ],
            });
            if (
              productPriceData.CreateProductPrice &&
              productCapacityData.AddProductCapacity
            ) {
              handleClose();
            }
            return;
          }
        },
      });
      if (data.CreateProduct) {
        return;
      }
      console.error("unexpected return value from server", errors, data);
      return;
    } catch (e) {
      console.error(e);
    }
  };

  const save = async () => {
    try {
      const input = getInputValues();
      const productFormValues = {
        category: product.category,
        description: product.description,
        name: product.name,
        num: product.num,
        unit: product.unit,
        pos: product.pos,
      };
      const isProductChanged = !isEqual(input, productFormValues);
      const isProductPriceChanged =
        formik.values.priceValue !== product.priceValue ||
        formik.values.tax_group_id !== product.tax_group_id;
      const isProductCapacityChanged = formik.values.total_qty !== 0;

      let error;

      if (isProductChanged) {
        const { errors } = await updateProduct({
          variables: {
            id: product.id,
            input,
          },
          refetchQueries: [
            {
              query: FETCH_PRODUCTS,
              variables: {
                limit: 100,
              },
            },
          ],
        });
        if (errors) {
          error = errors;
        }
      }
      if (isProductPriceChanged) {
        const { errors } = await updateProductPrice({
          variables: {
            id: product.priceId,
            input: {
              value: formik.values.priceValue,
              tax_group_id: formik.values.tax_group_id,
              name: "", //Currently required - TODO: remove this requirement
            },
          },
          refetchQueries: [
            {
              query: FETCH_PRODUCTS,
              variables: {
                limit: 100,
              },
            },
          ],
        });
        if (errors) {
          error = errors;
        }
      }
      if (isProductCapacityChanged) {
        const { errors } = await updateProductCapacity({
          variables: {
            input: {
              product_id: product.id,
              total_qty: formik.values.total_qty,
            },
          },
          refetchQueries: [
            {
              query: FETCH_PRODUCTS,
              variables: {
                limit: 100,
              },
            },
            {
              query: FETCH_PRODUCT_CAPACITY,
              variables: { product_id: product.id },
            },
          ],
        });
        if (errors) {
          error = errors;
        }
      }
      if (error) console.error("unexpected return value from server", error);

      handleClose();
      return;
    } catch (e) {
      console.error(e);
    }
  };

  function onSubmit() {
    if (product && product.id) {
      save();
      return;
    }
    create();
  }

  const handleBackToProducts = () => navigate(`/products`);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <InputField
          name="name"
          className="mb-2 col-span-6 py-2"
          formik={formik}
          onBlur={false}
          disabled={isFormDisabled}
          label={f(messages.name)}
          cornerHint={f(
            { id: "{count} characters remaining" },
            {
              count:
                40 -
                (!isUndefined(formik.values.name)
                  ? formik.values.name.length
                  : 0),
              b: (...chunks) => <b key="ttt">{chunks}</b>,
            }
          )}
        />
        <InputField
          name="description"
          className="mb-2 col-span-6 py-2"
          formik={formik}
          disabled={isFormDisabled}
          label={f(messages.description)}
          cornerHint={f(
            { id: "{count} characters remaining" },
            {
              count:
                40 -
                (!isUndefined(formik.values.description)
                  ? formik.values.description.length
                  : 0),
              b: (...chunks) => <b key="ttt">{chunks}</b>,
            }
          )}
        />
        <div className="flex items-center justify-between mb-2 space-x-1">
          <InputField
            name="num"
            className=""
            formik={formik}
            disabled={isFormDisabled}
            label={f(messages.intProductNum)}
          />
          <InputField
            name="unit"
            className=""
            formik={formik}
            disabled={isFormDisabled}
            label={f(messages.unit)}
          />
          <InputField
            name="pos"
            className=""
            formik={formik}
            number
            disabled={isFormDisabled}
            label={f(messages.position)}
          />
        </div>
        <InputField
          name="category"
          className="mb-2 col-span-6 py-2"
          formik={formik}
          onBlur={false}
          disabled={isFormDisabled}
          label={f(messages.category)}
          cornerHint={f(
            { id: "{count} characters remaining" },
            {
              count:
                40 -
                (!isUndefined(formik.values.category)
                  ? formik.values.category.length
                  : 0),
              b: (...chunks) => <b key="ttt">{chunks}</b>,
            }
          )}
        />
        <div className="flex justify-between gap-1 items-center">
          <InsetInputField
            name="priceValue"
            className="mb-2 col-span-6 py-4 w-2/3"
            icon={<CashIcon className="h-5 w-5 text-gray-400" />}
            formik={formik}
            number
            currency="€"
            disabled={isFormDisabled}
            label={f(messages.price)}
          />
          <TaxGroupInput
            name="tax_group_id"
            className="mb-2 col-span-6 py-4 w-full"
            formik={formik}
            disableEdit
            label={f(messages.taxGroup)}
          />
        </div>
        <InputField
          name="total_qty"
          className="mb-2 col-span-6 py-2"
          formik={formik}
          number
          mask={[
            /^[-+]?\d*$/i,
            /^[-+]?\d*$/i,
            /^[-+]?\d*$/i,
            /^[-+]?\d*$/i,
            /^[-+]?\d*$/i,
            /^[-+]?\d*$/i,
          ]} // Input was not accepting negative numbers and I had to dig through the react-mask documentation to find how to fix this issue. Now it only accepts negative and positive numbers
          disabled={isFormDisabled}
          label={f(messages.addOrRemoveCapacity, {
            capacity: product.total_qty,
            changedValue: isNaN(
              Number(
                Number(product.total_qty) + Number(formik.values.total_qty)
              )
            )
              ? product.total_qty
              : Number(
                  Number(product.total_qty) + Number(formik.values.total_qty)
                ),
          })}
        />

        <div className="mt-5 sm:mt-4 sm:flex">
          <LoadingBtn
            loading={isFormDisabled}
            type="submit"
            className={classNames(
              "focus:outline-none focus:ring-2 focus:ring-offset-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
              !formik.dirty || !formik.isValid || isFormDisabled
                ? "bg-gray-200 hover:bg-gray-700 focus:ring-gray-500"
                : "bg-brand-500 hover:bg-brand-700 focus:ring-brand-500"
            )}
            disabled={!formik.dirty || !formik.isValid || isFormDisabled}
          >
            {product.id ? f(messages.update) : f(messages["create"])}
          </LoadingBtn>
          <button
            type="submit"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleBackToProducts}
          >
            {f(messages.cancel)}
          </button>
        </div>
      </div>
    </form>
  );
}
