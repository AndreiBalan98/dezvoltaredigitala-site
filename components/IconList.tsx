import type { IconName } from "@/lib/icons";
import Icon from "./Icon";

// A list where each line starts with an icon in a tinted badge (footer contact, article help box).
export default function IconList({
  items,
  className = "",
}: {
  items: { icon: IconName; content: React.ReactNode }[];
  className?: string;
}) {
  return (
    <ul className={`icon-list ${className}`.trim()}>
      {items.map(({ icon, content }, i) => (
        <li key={i}>
          <span className="icon-badge">
            <Icon name={icon} />
          </span>
          <span>{content}</span>
        </li>
      ))}
    </ul>
  );
}
