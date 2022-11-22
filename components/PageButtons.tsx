import { useRouter } from "next/router";
import clsx from "clsx";
import { Button } from "./PageButton";

export const PageButtons: React.FC<{ pageOneOrNoQuery: boolean }> = ({
  pageOneOrNoQuery,
}) => {
  const { query } = useRouter();
  return (
    <div
      className={clsx(
        "flex gap-x-10 items-center justify-center text-center py-10 w-full",
        query.page === "2" && "pr-14"
      )}
    >
      <Button label={query.page === "2" ? "Popular / Recent" : "Previous"} />
      <p className="text-2xl font-bold">
        {pageOneOrNoQuery
          ? "Popular / Recent"
          : `Page ${Number(query?.page?.toString()) - 1 ?? 1}`}
      </p>
      <Button isNext label={pageOneOrNoQuery ? "All Listings" : "Next Page"} />
    </div>
  );
};
