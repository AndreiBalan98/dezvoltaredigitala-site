// The one card style: white, thin line, rounded, soft shadow.
export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card ${className}`.trim()}>{children}</div>;
}
