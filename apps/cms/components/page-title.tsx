function PageTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col">
      <h1>{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default PageTitle;
