import { User } from "../types";
import { useState, useEffect } from "react";

export const useGetTotal = (cart: User["cart"] | undefined) => {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (cart) {
      setTotal(
        cart?.reduce(
          (acc, item) => acc + Number(item.price.replace("$", "")),
          0
        )
      );
    }
  }, [cart]);
  return total;
};
