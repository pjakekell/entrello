import { useMutation, gql } from "@apollo/client";

export const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    DeleteOrder(id: $id) {
      ok
    }
  }
`;

export function useDeleteOrder() {
  const [deleteOrder, { loading, error }] = useMutation(DELETE_ORDER);
  const doDeleteOrder = async (id: string) => {
    await deleteOrder({ variables: { id } });
  };

  return [doDeleteOrder, { loading, error }] as const;
}
