import { FaPlaystation, FaXbox, FaDesktop, FaLinux } from "react-icons/fa";

export const getPricing = (releaseDate: string, rating: number) => {
  let price = null;
  if (releaseDate.includes("2022")) {
    price = "$69.99";
  } else if (rating >= 4.5) {
    price = "$59.99";
  } else if (rating >= 4.2) {
    price = "$49.99";
  } else if (rating >= 3.7) {
    price = "$39.99";
  } else if (rating >= 3.2) {
    price = "$29.99";
  } else {
    price = "$19.99";
  }
  return price;
};

export const getSymbols = (platform: string) => {
  let symb = null;
  if (platform.includes("PlayStation")) {
    symb = <FaPlaystation />;
  } else if (platform.includes("Xbox")) {
    symb = <FaXbox />;
  } else if (platform.includes("PC")) {
    symb = <FaDesktop />;
  } else if (platform.includes("Linux")) {
    symb = <FaLinux />;
  }
  const number = platform.match(/\d+/g);
  return (
    <p key={platform} className="flex text-lg items-center justify-center">
      {symb}
      <sup>{platform.includes("One") ? 1 : number}</sup>
    </p>
  );
};
