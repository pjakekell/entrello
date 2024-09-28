import { useQuery, gql } from "@apollo/client";
import moment from "moment";

export const GET_EVENT_STATS = gql`
  query stats($input: StatsInput!) {
    stats(input: $input) {
      stats_date {
        created_at
        booked
        paid
        claimed
        refunded
        revenue
        revenue_paid
      }
    }
  }
`;

export const useGlobalStats = (
  from_date: Date,
  to_date: Date,
  resolution: string
) => {
  const { data, loading, error } = useQuery(GET_EVENT_STATS, {
    variables: {
      input: {
        from_date: moment(from_date).format("YYYY-MM-DD HH:00:00"),
        to_date: moment(to_date).format("YYYY-MM-DD HH:00:00"),
        resolution,
      },
    },
  });
  return [data ? data.stats : null, { loading, error }] as const;
};
