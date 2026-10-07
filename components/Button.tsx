import Link from "next/link";
import Icon from "./Icon";

// The one button style. Internal paths use <Link>; anything else is a plain <a>.
export default function Button({
  href,
  children,
  arrow = false,
}: {
  href: string;
  children: React.ReactNode;
  arrow?: boolean;
}) {
  const content = (
    <>
      <span>{children}</span>
      {arrow && <Icon name="arrow-right" />}
    </>
  );
  return href.startsWith("/") ? (
    <Link className="btn" href={href}>
      {content}
    </Link>
  ) : (
    <a className="btn" href={href}>
      {content}
    </a>
  );
}
