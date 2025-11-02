import { Link } from "react-router-dom";
export default function Logo({ logo, name, homeUrl }) {
  return (
    <Link
      to={homeUrl}
      className="flex items-center gap-3 text-3xl font-extrabold tracking-tight"
    >
      <span>{logo}</span>
      <span className="text-primary">{name}</span>
    </Link>
  );
}
