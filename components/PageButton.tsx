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
        disabled
          ? "text-white bg-white"
          : "hover:text-white hover:bg-color1 bg-white",
        "px-4 py-2 rounded-full font-medium tracking-widest transition-colors ease-in-out"
      )}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
