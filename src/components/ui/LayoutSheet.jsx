import PWAHeader from "@/components/PWAHeader";

export default function LayoutSheet({ children, routeTitle, needPadding = true }) {
  return (
    <>
      <PWAHeader />

      <div className="flex flex-col flex-1 bg-light-gray rounded-t-3xl overflow-hidden">

        <p className="text-center py-2">{routeTitle}</p>

        {/* THIS is the ONLY scroll container */}
        <div className={`flex-1 overflow-y-auto  bg-white rounded-t-3xl ${needPadding ? 'p-4' : ''}`}>
          {children}
        </div>
      </div>
    </>
  )
}