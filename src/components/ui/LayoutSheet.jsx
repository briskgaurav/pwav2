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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh', width: '100%' }}>
      {!hideLayerSheet && <PWAHeader />}

      {!hideLayerSheet && (
        <div
          className="flex flex-col flex-1 bg-light-gray rounded-t-3xl overflow-hidden"
          style={{
            backgroundColor: '#F5F5F5',
            flex: '1 1 0%',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <p className="text-center py-2" style={{ color: '#111111', flexShrink: 0 }}>{routeTitle}</p>

          {/* THIS is the ONLY scroll container */}
          <div
            className={`flex-1 overflow-y-auto bg-white rounded-t-3xl ${needPadding ? 'p-4' : ''}`}
            style={{
              backgroundColor: '#FFFFFF',
              flex: '1 1 0%',
              minHeight: 0,
              overflowY: 'auto'
            }}
          >
            {progressNode}
            {children}
          </div>
        </div>
      )}
      {hideLayerSheet && (
        <div
          className="flex flex-col bg-white flex-1 rounded-t-3xl overflow-hidden"
          style={{ backgroundColor: '#FFFFFF', flex: '1 1 0%' }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
