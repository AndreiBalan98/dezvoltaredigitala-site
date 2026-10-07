import { ICONS, type IconName } from "@/lib/icons";

export default function Icon({ name, className = "icon" }: { name: IconName; className?: string }) {
  const { body, fill } = ICONS[name];
  const paint = fill
    ? { fill: "currentColor" }
    : { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...paint}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
