import React from 'react'

const limits = [
    { label: 'Approved Credit Limit', value: '1,000,000', highlight: false },
    { label: 'Available Limit', value: '275,000', highlight: false },
    { label: 'Total Outstanding', value: '625,000', highlight: false },
    { label: 'Unbilled Amount', value: '1000,000', highlight: false },
    { label: 'Payment Due Date', value: '16-Aug-2024', highlight: false, isDate: true },
    { label: 'Payment Status', value: 'Due In 2 Days', highlight: false, isDate: true },
]

export default function CreditDueBalance() {
    return (
        <div className='w-full flex border border-border rounded-2xl p-4 flex-col gap-3'>
            {/* Minimum Payment Due Section */}
            <div className='flex items-center w-full pl-2 justify-between'>
                <div className='w-[60%] space-y-2'>
                    <p className='text-text-secondary text-md'>Minimum Payment Due</p>
                    <p className='text-text-primary text-xl font-medium'>
                        <span className='line-through mr-1'>N</span>62,500.00
                    </p>
                </div>
                <div className='w-[40%]'>

                    {/* <Button fullWidth variant='primary' size='md'>
                        Pay Now
                    </Button> */}
                </div>
            </div>

            {/* Limits Grid */}
            <div className='grid grid-cols-2 gap-2'>
                {limits.map((item) => (
                    <div
                        key={item.label}
                        className={`p-4 py-5 rounded-2xl flex flex-col w-full text-center items-center gap-1 ${item.highlight
                                ? 'border-2 border-primary'
                                : 'border border-text-primary/20'
                            }`}
                    >
                        <p className='text-text-secondary text-xs w-full'>{item.label}</p>
                        <p className='text-text-primary '>
                            {!item.isDate && <span className='line-through mr-1'>N</span>}
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
