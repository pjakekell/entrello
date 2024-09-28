import React, { Fragment, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Transition, Dialog } from "@headlessui/react";
import { TrashIcon, XIcon } from "@heroicons/react/outline";
import * as Yup from "yup";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";

import messages from "../../i18n/messages";
import LocationForm from "./LocationForm";
import { buildInitialValues, CREATE_LOCATION, FETCH_LOCATIONS, FETCH_LOCATION_BY_ID, UPDATE_LOCATION, DELETE_LOCATION } from "./logic";
import { setMsg } from "../Toaster/logic";
import Tooltip, { Placement } from "../Tooltip/Tooltip";
import LoadingIcon from "../Btn/LoadingIcon";
import { LatLngTuple } from "leaflet";

const LocationFinderEncapsulation = ({ setMarkerLocation, currentMarkerLocation }: { currentMarkerLocation: LatLngTuple | null | false, setMarkerLocation: (lat: number, lng: number) => void }) => {
    const map = useMap();
    useEffect(() => {
        if (currentMarkerLocation) {
            map.panTo(currentMarkerLocation);
        }
    }, [currentMarkerLocation, map])
    useMapEvents({
        click(e) {
            setMarkerLocation(e.latlng.lat, e.latlng.lng);
        }
    })
    return null
}


const LocationModal = () => {
    const [showLocationDialog, setShowDialog] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const focusFieldRef = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { locationId } = useParams();
    const { formatMessage: f } = useIntl();

    const handleClose = () => {
        setShowDialog(false);
        navigate(-1);
    }

    const [createLocation, { loading: loadingCreate, error: creationError }] = useMutation(CREATE_LOCATION);
    const [updateLocation, { loading: loadingUpdate, error: updateError }] = useMutation(UPDATE_LOCATION);
    const { data: locationData, loading: loadingFetchById, error: fetchError } = useQuery(FETCH_LOCATION_BY_ID, {
        variables: { id: locationId },
        skip: !locationId
    });
    const [deleteLocation, { loading: deleting }] = useMutation(DELETE_LOCATION)

    const initialLocationData = buildInitialValues(locationData ? locationData.location : null);
    const [currentMarkerLocation, setCurrentMarkerLocation] = useState<LatLngTuple | null | false>(initialLocationData.lat && initialLocationData.lng ? [initialLocationData.lat, initialLocationData.lng] : null);

    if (creationError) {
        dispatch(setMsg({ title: creationError.message }));
    }
    if (fetchError) {
        dispatch(setMsg({ title: fetchError.message }));
    }
    if (updateError) {
        dispatch(setMsg({ title: updateError.message }));
    }

    useEffect(() => {
        if (loadingCreate || loadingUpdate || loadingFetchById || deleting) {
            setIsFormLoading(true);
        } else {
            setIsFormLoading(false)
        }
    }, [loadingCreate, loadingUpdate, loadingFetchById, deleting])

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(70).required(f(messages.nameRequired)),
        street: Yup.string(),
        postcode: Yup.string(),
        city: Yup.string(),
        country: Yup.string(),
        email: Yup.string().email(f(messages.invalidEmailError)),
    });


    const formik = useFormik({
        initialValues: {
            ...initialLocationData
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit,
    })

    useEffect(() => {
        if (!formik.values.lng || !formik.values.lat) return;
        if (locationId && locationData) {
            setCurrentMarkerLocation([formik.values.lat, formik.values.lng]);
        }
    }, [formik.values.lat, formik.values.lng, locationData, locationId])

    function onSubmit() {
        if (locationId) {
            update();
        } else {
            save();
        }
    }

    const getInputValues = () => {
        return {
            name: formik.values.name,
            address: {
                street: formik.values.street,
                postcode: formik.values.postcode,
                city: formik.values.city,
                country: formik.values.country,
                email: formik.values.email,
                phone: formik.values.phone,
                coords: {
                    lat: formik.values.lat,
                    lng: formik.values.lng
                }
            }
        }
    }
    async function save() {
        const input = getInputValues();
        try {
            const { data, errors } = await createLocation({
                variables: {
                    input
                },
                refetchQueries: [
                    {
                        query: FETCH_LOCATIONS
                    }
                ]
            })
            if (data.CreateLocation) {
                handleBackToListing();
                return
            }
            console.error("unexpected return value from server", errors);
        } catch (e) {
            console.error(e);
        }
    }
    const handleBackToListing = () => {
        navigate(-1);
    }

    async function update() {
        const input = getInputValues();
        try {
            const { data, errors } = await updateLocation({
                variables: {
                    id: locationId,
                    input
                },
                refetchQueries: [
                    {
                        query: FETCH_LOCATIONS
                    }
                ]
            })
            if (data.UpdateLocation) {
                handleBackToListing();
                return;
            }
            console.error("unexpected return value from server", errors);
        } catch (e) {
            console.error(e);
        }
    }

    const setMarkerLocation = (lat: number, lng: number) => {
        setCurrentMarkerLocation([lat, lng]);
        formik.setFieldValue("lat", lat);
        formik.setFieldValue("lng", lng);
    }

    const handleDelete = async () => {
        try {
            await deleteLocation({
                variables: {
                    id: locationId
                },
                refetchQueries: [
                    {
                        query: FETCH_LOCATIONS,
                    },
                ],
            });
            dispatch(setMsg({ title: f(messages.locationDeleted), level: "success" }));
            handleClose();
        } catch (e) {
            dispatch(setMsg({ title: "ERROR", level: "error", desc: (e as Error).message }));
        }
    };
    return (
        <Transition.Root show={showLocationDialog} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-10 inset-0 overflow-y-auto"
                initialFocus={focusFieldRef}
                open
                onClose={handleClose}
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
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg leading-6 font-medium text-brand-600"
                                    >
                                        {locationId ? f(messages.editLocation) : f(messages.newLocation)}
                                    </Dialog.Title>
                                </div>
                                {locationId ? (<Tooltip
                                    content={f(messages.deleteLocationDescription)}
                                    placement={Placement.top}
                                >
                                    <div
                                        className="mx-auto flex-shrink-0 flex items-center justify-center h-8 w-8 sm:-mt-2 sm:-mr-2 sm:h-10 sm:w-10 cursor-pointer group"
                                        onClick={handleDelete}
                                    >
                                        {deleting ? (
                                            <LoadingIcon color="text-red-600" />
                                        ) : (
                                            <TrashIcon
                                                className="h-6 w-6 text-red-400 group-hover:text-red-600"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </div>
                                </Tooltip>) : null}
                                <div
                                    className="mx-auto flex-shrink-0 flex items-center justify-center h-8 w-8 sm:-mt-2 sm:-mr-2 sm:h-10 sm:w-10 cursor-pointer"
                                    onClick={handleClose}
                                >
                                    <XIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                                </div>
                            </div>
                            {isFormLoading ? null : (
                                <div className="flex justify-between">
                                    <div className="mt-2 max-w-xl w-full">
                                        <LocationForm formik={formik} handleBackToListing={handleBackToListing} setMarkerLocation={setMarkerLocation} />
                                    </div>
                                    <div className="mt-2 max-w-xl w-full ml-2">
                                        {locationId && locationData ? (
                                            <MapContainer center={formik.values.lat && formik.values.lng ? [formik.values.lat, formik.values.lng] : [48.2082, 16.3738]} zoom={13} scrollWheelZoom={false}>
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                <LocationFinderEncapsulation currentMarkerLocation={currentMarkerLocation} setMarkerLocation={setMarkerLocation} />
                                                {currentMarkerLocation ?
                                                    <Marker
                                                        draggable
                                                        position={[currentMarkerLocation[0], currentMarkerLocation[1]]}
                                                        eventHandlers={{
                                                            dragend: (e) => {
                                                                const latling = e.target.getLatLng();
                                                                setCurrentMarkerLocation([latling.lat, latling.lng]);
                                                                formik.setFieldValue("lat", latling.lat);
                                                                formik.setFieldValue("lng", latling.lng);
                                                            }
                                                        }}
                                                    >
                                                        <Popup>
                                                            A pretty CSS3 popup. <br /> Easily customizable.
                                                        </Popup>
                                                    </Marker>
                                                    : null
                                                }
                                            </MapContainer>
                                        ) : (
                                            <MapContainer center={formik.values.lat && formik.values.lng ? [formik.values.lat, formik.values.lng] : [48.2082, 16.3738]} zoom={13} scrollWheelZoom={false}>
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                <LocationFinderEncapsulation currentMarkerLocation={currentMarkerLocation} setMarkerLocation={setMarkerLocation} />
                                                {currentMarkerLocation ?
                                                    <Marker
                                                        draggable
                                                        position={[currentMarkerLocation[0], currentMarkerLocation[1]]}
                                                        eventHandlers={{
                                                            dragend: (e) => {
                                                                const latling = e.target.getLatLng();
                                                                setCurrentMarkerLocation([latling.lat, latling.lng]);
                                                                formik.setFieldValue("lat", latling.lat);
                                                                formik.setFieldValue("lng", latling.lng);
                                                            }
                                                        }}
                                                    >
                                                        <Popup>
                                                            A pretty CSS3 popup. <br /> Easily customizable.
                                                        </Popup>
                                                    </Marker>
                                                    : null
                                                }
                                            </MapContainer>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default LocationModal;