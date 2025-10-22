import { cn } from "@/lib/utils"
import { DEFAULT_NAVIGATION_CONFIG } from "./constants"
import { useScrollEffect } from "./hooks/useScrollEffect"
import Logo from "./Logo"
import DesktopNavigation from "./DesktopNavigation"
import MobileNavigation from "./MobileNavigation"

export default function Navbar({
  logo = DEFAULT_NAVIGATION_CONFIG.logo,
  name = DEFAULT_NAVIGATION_CONFIG.name,
  homeUrl = DEFAULT_NAVIGATION_CONFIG.homeUrl,
  links = DEFAULT_NAVIGATION_CONFIG.links,
  actions = DEFAULT_NAVIGATION_CONFIG.actions,
}) {
  const isScrolled = useScrollEffect()

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">
        <Logo logo={logo} name={name} homeUrl={homeUrl} />
        <DesktopNavigation links={links} actions={actions} />
        <MobileNavigation 
          name={name} 
          homeUrl={homeUrl} 
          links={links} 
          actions={actions} 
        />
      </div>
    </header>
  )
}