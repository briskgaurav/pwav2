'use client';

import React, { useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { SheetContainer } from '@/components/ui';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const FAQ_DATA: FAQItem[] = [
    {
        id: '1',
        question: 'How do I add a new card?',
        answer: 'To add a new card, tap the "+" button on the cards screen. You can then choose to add a virtual or physical card by following the on-screen instructions.',
    },
    {
        id: '2',
        question: 'How do I view my card details?',
        answer: 'Tap on any card in your wallet to view its details. You can see the card number, expiry date, and CVV by authenticating with your biometrics or PIN.',
    },
    {
        id: '3',
        question: 'Is my card information secure?',
        answer: 'Yes, all your card information is encrypted and stored securely. We use industry-standard encryption and never store your full card details on our servers.',
    },
    {
        id: '4',
        question: 'How do I make a payment?',
        answer: 'You can make payments by selecting a card and tapping the "Pay" button. You can also use QR code scanning for quick payments at supported merchants.',
    },
    {
        id: '5',
        question: 'How do I contact support?',
        answer: 'You can reach our support team by emailing support@instacard.com or calling our 24/7 helpline at 1-800-INSTACARD.',
    },
];

interface FAQRowProps {
    item: FAQItem;
    isExpanded: boolean;
    onToggle: () => void;
}

function FAQRow({ item, isExpanded, onToggle }: FAQRowProps) {
    return (
        <div className="rounded-xl mb-3 overflow-hidden border border-border bg-card-background">
            <button
                type="button"
                className="flex flex-row items-center w-full py-4 px-5 gap-3.5"
                onClick={onToggle}
                aria-expanded={isExpanded}
                aria-label={item.question}
            >
                <span className="flex-1 text-sm font-medium text-text-primary text-left">
                    {item.question}
                </span>
                <div
                    className={`transition-transform duration-300 ease-in-out ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                    }`}
                >
                    <ChevronDown size={18} className="text-text-secondary" />
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-4 pt-2 pb-4">
                    <p className="text-sm leading-5 text-text-secondary">
                        {item.answer}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function HelpAndSupportScreen() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="flex flex-col h-screen bg-primary">
            <SheetContainer>
                <div className="flex-1 overflow-auto py-5 px-5">
                    <h2 className="text-base font-medium ml-2 my-6 text-text-primary">
                        Help Topics
                    </h2>
                    {FAQ_DATA.map((item) => (
                        <FAQRow
                            key={item.id}
                            item={item}
                            isExpanded={expandedId === item.id}
                            onToggle={() => handleToggle(item.id)}
                        />
                    ))}
                </div>
            </SheetContainer>
        </div>
    );
}
