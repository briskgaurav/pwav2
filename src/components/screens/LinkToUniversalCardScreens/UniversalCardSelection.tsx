"use client";

import { CardMockup, Checkbox } from "@/components/ui";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { LinkLinkVirtualCardSteps } from "@/types/cardsLinkingSteps";
import CardPinVerificationDrawer from "../AuthScreens/CardPinVerificationDrawer";
import { useAppDispatch, useAppSelector } from "@/store/redux/hooks";
import { fetchAllCards, selectCardsStatus, selectUniversalCards } from "@/store/redux/slices/cardDataWalletSlice";
import { useEffect } from "react";
import { initiateCardLink, verifyVcPin, verifyUcPin } from "@/lib/api/cardLinkApi";
import { setCardLinkingData, selectCardLinkingData } from "@/store/redux/slices/cardLinkingSlice";

interface Props {
    handleNext: (step: LinkLinkVirtualCardSteps) => void;
}

export default function UniversalCardSelection({ handleNext }: Props) {
    const dispatch = useAppDispatch();
    const universalCards = useAppSelector(selectUniversalCards);
    const cardsStatus = useAppSelector(selectCardsStatus);

    useEffect(() => {
        if (cardsStatus === 'idle') {
            dispatch(fetchAllCards());
        }
    }, [cardsStatus, dispatch]);

    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [consentChecked, setConsentChecked] = useState(false);
    const [pinDrawOpen, setPinDrawOpen] = useState(false);


    // Treat all fetched universal cards as unlinked for now
    const unlinkedUniversalCards = universalCards;
    const linkedUniversalCards: typeof universalCards = [];

    const isAvailableForLinking = unlinkedUniversalCards.length > 0;
    const cardLinkingData = useAppSelector(selectCardLinkingData);

    const handleNextClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (selectedCard && consentChecked) {
            setPinDrawOpen(true);
        }
    };

    const HandleVerifyUCPin = (PIN: string) => {
        const selectedCardObj = universalCards.find(c => c.cardId === selectedCard);
        console.log(selectedCardObj)
        return selectedCardObj?.defaultPin === PIN;

        // CHECK VERIFY UC PIN API!
        // verifyUcPin
    }



    const pinVerifySuccess = async (pin: string) => {
        if (!selectedCard) return;
        try {
            // Using verifyUcPin with a mock requestId and passing vcCardId
            const res = await verifyUcPin("mock-request-id", pin, selectedCard);
            dispatch(setCardLinkingData({ response: res }));
            setPinDrawOpen(false);
            // handleNext("linking_success");
        } catch (error) {
            console.error("Failed to verify UC PIN:", error);
        }

        handleNext("linking_success");

    };

    return (
        <>
            <div className="flex-1 min-h-[65vh] flex-col flex justify-start items-center overflow-auto pt-10 space-y-4 p-6">
                <>
                    <p className="font-medium text-sm">
                        {isAvailableForLinking
                            ? "Link this Virtual Instacard to a Universal Instacard"
                            : "No Universal Instacards available, Please add a Universal Instacard first!"}
                    </p>
                    <div className="-mt-5">
                        <CardMockup
                            imageSrc={"/img/cards/debit.png"}
                            isclickable={false}
                            showActions={false}
                            showNumber={false}
                        />
                    </div>

                    {isAvailableForLinking && (
                        <>
                            <p className="mt-4 text-sm">
                                You have following Universal Instacard available for linking to
                                this Virtual Card issued by <strong>FCMB.</strong>
                            </p>
                            <p className="text-sm text-left w-full">
                                Select the one you want to link to this Instacard
                            </p>

                            <div className="flex flex-col items-start justify-start w-full mt-4 space-y-3">
                                {/* Unlinked Virtual Cards */}
                                {unlinkedUniversalCards.length > 0 && (
                                    <>
                                        <p className="text-xs text-text-secondary font-medium">
                                            Available Universal Cards
                                        </p>
                                        {unlinkedUniversalCards.map((card) => (
                                            <button
                                                key={card.cardId}
                                                onClick={() => setSelectedCard(card.cardId)}
                                                className={`w-full p-4 border rounded-2xl flex items-center gap-3 transition-all ${selectedCard === card.cardId
                                                    ? "border-text-primary/40 border-2"
                                                    : "border-text-primary/20"
                                                    }`}
                                            >
                                                <div
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCard === card.cardId
                                                        ? "border-orange bg-orange"
                                                        : "border-text-primary/40"
                                                        }`}
                                                >
                                                    {selectedCard === card.cardId && (
                                                        <svg
                                                            className="w-3 h-3 text-white"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="text-sm text-text-primary">
                                                    {card.maskedCardNumber} ( Universal Card )
                                                </span>
                                            </button>
                                        ))}
                                    </>
                                )}

                                {/* Linked Virtual Cards */}
                                {linkedUniversalCards.length > 0 && (
                                    <>
                                        <div className="mb-6 w-full space-y-4">
                                            <p className="text-xs text-text-secondary font-medium mt-4">
                                                Already Linked Universal Cards
                                            </p>
                                            {linkedUniversalCards.map((card) => (
                                                <button
                                                    key={card.cardId}
                                                    disabled
                                                    className="w-full p-4 border rounded-2xl flex items-center gap-3 transition-all border-text-primary/10 opacity-50"
                                                >
                                                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-text-primary/20" />
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-sm text-text-primary">
                                                            {card.maskedCardNumber} ( Universal Card )
                                                        </span>
                                                        <span className="text-xs text-orange">
                                                            Already linked
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {unlinkedUniversalCards.length > 0 && (
                                    <Checkbox
                                        checked={consentChecked}
                                        onChange={(checked) => setConsentChecked(checked)}
                                        label={`I consent to link this Universal Instacard to my virtual Instacard I have selected above`}
                                    />
                                )}
                            </div>
                        </>
                    )}
                </>
            </div>

            <div className=" w-full p-4 space-y-2 pt-auto pb-[calc(env(safe-area-inset-bottom,24px)+24px)] shrink-0">
                <Link
                    href="#"
                    onClick={handleNextClick}
                    className={`bg-primary p-4 text-center text-[#fff] flex items-center justify-center rounded-full w-full ${!selectedCard || !consentChecked ? "opacity-50" : ""
                        }`}
                >
                    Next
                </Link>
                <Link
                    href={routes.addUniversalCard}
                    className={`border-primary border p-4 gap-2 text-center text-text-primary flex items-center justify-center rounded-full w-full `}
                >
                    <PlusIcon /> <p>Add New Universal Instacard</p>
                </Link>
            </div>

            <CardPinVerificationDrawer
                visible={pinDrawOpen}
                // title="Enter 4 Digit Card Pin"
                subtitle="Enter your PIN to continue"
                showTitle={false}
                onClose={() => setPinDrawOpen(false)}
                verifyPin={HandleVerifyUCPin}
                onVerified={pinVerifySuccess}
                fieldLength={4}
            />
        </>
    );
}
