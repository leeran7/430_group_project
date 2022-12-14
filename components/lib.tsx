import {
  FaPlaystation,
  FaXbox,
  FaDesktop,
  FaLinux,
  FaAndroid,
  FaApple,
} from "react-icons/fa";
import { RiMacbookLine } from "react-icons/ri";
import { SiPlaystationvita, SiWiiu, SiNintendoswitch } from "react-icons/si";
export const getPricing = (releaseDate: string | null, rating: number) => {
  if (!releaseDate || rating === 0) return "$9.99";
  if (releaseDate.includes("2022")) {
    return "$69.99";
  } else if (rating >= 4.5) {
    return "$59.99";
  } else if (rating >= 4.2) {
    return "$49.99";
  } else if (rating >= 3.7) {
    return "$39.99";
  } else if (rating >= 3.2) {
    return "$29.99";
  } else if (rating > 2) {
    return "$19.99";
  } else {
    return "$9.99";
  }
};
const include = (p: string, g: string) => {
  return p.includes(g) ? g : null;
};

export const getSymbols = (p: string) => {
  return (
    <p key={p} className="flex gap-x-0.5 text-md items-center justify-center">
      {include(p, "PlayStation") ? (
        <FaPlaystation />
      ) : include(p, "Xbox") ? (
        <FaXbox />
      ) : include(p, "PC") ? (
        <FaDesktop />
      ) : include(p, "Linux") ? (
        <FaLinux />
      ) : include(p, "macOS") ? (
        <RiMacbookLine />
      ) : include(p, "Wii U") ? (
        <SiWiiu />
      ) : include(p, "Android") ? (
        <FaAndroid />
      ) : include(p, "iOS") ? (
        <FaApple />
      ) : include(p, "Vita") ? (
        <SiPlaystationvita />
      ) : include(p, "Switch") ? (
        <SiNintendoswitch />
      ) : (
        p
      )}
      <sup className="text-xs">
        {include(p, "One")
          ? "One"
          : include(p, "S/X")
          ? "S/X"
          : include(p, "360")
          ? "360"
          : include(p, "1")
          ? "1"
          : include(p, "2")
          ? "2"
          : include(p, "3")
          ? "3"
          : include(p, "4")
          ? "4"
          : include(p, "5")
          ? "5"
          : null}
      </sup>
    </p>
  );
};
