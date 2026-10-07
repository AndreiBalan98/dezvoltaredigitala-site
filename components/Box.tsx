// The one highlighted box: light-blue tint, rounded, no line.
export default function Box({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`box ${className}`.trim()}>{children}</div>;
}
