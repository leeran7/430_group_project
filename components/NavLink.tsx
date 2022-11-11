import Link from "next/link";

type NavLinkType = {
  name: string;
  href: string;
  show: boolean;
};

export const NavLink: React.FC<{
  link: NavLinkType;
  mobileStyles?: boolean;
}> = ({ link, mobileStyles }) => {
  if (!link.show) return null;
  return (
    <Link key={link.name} href={link.href}>
      <a
        className={`font-medium text-white transition-all ease-in-out duration-100 hover:text-indigo-50 ${
          mobileStyles
            ? "text-base hover:text-indigo-50"
            : "text-lg hover:underline"
        }`}
      >
        {link.name}
      </a>
    </Link>
  );
};
