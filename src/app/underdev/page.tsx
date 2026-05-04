import LayoutSheet from '@/components/ui/LayoutSheet'

export default function NotFound() {
  return (
    <LayoutSheet needPadding={false} routeTitle='Under Development'>
        <div className='flex-1 flex flex-col items-center justify-center p-6 min-h-full'>
          <div className='flex flex-col items-center text-center space-y-6'>
            <div className='w-32 h-32 flex items-center justify-center rounded-full bg-background2'>
              <span className='text-3xl font-bold text-primary'>🚧</span>
            </div>
            
            <div className='space-y-2'>
              <h2 className='text-2xl font-semibold text-text-primary'>Under Development</h2>
              <p className='text-text-primary/70 max-w-sm'>
                This page is currently under development. Please check back later.
              </p>
            </div>
            
          
          </div>
        </div>
    </LayoutSheet>
  )
}