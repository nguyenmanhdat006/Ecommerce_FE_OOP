import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}>
    <CheckboxPrimitive.Indicator className={cn("grid place-content-center text-current")}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
// "use client";

// import * as React from "react";
// import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
// import { cn } from "@/lib/utils";

// function Checkbox({ className, ...props }) {
//   return (
//     <CheckboxPrimitive.Root
//       data-slot="checkbox"
//       className={cn(
//         "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
//         className
//       )}
//       {...props}
//     >
//       <CheckboxPrimitive.Indicator
//         data-slot="checkbox-indicator"
//         className="flex items-center justify-center text-current transition-none"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="3"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="size-3.5"
//         >
//           <polyline points="20 6 9 17 4 12"></polyline>
//         </svg>
//       </CheckboxPrimitive.Indicator>
//     </CheckboxPrimitive.Root>
//   );
// }

// export { Checkbox };
