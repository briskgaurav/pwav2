import React from 'react'
import ButtonComponent from '../../../ui/ButtonComponent'

export default function IndentityCompleted({ getButtonText, handleContinue }: { getButtonText: () => string, handleContinue: () => void }) {
  return (
    <div>
      <ButtonComponent title={getButtonText()} onClick={handleContinue} />
    </div>
  )
}
