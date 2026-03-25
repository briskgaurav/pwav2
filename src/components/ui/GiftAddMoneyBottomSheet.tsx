'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import BottomSheetModal from '@/components/ui/BottomSheetModal';
import AddMoneyToggle from '@/components/ui/AddMoneyToggle';
import { AddMoneyCardsSection, CardType } from '@/components/ui/AddMoneyCardsSection';
import { AddNewCardForm } from '@/components/ui/AddNewCardForm';
import { ChevronDownIcon, CheckIcon, PlusIcon } from 'lucide-react';

type ModalView = 'cards' | 'addCard';

type BankAccount = {
  id: string;
  bank: string;
  accountNumber: string;
  accountName: string;
};

const bankAccounts: BankAccount[] = [
  { id: 'sigma', bank: 'Sigma Bank', accountNumber: '1234567890', accountName: 'John Doe' },
  { id: 'gtb', bank: 'GTBank', accountNumber: '0987654321', accountName: 'John Doe' },
  { id: 'access', bank: 'Access Bank', accountNumber: '5678901234', accountName: 'John Doe' },
];

type Props = {
  amount: string;
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function GiftAddMoneyBottomSheet({ amount, visible, onClose, onConfirm }: Props) {
  const [selectedCard, setSelectedCard] = useState<CardType>('sigma');
  const [modalView, setModalView] = useState<ModalView>('cards');
  const [activeTab, setActiveTab] = useState<'cards' | 'account'>('cards');
  const [selectedBank, setSelectedBank] = useState<BankAccount>(bankAccounts[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const renderCardsContent = () => {
    if (modalView === 'cards') {
      return (
        <>
          <AddMoneyCardsSection selectedCard={selectedCard} onSelectCard={setSelectedCard} />
          <button
            type="button"
            onClick={() => setModalView('addCard')}
            className="w-full flex items-center gap-2 text-primary text-sm font-medium"
          >
            <PlusIcon />
            <span className="text-text-primary">Add New Prepaid, Debit / Credit Card</span>
          </button>
        </>
      );
    }
    return (
      <>
        <AddNewCardForm />
        <button
          type="button"
          onClick={() => setModalView('cards')}
          className="text-primary w-full translate-y-2 text-center text-sm font-medium"
        >
          Back
        </button>
      </>
    );
  };

  const renderAccountContent = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <p className="text-text-primary text-sm font-medium">Select Bank Account</p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full border border-border rounded-2xl px-4 py-4 text-text-primary text-sm bg-transparent focus:outline-none focus:border-primary flex items-center justify-between transition-colors hover:border-primary/50"
            >
              <span className="font-medium">{selectedBank.accountNumber}</span>
              <ChevronDownIcon
                className={`w-5 h-5 text-text-primary/60 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute -top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl overflow-hidden shadow-lg z-10">
                {bankAccounts.map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => {
                      setSelectedBank(bank);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-4 text-left flex items-center justify-between hover:bg-primary/5 transition-colors ${
                      selectedBank.id === bank.id ? 'bg-primary/10' : ''
                    }`}
                  >
                    <span className="text-text-primary text-sm font-medium">{bank.accountNumber}</span>
                    {selectedBank.id === bank.id && <CheckIcon className="w-5 h-5 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-text-primary/70 text-xs">
          Transfer to the account above and your wallet will be credited automatically.
        </p>
      </div>
    );
  };

  return (
    <BottomSheetModal
      recommendedAmount={amount || '0'}
      visible={visible}
      onClose={onClose}
      title="Add Money"
    >
      <div className="space-y-4">
        <AddMoneyToggle activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'cards' ? (
          <>
            <div className="border border-border flex items-center justify-between rounded-2xl px-4 py-4">
              <p className="text-text-primary text-sm">Convenience Fee *</p>
              <p className="text-text-primary text-sm font-medium">
                <span className="line-through mr-1">N</span>100
              </p>
            </div>
            <p className="text-text-primary text-xs">
              * 1% of the amount requested subject to maximum of N 2,000
            </p>

            {renderCardsContent()}
          </>
        ) : (
          renderAccountContent()
        )}
      </div>
      <div className="mt-5">
        <Button
          fullWidth
          className="bg-primary text-white"
          onClick={() => {
            onClose();
            onConfirm();
          }}
        >
          Add <span className="line-through mx-1">N</span> {amount}
        </Button>
      </div>
    </BottomSheetModal>
  );
}

