'use client';

import { useState, useEffect, useRef } from 'react';
import { SheetContainer, Button, OTPKeypad, OtpInput } from '@/components/ui';
import { notifyNavigation, notifyUserCancelled } from '@/lib/bridge';
import gsap from 'gsap';
import { routes } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/redux/hooks';

const MAX_CODE_LENGTH = 6;

export default function VerifyEmailScreen() {
    const router = useRouter();
    const maskedEmail = useAppSelector((s) => s.user.maskedEmail);
    const [code, setCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const popupOverlayRef = useRef<HTMLDivElement>(null);
    const popupContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        notifyNavigation('verify-email');
    }, []);

    useEffect(() => {
        if (showSuccessPopup) {
            // Animate in
            gsap.fromTo(
                popupOverlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power2.out' }
            );
            gsap.fromTo(
                popupContentRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.1 }
            );
        }
    }, [showSuccessPopup]);

    const handleContinue = async () => {
        setIsVerifying(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsVerifying(false);
        setShowSuccessPopup(true);
    };

    const handleResend = () => {
        setCode('');
        // TODO: Implement resend OTP API call
    };

    const handleKeypadKey = (key: string) => {
        if (key === 'del') {
            setCode((prev) => prev.slice(0, -1));
            return;
        }

        if (!/^\d$/.test(key)) return;
        setCode((prev) => (prev.length < MAX_CODE_LENGTH ? prev + key : prev));
    };

    const handlePopupOk = () => {
        // Animate out
        gsap.to(popupContentRef.current, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in',
        });
        gsap.to(popupOverlayRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            delay: 0.1,
            onComplete: () => {
                setShowSuccessPopup(false);
                router.push(routes.instacard);
                notifyUserCancelled()
            },
        });
    };

    const isCodeComplete = code.length === MAX_CODE_LENGTH;

    return (
        <div className="h-screen flex flex-col">
            {/* <Header title="Verify Phone" showBackButton onBack={handleBack} /> */}

            <SheetContainer>
                <div className="flex-1 flex pt-10 flex-col">
                    <div className='flex flex-col h-1/2 py-10 overflow-y-auto items-center justify-center '>

                        <div className="p-6 flex-1  px-5 text-center flex flex-col items-center gap-2">
                            <h2 className="text-xl font-semibold text-text-primary m-0">
                                Verify your Registered Email
                            </h2>
                            <p className="text-[13px] text-text-primary m-0">
                                We have sent you a 6-digit code to your Registered Email
                            </p>
                            <p className="text-md leading-none font-semibold text-text-primary m-0">
                                {maskedEmail}
                            </p>
                            <p className="text-[13px] text-text-primary m-0">
                                Please check your messages and enter it here
                            </p>

                            <OtpInput
                                length={6}
                                boxSize='55px'
                                value={code}
                                onChange={setCode}
                            />

                        </div>
                        <div className='p-6 pb-10 w-full text-center'>
                            <Button
                                className="mt-8"
                                fullWidth
                                onClick={handleContinue}
                                disabled={!isCodeComplete || isVerifying}
                            >
                                {isVerifying ? 'Verifying...' : 'Continue'}
                            </Button>

                            <p className="mt-3 text-sm ">
                                Didn&apos;t receive the Code?{' '}
                                <button
                                    onClick={handleResend}
                                    className="bg-transparent border-none text-primary font-semibold cursor-pointer p-0 text-sm"
                                    type="button"
                                >
                                    Resend
                                </button>
                            </p>
                        </div>

                    </div>


                    <div className="h-fit t-10 w-full">
                        <OTPKeypad onKeyPress={handleKeypadKey} />
                    </div>
                </div>
            </SheetContainer>

            {/* Success Popup */}
            {showSuccessPopup && (
                <div
                    ref={popupOverlayRef}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
                    style={{ opacity: 0 }}
                >
                    <div
                        ref={popupContentRef}
                        className="bg-white/80 backdrop-blur-xl  rounded-2xl p-6 mx-8 text-center border border-white/60 min-w-[280px]"
                        style={{ opacity: 0 }}
                    >
                        <p className="text-text-primary text-xm mb-6">
                            Your Payment Limits have been successfully updated
                        </p>
                        <button
                            onClick={handlePopupOk}
                            className="w-full py-3 rounded-full text-text-primary font-medium cursor-pointer border-none"
                            type="button"
                        >
                            Ok
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
