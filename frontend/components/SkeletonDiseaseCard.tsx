export function SkeletonDiseaseCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-km-border km-glass dark:border-km-green/20">
      <div className="km-skeleton h-40 sm:h-44" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="km-skeleton h-3 w-16 rounded" />
        <div className="km-skeleton h-5 w-3/4 rounded" />
        <div className="km-skeleton h-4 w-full rounded" />
        <div className="km-skeleton h-4 w-5/6 rounded" />
      </div>
    </div>
  );
}
