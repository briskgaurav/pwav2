import React from 'react'
import LayoutSheet from './LayoutSheet'

export default function SpinnerLoader() {
    return (
        <LayoutSheet needPadding={false} routeTitle='Liveness Verification' progressNode={null}>
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        </LayoutSheet>
    )
}
