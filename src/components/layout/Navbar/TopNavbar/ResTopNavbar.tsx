import React, { ReactNode } from "react";
import { NavMenu } from "../navbar.types";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
// Other imports...

interface ResTopNavbarProps {
  data: NavMenu;
  children?: ReactNode; // Allow passing a custom icon
}

const ResTopNavbar: React.FC<ResTopNavbarProps> = ({ children }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-1 focus:outline-none">
          {children || <span className="block w-6 h-px bg-black my-1.5"></span>}
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        {/* Rest of your mobile menu content */}
      </SheetContent>
    </Sheet>
  );
};

export default ResTopNavbar;