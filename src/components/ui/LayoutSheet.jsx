import PWAHeader from "@/components/PWAHeader";

/**
 * @param {{
 *   children: import('react').ReactNode,
 *   routeTitle: string,
 *   needPadding?: boolean,
 *   progressNode?: import('react').ReactNode,
 *   hideLayerSheet?: boolean
 * }} props
 */
export default function LayoutSheet(props) {
  const { children, routeTitle, needPadding = true, progressNode, hideLayerSheet = false } = props
  return (
    <>
      {!hideLayerSheet && <PWAHeader />}

      {!hideLayerSheet && (
        <div className="flex flex-col flex-1 bg-light-gray rounded-t-3xl overflow-hidden">

          <p className="text-center py-2">{routeTitle}</p>

          {/* THIS is the ONLY scroll container */}
          <div className={`flex-1 overflow-y-auto  bg-white rounded-t-3xl ${needPadding ? 'p-4' : ''}`}>
            {progressNode}

            {children}
          </div>
        </div>
      )}
      {hideLayerSheet && (
        <div className="flex flex-col bg-white flex-1  rounded-t-3xl overflow-hidden">
          {children}
        </div>
      )}
    </>
  )
}