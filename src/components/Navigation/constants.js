export const DEFAULT_NAVIGATION_LINKS = [
  { text: "Shop", href: "/" },
  { text: "Men", href: "/men" },
  { text: "Women", href: "/women" },
  { text: "Kids", href: "/kids" },
]

export const DEFAULT_ACTIONS = [
  { text: "Login", href: "/v1/login", isButton: false },
  { text: "Sign up", href: "/v1/register", isButton: true },
]

export const DEFAULT_NAVIGATION_CONFIG = {
  logo: "https://www.launchuicomponents.com/favicon.svg",
  name: "ShopEase",
  homeUrl: "/",
  links: DEFAULT_NAVIGATION_LINKS,
  actions: DEFAULT_ACTIONS,
}
