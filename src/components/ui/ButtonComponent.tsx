import React from 'react'

export default function ButtonComponent({ title, onClick, disabled=false, isfixed=true , styleType='solid'}: { title: string, onClick: () => void, disabled?: boolean, isfixed?: boolean, styleType?: 'solid' | 'border'  }) {
  return (
    <button 
      className={` ${isfixed ? 'fixed bottom-[5vw] left-1/2 -translate-x-1/2' : ''}  w-[90%]  py-3 rounded-full font-medium ${disabled ? 'cursor-not-allowed bg-purple-600 text-white' : styleType === 'solid' ? 'bg-primary text-white' : 'border border-text-primary text-text-primary'}`} 
      onClick={disabled ? undefined : onClick} 
      disabled={disabled}
    >
      {title}
    </button>
  )
}
