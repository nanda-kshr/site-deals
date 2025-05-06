import { Truck } from "lucide-react";
import Link from "next/link";

          <div className="flex items-center gap-4">
            <Link href="/order" className="flex items-center gap-2 text-black hover:text-black/80 transition-colors">
              <Truck size={18} />
              <span className="font-medium">Track Order</span>
            </Link>
            {/* ... rest of the navbar items ... */}
          </div> 