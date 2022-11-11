import { useRouter } from "next/router";

export const Button: React.FC<{
  label: string;
  isNext?: boolean;
}> = ({ label, isNext = false }) => {
  const router = useRouter();
  const { query } = router;
  const onClick = () => {
    const page = query.page ? parseInt(query.page as string) : 1;
    router.push("/?page=" + (isNext ? page + 1 : page - 1));
  };

  if (query.page) {
    if (query.page === "1" && !isNext) return null;
    return (
      <button
        className="bg-gray-200 hover:bg-gray-300 py-2 px-5 rounded"
        onClick={onClick}
      >
        {label}
      </button>
    );
  }
  return null;
};
