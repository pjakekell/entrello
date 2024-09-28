import { useMutation } from "@apollo/client";
import { UPDATE_VOUCHER } from "../pages/Vouchers/logic";

export interface IVoucherInput {
  value?: number;
  dedication?: string;
  contact_id?: string;
}

export function useUpdateVoucher(id: string) {
  const [doUpdateVoucher, { loading, error }] = useMutation(UPDATE_VOUCHER, {
    update(cache: any, { data: { UpdateVoucher: order } }: any) {
      cache.modify({
        id: cache.identify(order),
        fields: {
          contact_id() {
            return order.contact_id;
          },
        },
      });
    },
    /* refetchQueries: [
          {
            query: FETCH_VOUCHER_BY_ID,
            variables: { id },
          },
        ], */
  });
  const updateVoucher = async (input: IVoucherInput) => {
    await doUpdateVoucher({ variables: { id, input } });
  };

  return [updateVoucher, { loading, error }] as const;
}
