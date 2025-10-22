export const DEFAULT_NAVIGATION_LINKS = [
  { text: "Shop", href: "/" },
  { text: "Men", href: "/men" },
  { text: "Women", href: "/women" },
  { text: "Kids", href: "/kids" },
  { text: "Sale", href: "/sale" },
]

export const DEFAULT_ACTIONS = [
  { text: "Login", href: "/login", isButton: false },
  { text: "Sign up", href: "/register", isButton: true },
]

export const DEFAULT_NAVIGATION_CONFIG = {
  logo: "🛍️",
  name: "ShopEase",
  homeUrl: "/",
  links: DEFAULT_NAVIGATION_LINKS,
  actions: DEFAULT_ACTIONS,
}
