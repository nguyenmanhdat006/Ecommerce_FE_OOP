import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

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
          <a href={homeUrl} className="text-2xl font-bold">
            {name}
          </a>
          {links.map((link, i) => {
            const isActive = isActiveLink(link.href)
            return (
              <a
                key={i}
                href={link.href}
                className={`${
                  isActive 
                    ? "text-foreground font-semibold" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.text}
              </a>
            )
          })}
          <div className="mt-6 grid gap-3">
            {actions.map((action, i) =>
              action.isButton ? (
                <Button key={i} variant="default" asChild>
                  <a href={action.href}>{action.text}</a>
                </Button>
              ) : (
                <a
                  key={i}
                  href={action.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {action.text}
                </a>
              )
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
