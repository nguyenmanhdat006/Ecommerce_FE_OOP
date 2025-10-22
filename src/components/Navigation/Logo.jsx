export default function Logo({ logo, name, homeUrl }) {
  return (
    <a
      href={homeUrl}
      className="flex items-center gap-3 text-3xl font-extrabold tracking-tight"
    >
      <span>{logo}</span>
      <span className="text-primary">{name}</span>
    </a>
  )
}
