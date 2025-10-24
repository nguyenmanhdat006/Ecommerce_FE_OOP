import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link } from "react-router-dom"

export default function MobileNavigation({ name, homeUrl, links, actions, isActiveLink }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-10 w-10"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-background">
        <nav className="grid gap-6 text-lg font-semibold mt-6">
          <Link to={homeUrl} className="text-2xl font-bold">
            {name}
          </Link>
          {links.map((link, i) => {
            const isActive = isActiveLink(link.href)
            return (
              <Link
                key={i}
                to={link.href}
                className={`${
                  isActive 
                    ? "text-foreground font-semibold" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.text}
              </Link>
            )
          })}
          <div className="mt-6 grid gap-3">
            {actions.map((action, i) =>
              action.isButton ? (
                <Button key={i} variant="default" asChild>
                  <Link to={action.href}>{action.text}</Link>
                </Button>
              ) : (
                <Link
                  key={i}
                  to={action.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {action.text}
                </Link>
              )
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
