import { PAGINATION_QUERY } from '../components/Pagination';

// There are multiple console.log()'s in this file. Uncomment them for Cache debugging
export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      // console.log({ existing, args, cache });
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // if
      //  there are items
      //  AND there aren't enough items to satisfy how many were requested
      //  AND we are on the last page
      // THEN just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // We don't have any items, we must go to the network to fetch them
        return false;
      }

      // If there are items, jsut return them from the cache and we don't need to go to the network
      if (items.length) {
        // console.log(
        //   `There are ${items.length} items in the cache! Going to send them to Apollo`
        // );
        return items;
      }

      return false; // fallback to network
      // First thing it does it asks the read function for those items.
      // We can either do one of two things:
      // first things we can do is return the items because they are already in the cache
      // The other thing we can do is to return false from here, (network request) (no items in cache)
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // This runs when the Apollo client comes back from the network with our product
      // console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // console.log(merged);
      // Finally we return the merged items from the cache,
      return merged; // After the merge function is executed read gets executed
    },
  };
}