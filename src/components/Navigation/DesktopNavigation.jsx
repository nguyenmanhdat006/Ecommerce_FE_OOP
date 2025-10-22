import { Heart, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DesktopNavigation({ links, actions, isActiveLink }) {
  return (
    <>
      {/* Navigation - desktop */}
      <nav className="hidden md:flex gap-10 text-lg font-medium text-muted-foreground">
        {links.map((link, i) => {
          const isActive = isActiveLink(link.href)
          return (
            <a
              key={i}
              href={link.href}
              className={`relative group transition-colors ${
                isActive 
                  ? "text-foreground font-semibold" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.text}
              <span className={`absolute left-0 bottom-[-6px] h-[3px] rounded-full transition-all duration-300 ${
                isActive 
                  ? "w-full bg-primary" 
                  : "w-0 bg-primary group-hover:w-full"
              }`} />
            </a>
          )
        })}
      </nav>

      {/* Actions */}
      <div className="hidden md:flex items-center gap-5">
        <Button variant="ghost" size="icon" className="h-11 w-11">
          <Heart size={22} />
        </Button>
        <Button variant="ghost" size="icon" className="h-11 w-11">
          <User size={22} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-11 w-11"
        >
          <ShoppingCart size={22} />
          <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full text-[11px] w-5 h-5 flex items-center justify-center">
            2
          </span>
        </Button>

        {actions.map((action, i) =>
          action.isButton ? (
            <Button
              key={i}
              variant="default"
              size="lg"
              className="text-base px-6"
              asChild
            >
              <a href={action.href}>{action.text}</a>
            </Button>
          ) : (
            <a
              key={i}
              href={action.href}
              className="text-base text-muted-foreground hover:text-foreground"
            >
              {action.text}
            </a>
          )
        )}
      </div>
    </>
  )
}
