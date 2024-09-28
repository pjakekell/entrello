// import { useMutation } from "@apollo/client";
// import { UPDATE_ORDER } from "../components/Orders/logic";
// import { IBankAccount } from '../components/Org/interfaces'
//
// export function useCreateBankAccount(in: IBankAccount) {
//     const [doCreateBankAccount, { loading, error }] = useMutation(CREATE_BANK_ACCOUNT, {
//         update(cache: any, { data: { UpdateOrder: order } }: any) {
//             cache.modify({
//                 id: cache.identify(order),
//                 fields: {
//                     contact_id() {
//                         return order.contact_id;
//                     },
//                 },
//             });
//         },
//         /* refetchQueries: [
//           {
//             query: FETCH_ORDER_BY_ID,
//             variables: { id },
//           },
//         ], */
//     });
//     const createBankAccount = async (input: IUpdateOrderInput, orderId?: string) => {
//         await doUpdateOrder({ variables: { id: orderId ? orderId : id, input } });
//     };
//
//     return [createBankAccount, { loading, error }] as const;
// }

export default () => {};
