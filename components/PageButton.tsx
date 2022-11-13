import { useRouter } from "next/router";

export const Button: React.FC<{
  label: string;
  isNext?: boolean;
}> = ({ label, isNext = false }) => {
  const { push, query, pathname } = useRouter();

  if (query.page === "1" && !isNext) return null;
  if (!query.page && !isNext) return null;
  return (
    <button
      className="bg-gray-200 hover:bg-gray-300 py-2 px-5 rounded"
      onClick={async () => {
        const page = query.page ? parseInt(query.page as string) : 1;
        const newPage = isNext ? page + 1 : page - 1;
        const search = query.search ?? undefined;

        await push({ pathname, query: { page: newPage, search } });
      }}
    >
      {label}
    </button>
  );
};
