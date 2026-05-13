"use client";

import { CardMockup, Checkbox } from "@/components/ui";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { LinkLinkVirtualCardSteps } from "@/types/cardsLinkingSteps";
import CardPinVerificationDrawer from "../AuthScreens/CardPinVerificationDrawer";
import { useAppDispatch, useAppSelector } from "@/store/redux/hooks";
import { fetchAllCards, selectVirtualCards } from "@/store/redux/slices/cardDataWalletSlice";
import { useEffect } from "react";
import { selectVc, verifyVcPin } from "@/lib/api/cardLinkApi";
import { setCardLinkingData, selectCardLinkingData } from "@/store/redux/slices/cardLinkingSlice";
import { showToast } from "@/store/redux/slices/toasterSlice";
import { selectUniversalCards } from "@/store/redux/slices/cardDataWalletSlice";
import { universalCardStableId, virtualCardMaskedDisplay } from "@/lib/api/cards";

interface Props {
    handleNext: (step: LinkLinkVirtualCardSteps) => void;
}

export default function VirtualCardSelections({ handleNext }: Props) {
    const dispatch = useAppDispatch();
    const virtualCards = useAppSelector(selectVirtualCards);
    const universalCards = useAppSelector(selectUniversalCards);
    const cardLinkingData = useAppSelector(selectCardLinkingData);
    const managingCardId = useAppSelector((s) => s.cardWallet.managingCardId);

    useEffect(() => {
        dispatch(fetchAllCards());
    }, [dispatch]);

    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [consentChecked, setConsentChecked] = useState(false);
    const [pinDrawOpen, setPinDrawOpen] = useState(false);
    const [selecting, setSelecting] = useState(false);

    const unlinkedVirtualCards = virtualCards;
    const linkedVirtualCards: typeof virtualCards = [];
    const isAvailableForLinking = unlinkedVirtualCards.length > 0;

    const sessionRequestId =
        cardLinkingData.response?.requestId ??
        (managingCardId
            ? universalCards.find((c) => universalCardStableId(c) === managingCardId)?.requestId
            : undefined);

    const handleNextClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!selectedCard || !consentChecked || selecting) return;

        if (!sessionRequestId) {
            dispatch(showToast({
                message: 'Something went wrong',
                subtitle: 'Missing link session. Go back and try again.',
                duration: 3000,
                tosterType: 'error',
            }));
            return;
        }

        setSelecting(true);
        try {
            const res = await selectVc(sessionRequestId, selectedCard);
            dispatch(setCardLinkingData({ response: res }));
            setPinDrawOpen(true);
        } catch (err: any) {
            console.error("Failed to select VC:", err);
            dispatch(showToast({
                message: 'Selection failed',
                subtitle: err?.errorMessage || 'Could not select virtual card. Please try again.',
                duration: 3000,
                tosterType: 'error',
            }));
        } finally {
            setSelecting(false);
        }
    };

    const handleVerifyVcPin = (PIN: string) => {
        const selectedCardObj = virtualCards.find(c => c.cardId === selectedCard);
        return selectedCardObj?.defaultPin === PIN;
    };

    const pinVerifySuccess = async (pin: string) => {
        if (!selectedCard || !sessionRequestId) return;
        try {
            const res = await verifyVcPin(sessionRequestId, pin, selectedCard);
            dispatch(setCardLinkingData({ response: res }));
            setPinDrawOpen(false);
            handleNext("linking_success");
        } catch (err: any) {
            console.error("Failed to verify VC PIN:", err);
            dispatch(showToast({
                message: 'PIN verification failed',
                subtitle: err?.errorMessage || 'Incorrect PIN. Please try again.',
                duration: 3000,
                tosterType: 'error',
            }));
        }
    };

    return (
        <>
            <div className="flex-1 min-h-[65vh] flex-col flex justify-start items-center overflow-auto pt-10 space-y-4 p-6">
                <>
                    <p className="font-medium text-sm">
                        {isAvailableForLinking
                            ? "Link this Universal Instacard to a Virtual Instacard"
                            : "No virtual cards available, Please add a virtual card first!"}
                    </p>
                    <div className="-mt-5">
                        <CardMockup
                            imageSrc={"/img/cards/Universal1.png"}
                            isclickable={false}
                            showActions={false}
                            showNumber={false}
                        />
                    </div>

                    {isAvailableForLinking && (
                        <>
                            <p className="mt-4 text-sm">
                                You have following Virtual Instacard available for linking to
                                this Universal Card issued by <strong>FCMB.</strong>
                            </p>
                            <p className="text-sm text-left w-full">
                                Select the one you want to link to this Instacard
                            </p>

                            <div className="flex flex-col items-start justify-start w-full mt-4 space-y-3">
                                {/* Unlinked Virtual Cards */}
                                {unlinkedVirtualCards.length > 0 && (
                                    <>
                                        <p className="text-xs text-text-secondary font-medium">
                                            Available Virtual Cards
                                        </p>
                                        {unlinkedVirtualCards.map((card) => (
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
                                                    {virtualCardMaskedDisplay(card)} ( Virtual Card )
                                                </span>
                                            </button>
                                        ))}
                                    </>
                                )}

                                {/* Linked Virtual Cards */}
                                {linkedVirtualCards.length > 0 && (
                                    <>
                                        <div className="mb-6 w-full space-y-4">
                                            <p className="text-xs text-text-secondary font-medium mt-4">
                                                Already Linked Virtual Cards
                                            </p>
                                            {linkedVirtualCards.map((card) => (
                                                <button
                                                    key={card.cardId}
                                                    disabled
                                                    className="w-full p-4 border rounded-2xl flex items-center gap-3 transition-all border-text-primary/10 opacity-50"
                                                >
                                                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-text-primary/20" />
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-sm text-text-primary">
                                                            {virtualCardMaskedDisplay(card)} ( Virtual Card )
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

                                {unlinkedVirtualCards.length > 0 && (
                                    <Checkbox
                                        checked={consentChecked}
                                        onChange={(checked) => setConsentChecked(checked)}
                                        label={`I consent to link this Virtual Instacard to my Universal Instacard I have selected above`}
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
                    className={`bg-primary p-4 text-center text-[#fff] flex items-center justify-center rounded-full w-full ${!selectedCard || !consentChecked || selecting ? "opacity-50" : ""
                        }`}
                >
                    {selecting ? "Selecting..." : "Next"}
                </Link>
                <Link
                    href={routes.addInstacard}
                    className={`border-primary border p-4 gap-2 text-center text-text-primary flex items-center justify-center rounded-full w-full `}
                >
                    <PlusIcon /> <p>Add New Virtual Instacard</p>
                </Link>
            </div>

            <CardPinVerificationDrawer
                visible={pinDrawOpen}
                // title="Enter 4 Digit Card Pin"
                subtitle="Enter your PIN to continue"
                showTitle={false}
                onClose={() => setPinDrawOpen(false)}
                verifyPin={handleVerifyVcPin}
                onVerified={pinVerifySuccess}
                fieldLength={4}
            />
        </>
    );
}
