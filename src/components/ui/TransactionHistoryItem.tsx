
import { TRANSACTION_HISTORY_DATA } from '@/store/TransactionHistory'
import React from 'react'

// Helper function to group transactions by month
function groupTransactionsByMonth(transactions: typeof TRANSACTION_HISTORY_DATA) {
  const groups: { [key: string]: typeof TRANSACTION_HISTORY_DATA } = {}
  
  transactions.forEach((transaction) => {
    // Extract month and year from date string (e.g., "Jan 01 , 2025 | 8:00 PM")
    const datePart = transaction.date.split('|')[0].trim()
    const monthYear = datePart.replace(/\d+\s*,?\s*/, '').trim() // Gets "Jan 2025" format
    
    if (!groups[monthYear]) {
      groups[monthYear] = []
    }
    groups[monthYear].push(transaction)
  })
  
  return Object.entries(groups).map(([label, transactions]) => ({
    label,
    transactions
  }))
}

export default function TransactionHistoryItem() {
  const groupedTransactions = groupTransactionsByMonth(TRANSACTION_HISTORY_DATA)
  
  return (
    <>
      {groupedTransactions.map((group, groupIndex) => (
        <div key={`${group.label}-${groupIndex}`} className='pt-3  pb-3 border-b border-text-primary/10'>
          <p className='text-xs text-text-secondary'>{group.label}</p>
          
          {group.transactions.map((transaction) => (
            <div key={transaction.id} className='flex items-center justify-between py-3'>
              <div className='flex items-center gap-3'>
                <div className={`w-10 h-10 ${transaction.color} rounded-lg flex items-center justify-center`}>
                  <span className='text-white font-semibold text-lg'>{transaction.initial}</span>
                </div>
                <div className='flex flex-col'>
                  <p className='text-sm font-medium text-text-primary'>{transaction.name}</p>
                  <p className='text-xs text-text-secondary'>{transaction.date}</p>
                </div>
              </div>
              <p className={`text-sm font-semibold ${transaction.type === 'credit' ? 'text-green-500' : 'text-error'}`}>{transaction.amount}</p>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
