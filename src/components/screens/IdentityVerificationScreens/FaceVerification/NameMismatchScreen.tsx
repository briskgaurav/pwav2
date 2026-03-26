import React from 'react'
import { AlertTriangle, ArrowLeft, User } from 'lucide-react'
import ButtonComponent from '../../../ui/ButtonComponent'

type NameMismatchProps = {
  bankName: string
  ninBvnName: string
  handleGoBack: () => void
}

export default function NameMismatchScreen({ bankName, ninBvnName, handleGoBack }: NameMismatchProps) {
  return (
    <div className="h-full w-full flex flex-col items-center px-6 py-8 space-y-6">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-text-primary">Name Doesn&apos;t Match</h2>
        <p className="text-sm text-text-secondary">
          The name on your bank account does not match your NIN/BVN records.
          Please resolve this discrepancy before proceeding.
        </p>
      </div>

      <div className="w-full space-y-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Bank Account Name</p>
              <p className="text-sm font-medium text-text-primary">{bankName}</p>
            </div>
          </div>

          <div className="border-t border-red-200" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">NIN/BVN Name</p>
              <p className="text-sm font-medium text-text-primary">{ninBvnName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full space-y-2 pt-2">
        <p className="text-xs text-text-secondary text-center">
          Visit your bank or contact NIN/BVN support to update your records.
        </p>
      </div>

      <ButtonComponent
        title="Go Back to Start"
        onClick={handleGoBack}
        styleType="solid"
      />
    </div>
  )
}
