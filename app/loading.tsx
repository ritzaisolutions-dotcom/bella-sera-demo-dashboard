import Logo from '@/components/Logo'

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`bg-brand-surface rounded animate-pulse ${className ?? ''}`}
    />
  )
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="border-b border-brand-border bg-brand-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size={32} />
          <div className="flex items-center gap-6">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      </header>

      {/* Page title */}
      <div className="border-b border-brand-border bg-brand-surface/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-2">
          <Skeleton className="h-2.5 w-28" />
          <Skeleton className="h-7 w-44" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats bar skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-brand-surface border border-brand-border rounded-xl px-6 py-5 space-y-3 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-20" />
              <Skeleton className="h-2.5 w-32" />
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-2 w-20" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-10" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-44" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-brand-gold via-brand-gold/40 to-transparent opacity-30" />
          <div className="hidden sm:block rounded-xl border border-brand-border overflow-hidden">
            {/* Table header */}
            <div className="bg-brand-surface border-b border-brand-border px-4 py-3 flex gap-6">
              {[80, 60, 100, 140, 100, 50, 160, 80, 70].map((w, i) => (
                <Skeleton key={i} className="h-2.5" style={{ width: w }} />
              ))}
            </div>
            {/* Table rows */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="px-4 py-3.5 flex gap-6 border-b border-brand-border last:border-0"
                style={{ opacity: 1 - i * 0.1 }}
              >
                {[80, 60, 100, 140, 100, 50, 160, 80, 70].map((w, j) => (
                  <Skeleton key={j} className="h-3" style={{ width: w }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
