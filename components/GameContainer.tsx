import type { PropsWithChildren } from "react";
export const GameContainer: React.FC<PropsWithChildren<{ label: string }>> = ({
  children,
  label,
}) => (
  <div className="p-4 sm:pb-16 sm:px-6 w-full lg:px-32">
    <h1 className="text-2xl font-semibold text-gray-700 mb-1">{label}</h1>
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
      {children}
    </div>
  </div>
);
