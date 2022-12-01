import clsx from "clsx";
import { useRouter } from "next/router";

export const Button: React.FC<{
  label: string;
  isNext?: boolean;
}> = ({ label, isNext = false }) => {
  const { push, query, pathname, replace } = useRouter();
  const disabled = (query.page === "1" && !isNext) || (!query.page && !isNext);

  return (
    <button
      type="button"
      onClick={async () => {
        const page = query.page ? parseInt(query.page as string) : 1;
        const newPage = isNext ? page + 1 : page - 1;
        const search = query.search ?? undefined;
        if (!isNext && page === 2) {
          await replace({ pathname, query: { page: newPage } });
        } else {
          await push({ pathname, query: { page: newPage, search } });
        }
      }}
      className={clsx(
        "px-4 py-2 rounded-full text-white font-medium tracking-wider",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "bg-color1 hover:bg-opacity-75"
      )}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
