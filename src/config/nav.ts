import { SidebarLink } from "@/components/SidebarItems";
import { Calendar, UserRound } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Perfil", icon: UserRound },
  { href: "/eventos", title: "Eventos", icon: Calendar },
  // { href: "/account", title: "Account", icon: Cog },
  // { href: "/settings", title: "Settings", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [
  /*
  {
    title: "",
    links: [
      {
        href: "/eventos",
        title: "Eventos",
        icon: Calendar,
      },
    ],
  },
  */
];
