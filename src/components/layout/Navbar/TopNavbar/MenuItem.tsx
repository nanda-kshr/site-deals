import * as React from "react";

import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type MenuItemProps = {
  label: string;
  url?: string;
};

export function MenuItem({ label,url }: MenuItemProps) {
  return (
    <NavigationMenuItem>

        <NavigationMenuLink
          href={url}
          className={cn([navigationMenuTriggerStyle(), "font-normal px-3"])}
        >
          {label}
        </NavigationMenuLink>

    </NavigationMenuItem>
  );
}
