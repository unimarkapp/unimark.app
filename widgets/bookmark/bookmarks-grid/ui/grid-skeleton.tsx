export function BookmarkGridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 16 }, (_, i) => i).map((i) => (
        <li key={i}>
          <div className="min-h-[370px] animate-pulse rounded-xl bg-muted"></div>
        </li>
      ))}
    </ul>
  );
}
