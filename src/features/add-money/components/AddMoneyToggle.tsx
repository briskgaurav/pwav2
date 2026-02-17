import React from 'react'

export default function AddMoneyToggle({ activeTab, setActiveTab }: { activeTab: 'cards' | 'account', setActiveTab: (tab: 'cards' | 'account') => void }) {

  return (
    <div className='flex items-center gap-2'>
       <div 
         className={`text-sm rounded-full px-4 py-3 w-full flex items-center justify-center cursor-pointer ${
           activeTab === 'cards' 
             ? 'border border-primary text-primary' 
             : 'border border-border text-text-primary'
         }`}
         onClick={() => setActiveTab('cards')}
       >
        <p>Add using Cards</p>
       </div>
       <div 
         className={`text-sm rounded-full px-4 py-3 w-full flex items-center justify-center cursor-pointer ${
           activeTab === 'account' 
             ? 'border border-primary text-primary' 
             : 'border border-border text-text-primary'
         }`}
         onClick={() => setActiveTab('account')}
       >
        <p>Add using Account</p>
       </div>
    </div>
  )
}
