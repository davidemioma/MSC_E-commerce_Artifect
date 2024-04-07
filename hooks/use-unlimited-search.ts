import axios from "axios";
import { useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";

type SearchPostProps = {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  minDiscount?: string;
  maxDiscount?: string;
};

type Props = {
  key: string | string[];
  query: string;
  initialData: any;
  body: SearchPostProps;
};

const useUnlimitedSearch = ({ key, query, initialData, body }: Props) => {
  const lastPostRef = useRef<HTMLElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, error, isLoading, refetch, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: typeof key === "string" ? [key] : [...key],
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await axios.post(`${query}&page=${pageParam}`, body);

        return data;
      },
      initialPageParam: 0,
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialData], pageParams: [1] },
    });

  return {
    ref,
    entry,
    data,
    error,
    refetch,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  };
};

export default useUnlimitedSearch;
