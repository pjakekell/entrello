import { useMutation, gql } from "@apollo/client";

export const DELETE_PRICE = gql`
  mutation DeletePrice($id: ID!) {
    DeletePrice(id: $id) {
      id
    }
  }
`;

export function useDeletePrice() {
  const [deletePrice, { loading }] = useMutation(DELETE_PRICE);
  const doDeletePrice = async (id: string) => {
    await deletePrice({ variables: { id } });
  };

  return [doDeletePrice, loading];
}
