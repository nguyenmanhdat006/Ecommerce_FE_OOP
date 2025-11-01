import { Link } from "react-router-dom";

export function NavLinkItem({ href, text, isActive, variant = "desktop" }) {
  const isDesktop = variant === "desktop"

  return (
    <Link
      to={href}
      className={`transition-colors ${
        isDesktop ? "relative group" : ""
      } ${
        isActive 
          ? "text-foreground font-semibold" 
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {text}
      {isDesktop && (
        <span
          className={`absolute left-0 bottom-[-6px] h-[3px] rounded-full transition-all duration-300 ${
            isActive 
              ? "w-full bg-primary" 
              : "w-0 bg-primary group-hover:w-full"
          }`}
        />
      )}
    </Link>
  );
}