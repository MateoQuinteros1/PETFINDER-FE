import { algoliasearch } from "algoliasearch";

export const algoliaClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APPID,
  import.meta.env.VITE_ALGOLIA_SEARCH_APIKEY
);
