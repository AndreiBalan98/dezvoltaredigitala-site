// The page title of every inner page (spec 004): the one <h1>, centred, same spacing everywhere.
export default function PageHead({ title }: { title: string }) {
  return (
    <header className="page-head container">
      <h1 className="page-title">{title}</h1>
    </header>
  );
}
