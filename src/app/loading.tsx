/** Instant loading UI while the next route segment streams (App Router). */
export default function RootLoading() {
  return (
    <div
      className="flex min-h-dvh w-full flex-1 items-center justify-center bg-background"
      aria-busy
      aria-live="polite"
    >
      <div
        className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary border-t-transparent"
        role="status"
      />
    </div>
  )
}
