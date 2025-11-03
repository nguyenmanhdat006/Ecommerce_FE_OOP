import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ActionLink({ action, variant = "desktop" }) {
  const isMobile = variant === "mobile"

  if (action.isButton) {
    return (
      <Button 
        variant="default" 
        size={isMobile ? "default" : "lg"} 
        className={isMobile ? "" : "text-base px-6"} 
        asChild
      >
        <Link to={action.href}>{action.text}</Link>
      </Button>
    );
  }
  return (
    <Link
      to={action.href}
      className={isMobile 
        ? "text-muted-foreground hover:text-foreground" 
        : "text-base text-muted-foreground hover:text-foreground"
      }
    >
      {action.text}
    </Link>
  );
};
