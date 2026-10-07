// One page section: same width, side padding and vertical rhythm everywhere.
// `light` = the site's light background; `center` centres the eyebrow and title.
export default function Section({
  eyebrow,
  title,
  light = false,
  center = false,
  className = "",
  children,
}: {
  eyebrow?: string;
  title?: string;
  light?: boolean;
  center?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = ["section", light && "section--light", center && "section--center", className].filter(Boolean);
  return (
    <section className={classes.join(" ")}>
      <div className="container">
        {(eyebrow || title) && (
          <header className="section-head">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
