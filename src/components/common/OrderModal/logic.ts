import { IEvent } from "../../Event/interfaces";
import { IOrder } from "../../Orders/interfaces";

export const buildOrder = (events: IEvent[], order?: IOrder) => {
    if (order) {
        const orderItems = order.order_items;
        const isEventLinked = orderItems.length > 0 && orderItems[0].event_id
        const event = isEventLinked ? events.find(e => e.id === orderItems[0].event_id) : {};
        const isContactLinked = order.contact.id !== '';
        const chosenProducts = {} as { [key: string]: number };
        orderItems.forEach(orderItem => {
            if (orderItem.product_id) {
                const productId = orderItem.product_id;
                chosenProducts[productId] = orderItem.qty;
            }
        });
        return {
            linkedEvent: event as IEvent,
            contact_id: isContactLinked ? order.contact.id : '',
            chosenProducts: chosenProducts as { [key: string]: number },
            split_order_id: order.split_order_id ? order.split_order_id : '',
        }
    } else {
        return {
            linkedEvent: {} as IEvent,
            contact_id: "",
            chosenProducts: {} as { [key: string]: number },
            split_order_id: ''
        }
    }

} 