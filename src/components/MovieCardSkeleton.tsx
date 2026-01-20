export default function MovieCardSkeleton() {
  return (
    <div className="h-[420px] bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* Poster skeleton */}
      <div className="relative h-[240px] flex-shrink-0 overflow-hidden">
        <div className="w-full h-full animate-skeleton" />
        
        {/* Rating badge skeleton */}
        <div className="absolute top-2 right-2 w-12 h-5 rounded animate-skeleton" />
        
        {/* Title area skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="h-4 w-3/4 rounded animate-skeleton mb-2" />
          <div className="h-3 w-1/2 rounded animate-skeleton" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="flex-1 p-3 flex flex-col">
        {/* Genre tags skeleton */}
        <div className="flex gap-1 mb-3">
          <div className="h-4 w-14 rounded animate-skeleton" />
          <div className="h-4 w-16 rounded animate-skeleton" />
          <div className="h-4 w-12 rounded animate-skeleton" />
        </div>
        
        {/* Plot skeleton */}
        <div className="space-y-2 flex-1">
          <div className="h-3 w-full rounded animate-skeleton" />
          <div className="h-3 w-full rounded animate-skeleton" />
          <div className="h-3 w-2/3 rounded animate-skeleton" />
        </div>
        
        {/* Director skeleton */}
        <div className="pt-2 mt-auto border-t border-white/10">
          <div className="h-3 w-1/2 rounded animate-skeleton" />
        </div>
      </div>
    </div>
  )
}
