import { IProduct } from "../../../pages/Products/interfaces";
import { IEvent } from "../../Event/interfaces"

export interface IGeneralOrderTab {
    formik: any,
    eventsLoading: boolean
    events: IEvent[]
}

export interface IProductsTab {
    formik: any;
    products: IProduct[];
    productsLoading: boolean;
}