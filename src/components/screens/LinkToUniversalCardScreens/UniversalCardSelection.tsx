"use client";

import { CardMockup, Checkbox } from "@/components/ui";
import { PlusIcon } from "lucide-react";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { LinkLinkVirtualCardSteps } from "@/types/cardsLinkingSteps";
import CardPinVerificationDrawer from "../AuthScreens/CardPinVerificationDrawer";
import { useAppDispatch, useAppSelector } from "@/store/redux/hooks";
import { fetchAllCards, selectUniversalCards } from "@/store/redux/slices/cardDataWalletSlice";
import { useEffect } from "react";
import { selectUc, verifyUcPin, getCardLinkErrorDetails } from "@/lib/api/cardLinkApi";
import { universalCardStableId } from "@/lib/api/cards";
import { setCardLinkingData, selectCardLinkingData } from "@/store/redux/slices/cardLinkingSlice";
import { showToast } from "@/store/redux/slices/toasterSlice";

interface Props {
    handleNext: (step: LinkLinkVirtualCardSteps) => void;
}

export default function UniversalCardSelection({ handleNext }: Props) {
    const dispatch = useAppDispatch();
    const universalCards = useAppSelector(selectUniversalCards);
    const cardLinkingData = useAppSelector(selectCardLinkingData);

    useEffect(() => {
        dispatch(fetchAllCards());
    }, [dispatch]);

    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [consentChecked, setConsentChecked] = useState(false);
    const [pinDrawOpen, setPinDrawOpen] = useState(false);
    const [selecting, setSelecting] = useState(false);
    const [pinVerifying, setPinVerifying] = useState(false);

    const unlinkedUniversalCards = universalCards;
    const linkedUniversalCards: typeof universalCards = [];
    const isAvailableForLinking = unlinkedUniversalCards.length > 0;

    const [selectedUcCardId, setSelectedUcCardId] = useState<string | null>(null);
    const pinFailedRef = useRef(false);

    const sessionRequestId = cardLinkingData.response?.requestId;

    const handleNextClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!selectedCard || !consentChecked || selecting) {
            dispatch(showToast({
                message: "Select a Universal Card and check the consent box to continue",
                subtitle: !selectedCard
                    ? "Please select a Universal Card"
                    : !consentChecked
                    ? "Please provide your consent"
                    : "",
                duration: 3000,
                tosterType: "error"
            }));
            return;
        }

        const row = universalCards.find(c => universalCardStableId(c) === selectedCard);
        if (!sessionRequestId || !row?.ucCardId) {
            dispatch(showToast({
                message: 'Something went wrong',
                subtitle: 'Missing link session or could not select virtual card. Go back and try again.',
                duration: 3000,
                tosterType: 'error',
            }));
            return;
        }

        setSelecting(true);
        try {
            const res = await selectUc(sessionRequestId, row.ucCardId);
            console.log("[UniversalCardSelection] selectUc response:", res);
            dispatch(setCardLinkingData({ response: res }));
            setPinDrawOpen(true);
            setSelectedUcCardId(row.ucCardId); // Store for PIN verification step
        } catch (err: any) {
            console.error("[UniversalCardSelection] Failed to select UC:", err);
            dispatch(showToast({
                message: 'Selection failed',
                subtitle: err?.errorMessage || 'Could not select universal card. Please try again.',
                duration: 3000,
                tosterType: 'error',
            }));
        } finally {
            setSelecting(false);
        }
    };

    // Updated - run the API verifyUcPin and return boolean for CardPinVerificationDrawer
    const handleVerifyUcPin = (PIN: string): boolean => {
        // This will "optimistically" always return true
        // Real verification and error handling is performed in pinVerifySuccess below
        return true;
    };

    // We need to make sure Drawer does NOT keep opening repeatedly after a failed PIN attempt,
    // but lets the user try only when they explicitly try again.

    // Once a PIN fails, close the drawer and let the toast tell the user;
    // If they want to retry, they must click Next again.
    const pinVerifySuccess = async (pin: string) => {
        if (!selectedCard || !sessionRequestId || !selectedUcCardId) {
            dispatch(showToast({
                message: 'Something went wrong',
                subtitle: 'No card or session selected',
                duration: 3000,
                tosterType: 'error'
            }));
            setPinDrawOpen(false);
            return;
        }
        try {
            setPinVerifying(true);
            const res = await verifyUcPin(sessionRequestId, pin, undefined, selectedUcCardId);
            console.log("[UniversalCardSelection] verifyUcPin response:", res);
            dispatch(setCardLinkingData({ response: res }));
            setPinDrawOpen(false);
            handleNext("linking_success");
        } catch (err: unknown) {
            console.error("[UniversalCardSelection] Failed to verify UC PIN:", err);
            const { errorCode, errorMessage: linkErrMsg } =
                getCardLinkErrorDetails(err);
            if (errorCode === 'LINK_ALREADY_EXISTS') {
                dispatch(showToast({
                    message: 'Already linked',
                    subtitle: linkErrMsg ?? 'This Virtual Card is already linked to that Universal Card.',
                    duration: 5000,
                    tosterType: 'error',
                }));
                setPinDrawOpen(false);
                return;
            }
            dispatch(showToast({
                message: 'PIN verification failed',
                subtitle: linkErrMsg || 'Incorrect PIN. Please try again.',
                duration: 3000,
                tosterType: 'error',
            }));
            // Don't reopen the drawer automatically, only close (user must try again themselves)
            setPinDrawOpen(false);
        } finally {
            setPinVerifying(false);
        }
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
                                {/* Unlinked Universal Cards */}
                                {unlinkedUniversalCards.length > 0 && (
                                    <>
                                        <p className="text-xs text-text-secondary font-medium">
                                            Available Universal Cards
                                        </p>
                                        {unlinkedUniversalCards.map((card) => (
                                            <button
                                                key={universalCardStableId(card)}
                                                onClick={() => {
                                                    setSelectedCard(universalCardStableId(card));
                                                    setSelectedUcCardId(card.ucCardId ?? null);
                                                }}
                                                className={`w-full p-4 border rounded-2xl flex items-center gap-3 transition-all ${selectedCard === universalCardStableId(card)
                                                    ? "border-text-primary/40 border-2"
                                                    : "border-text-primary/20"
                                                    }`}
                                            >
                                                <div
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCard === universalCardStableId(card)
                                                        ? "border-orange bg-orange"
                                                        : "border-text-primary/40"
                                                        }`}
                                                >
                                                    {selectedCard === universalCardStableId(card) && (
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
                                                    {card.ucPanMasked ?? card.maskedCardNumber} ( Universal Card )
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
                                                    key={universalCardStableId(card)}
                                                    disabled
                                                    className="w-full p-4 border rounded-2xl flex items-center gap-3 transition-all border-text-primary/10 opacity-50"
                                                >
                                                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-text-primary/20" />
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-sm text-text-primary">
                                                            {card.ucPanMasked ?? card.maskedCardNumber} ( Universal Card )
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
                    className={`bg-primary p-4 text-center text-[#fff] flex items-center justify-center rounded-full w-full ${!selectedCard || !consentChecked || selecting ? "opacity-50" : ""
                        }`}
                >
                    {selecting ? "Selecting..." : "Next"}
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
                verifyPin={handleVerifyUcPin}
                onVerified={pinVerifySuccess}
                fieldLength={4}
            />
        </>
    );
}
