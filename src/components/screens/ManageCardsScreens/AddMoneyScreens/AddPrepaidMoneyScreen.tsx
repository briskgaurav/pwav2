'use client'

import { useCallback, useState } from 'react'

import { useRouter } from 'next/navigation'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui'
import { AddMoneyCardsSection, type CardType } from '@/components/ui/AddMoneyCardsSection'
import { AddMoneyForm } from '@/components/ui/AddMoneyForm'
import AddMoneyToggle from '@/components/ui/AddMoneyToggle'
import { AddNewCardForm } from '@/components/ui/AddNewCardForm'
import Balance from '@/components/ui/Balance'
import BottomSheetModal from '@/components/ui/BottomSheetModal'
import CardMockup from '@/components/ui/CardMockup'
import { Dropdown } from '@/components/ui/Dropdown'
import { useManagingCard } from '@/hooks/useManagingCard'
import { routes } from '@/lib/routes'
import { useAppSelector } from '@/store/redux/hooks'

import LayoutSheet from '../../../ui/LayoutSheet'

type ModalView = 'cards' | 'addCard'

type BankAccount = {
    id: string
    bank: string
    accountNumber: string
    accountName: string
}

const STATIC_BANK_ACCOUNTS = [
    { id: 'sigma', bank: 'Sigma Bank', accountNumber: '1234567890' },
    { id: 'gtb', bank: 'GTBank', accountNumber: '0987654321' },
    { id: 'access', bank: 'Access Bank', accountNumber: '5678901234' },
] as const

export default function AddPrepaidMoneyScreen() {
    const router = useRouter()
    const fullName = useAppSelector((s) => s.user.fullName)
    const bankAccounts: BankAccount[] = STATIC_BANK_ACCOUNTS.map((b) => ({ ...b, accountName: fullName }))
    const { imageSrc, maskedNumber } = useManagingCard()
    const [showBalance, setShowBalance] = useState(false)
    const [amount, setAmount] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedCard, setSelectedCard] = useState<CardType>('sigma')
    const [modalView, setModalView] = useState<ModalView>('cards')
    const [activeTab, setActiveTab] = useState<'cards' | 'account'>('cards')
    const [selectedBank, setSelectedBank] = useState<BankAccount>(bankAccounts[0])


    const toggleBalance = useCallback(() => setShowBalance((p) => !p), [])
    const openModal = useCallback(() => {
        setModalView('cards')
        setModalOpen(true)
    }, [])
    const closeModal = useCallback(() => setModalOpen(false), [])

    const handleAmountChange = useCallback((value: string) => {
        setAmount(value)
    }, [])

    const handleSelectAmount = useCallback(
        (value: string) => {
            setAmount(value)
        },
        [],
    )
    const handleSelectCard = useCallback((id: CardType) => {
        setSelectedCard(id)
    }, [])

    const openAddCard = useCallback(() => {
        setModalView('addCard')
    }, [])

    const backToCards = useCallback(() => {
        setModalView('cards')
    }, [])

    const handleAddMoney = useCallback(() => {
        closeModal()
        router.push(routes.addMoneyVerifyEmail)
    }, [closeModal, router])

    const renderCardsContent = () => {
        if (modalView === 'cards') {
            return (
                <>
                    <AddMoneyCardsSection selectedCard={selectedCard} onSelectCard={handleSelectCard} />
                    <button
                        type='button'
                        onClick={openAddCard}
                        className='w-full flex items-center gap-2 text-primary text-sm font-medium'
                    >
                        <PlusIcon />
                        <span className='text-text-primary'>Add New Prepaid, Debit / Credit Card</span>
                    </button>
                </>
            )
        }
        return (
            <>
                <AddNewCardForm />
                <button
                    type='button'
                    onClick={backToCards}
                    className='text-primary w-full translate-y-2 text-center text-sm font-medium'
                >
                    Back
                </button>
            </>
        )
    }

    const renderAccountContent = () => {
        return (
            <div className='space-y-4'>
                <Dropdown<BankAccount>

                    label="Select Bank Account"
                    placeholder="Select bank..."
                    value={selectedBank}
                    options={bankAccounts}
                    onChange={setSelectedBank}
                    getOptionLabel={(bank) => bank.accountNumber}
                    marginTop='top-[-100%]'
                />

                <p className='text-text-primary/70 text-xs'>
                    Transfer to the account above and your wallet will be credited automatically.
                </p>
            </div>
        )
    }

    return (
        <LayoutSheet needPadding={false} routeTitle="Add Money">
            <div className="flex-1 overflow-auto pb-10 p-4 space-y-5">
                <CardMockup imageSrc={imageSrc} maskedNumber={maskedNumber} />
                <Balance />

                <AddMoneyForm
                    amount={amount}
                    onAmountChange={handleAmountChange}
                    onSelectRecommended={handleSelectAmount}
                    onOpenModal={openModal}

                />

            </div>
            <BottomSheetModal
                recommendedAmount={amount || '0'}
                visible={modalOpen}
                onClose={closeModal}
                title="Add Money"
            >
                <div className='space-y-4'>
                    <AddMoneyToggle activeTab={activeTab} setActiveTab={setActiveTab} />
                    {activeTab === 'cards' ?
                        <>
                            <div className='border border-border flex items-center justify-between rounded-2xl px-4 py-4'>
                                <p className='text-text-primary text-sm'>Convenience Fee *</p>
                                <p className='text-text-primary text-sm font-medium'>
                                    <span className='line-through mr-1'>N</span>100
                                </p>
                            </div>
                            <p className='text-text-primary text-xs'>
                                * 1% of the amount requested subject to maximum of N 2,000
                            </p>

                            {renderCardsContent()}
                        </>
                        : renderAccountContent()}
                </div>
                <div className='mt-5'>

                    <Button fullWidth className='bg-primary text-white' onClick={handleAddMoney}>Add <span className='line-through mx-1'>N</span> {amount}</Button>
                </div>
            </BottomSheetModal>

        </LayoutSheet>
    )
}
