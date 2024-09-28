import React, { useState } from "react";
import { isNull, isUndefined } from "lodash";
import { useIntl } from "react-intl";
import Select from "react-select";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { useParams } from "react-router";

import InputField from "../FormHelpers/InputField";
import messages from "../../i18n/messages";
import LoadingBtn from "../Btn/LoadingBtn";
import { classNames } from "../../utils/misc";
import { ILocationOptions, IlocationOptionSelected } from "./interfaces";
import { customSelectStyles, selectTheme } from "../common/reactSelectTheme";
import CountrySelectField from "../FormHelpers/CountrySelectField";

const LocationForm = ({ formik, handleBackToListing, setMarkerLocation }: { formik: any, handleBackToListing: () => void, setMarkerLocation: (lat: number, lng: number) => void }) => {
    const { formatMessage: f } = useIntl();
    const { locationId } = useParams();
    const [locationOptions, setLocationOptions] = useState<IlocationOptionSelected[]>();

    const [areLocationsLoading, setAreLocationsLoading] = useState(false);
    const [currentInput, setCurrentInput] = useState(formik.values.street);

    const provider = new OpenStreetMapProvider({
        params:
        {
            addressdetails: 1,
            countrycodes: formik.values.country,
        }
    });

    async function onLocationSearch(query: string) {
        setAreLocationsLoading(true);
        const results = await provider.search({ query });
        const options = results.map((result: ILocationOptions) => {
            return {
                value: result.label,
                label: result.label,
                lat: result.y,
                lng: result.x,
            }
        })
        setLocationOptions(options);
        setAreLocationsLoading(false);
    }

    const onAddressSelect = (selectedOption: IlocationOptionSelected | null, details: { action: string }) => {
        if (!isNull(selectedOption)) {
            formik.setFieldValue("lat", selectedOption.lat);
            formik.setFieldValue("lng", selectedOption.lng);
            formik.setFieldValue("street", selectedOption.label);
            setMarkerLocation(selectedOption.lat, selectedOption.lng);
            setCurrentInput(selectedOption.label);
        }
        if (details.action === 'clear') {
            formik.setFieldValue("lat", 0);
            formik.setFieldValue("lng", 0);
            formik.setFieldValue("street", '');
            setCurrentInput('');
        }
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <div>
                <InputField
                    name="name"
                    className="mb-2 col-span-6 py-2"
                    formik={formik}
                    onBlur={false}
                    disabled={formik.isSubmitting}
                    label={f(messages.name)}
                    cornerHint={f(
                        { id: "{count} characters remaining" },
                        {
                            count:
                                70 -
                                (!isUndefined(formik.values.name)
                                    ? formik.values.name.length
                                    : 0),
                            b: (...chunks) => <b key="ttt">{chunks}</b>,
                        }
                    )}
                />
                <section>
                    <h2 className="my-2">{f(messages.address)}</h2>
                    <div className="w-full">
                        <div className="flex justify-between items-end">
                            <label
                                className="block text-sm font-normal text-gray-700 mb-1"
                                htmlFor="location-react-select"
                            >
                                {f(messages.street)}
                            </label>
                        </div>
                        <Select
                            isDisabled={formik.isSubmitting || !formik.values.country}
                            id="location-react-select"
                            className="react-select"
                            options={locationOptions}
                            placeholder={formik.values.country ? "Please search for a location" : f(messages.chooseACountryFirst)}
                            theme={selectTheme}
                            inputValue={currentInput}
                            isLoading={areLocationsLoading}
                            closeMenuOnSelect={false}
                            onInputChange={(value: string, action) => {
                                if (action.action !== "input-blur" && action.action !== "menu-close") {
                                    onLocationSearch(value);
                                    setCurrentInput(value);
                                    formik.setFieldValue("street", value);
                                }
                            }}
                            onChange={onAddressSelect}
                            isClearable={true}
                            styles={customSelectStyles}
                        />
                    </div>
                    <div className="flex space-x-4 items-center justify-between py-1">
                        <InputField
                            name="postcode"
                            className=""
                            formik={formik}
                            number
                            mask={"99999"}
                            disabled={formik.isSubmitting}
                            label={f(messages.postcode)}
                        />
                        <InputField
                            name="city"
                            className="grow"
                            formik={formik}
                            disabled={formik.isSubmitting}
                            label={f(messages.city)}
                        />
                    </div>
                    <CountrySelectField
                        name="country"
                        className="col-span-3 py-1"
                        formik={formik}
                        disabled={formik.isSubmitting}
                        label={f(messages.country)}
                    />
                    <InputField
                        name="phone"
                        className="col-span-3 py-1"
                        formik={formik}
                        disabled={formik.isSubmitting}
                        label={f(messages.phone)}
                    />
                    <InputField
                        name="email"
                        className="col-span-3 py-1"
                        formik={formik}
                        disabled={formik.isSubmitting}
                        label={f(messages.email)}
                    />
                </section>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex">
                <LoadingBtn
                    loading={formik.isSubmitting}
                    type="submit"
                    className={classNames(
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 grow flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
                        !formik.dirty || !formik.isValid
                            ? "bg-gray-200 hover:bg-gray-700 focus:ring-gray-500"
                            : "bg-brand-500 hover:bg-brand-700 focus:ring-brand-500"
                    )}
                    disabled={!formik.dirty || !formik.isValid}
                >
                    {locationId ? f(messages.update) : f(messages.create)}
                </LoadingBtn>
                <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleBackToListing}
                >
                    {f(messages.cancel)}
                </button>
                <button
                    type="button"
                    onClick={() => setMarkerLocation(0, 0)}
                    className={classNames("mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm",
                        (formik.values.lat === 0 || formik.values.lng === 0) && "bg-gray-200 focus:ring-gray-500 pointer-events-none"
                    )}
                >
                    {f(messages.removeMarker)}
                </button>
            </div>
        </form>
    )
}

export default LocationForm;