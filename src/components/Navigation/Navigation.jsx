import { cn } from "@/lib/utils"
import { DEFAULT_NAVIGATION_CONFIG } from "./constants"
import { useScrollEffect } from "./hooks/useScrollEffect"
import { useNavigationLinks, useNavigationActions } from "./hooks/useNavigationI18n"
import Logo from "./Logo"
import DesktopNavigation from "./Desktop/DesktopNavigation"
import MobileNavigation from "./Mobile/MobileNavigation"
import { useLocation } from "react-router-dom"

export default function Navbar({
  logo = DEFAULT_NAVIGATION_CONFIG.logo,
  name = DEFAULT_NAVIGATION_CONFIG.name,
  homeUrl = DEFAULT_NAVIGATION_CONFIG.homeUrl,
  links,
  actions,
}) {
  const isScrolled = useScrollEffect()
  const location = useLocation()
  
  // Use i18n hooks if links/actions not provided
  const i18nLinks = useNavigationLinks();
  const i18nActions = useNavigationActions();
  
  // Use provided links/actions or fallback to i18n versions
  const finalLinks = links || i18nLinks;
  const finalActions = actions || i18nActions;
  
  // Function to check if a link is active
  const isActiveLink = (href) => {
    if (href === "/" && location.pathname === "/") return true
    if (href !== "/" && location.pathname.startsWith(href)) return true
    return false
  }

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
        <DesktopNavigation links={finalLinks} actions={finalActions} isActiveLink={isActiveLink} />
        <MobileNavigation 
          name={name} 
          homeUrl={homeUrl} 
          links={finalLinks} 
          actions={finalActions}
          isActiveLink={isActiveLink}
        />
      </div>
    </header>
  )
}