
interface GetCacheKeyI {
  __typename: string,
  id: string,
}

export const getCacheKey = (cache:any, opts:GetCacheKeyI) =>
  cache.config.dataIdFromObject(opts)