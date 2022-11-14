import clsx from "clsx";
import { useRouter } from "next/router";

export const Button: React.FC<{
  label: string;
  isNext?: boolean;
}> = ({ label, isNext = false }) => {
  const { push, query, pathname } = useRouter();
  const disabled = (query.page === "1" && !isNext) || (!query.page && !isNext);

  return (
    <button
      type="button"
      onClick={async () => {
        const page = query.page ? parseInt(query.page as string) : 1;
        const newPage = isNext ? page + 1 : page - 1;
        const search = query.search ?? undefined;

        await push({ pathname, query: { page: newPage, search } });
      }}
      className={clsx(
        "px-4 py-2 rounded-full text-white font-medium hover:bg-color2",
        disabled ? "opacity-50 cursor-not-allowed" : "bg-[#0E3276]"
      )}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
