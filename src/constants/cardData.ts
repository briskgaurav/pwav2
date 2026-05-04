    /**
     * Card data types and mock data for the cards screen.
     */

    // Card image mapping - using static imports from public/img/cards/
    import { type StaticImageData } from "next/image";

    import creditCard from "../../public/img/cards/credit.png";
    import debitCard from "../../public/img/cards/debit.png";
    import giftCard from "../../public/img/cards/gift.png";
    import prepaidCard from "../../public/img/cards/prepaid.png";
    import universalCard from "../../public/img/cards/universal.png";


    // Card image mapping
    export const CardImages: Record<number, StaticImageData> = {
      1: debitCard,
      2: creditCard,
      3: prepaidCard,
      4: giftCard,
      5: universalCard,
    };

    export type CardImageId = 1 | 2 | 3 | 4 | 5;

    // export const CARD_IMAGE_PATHS: Record<CardImageId, string> = {
    //   1: '/img/cards/debit.png',
    //   2: '/img/cards/credit.png',
    //   3: '/img/cards/prepaid.png',
    //   4: '/img/cards/gift.png',
    //   5: '/img/cards/Universal1.png',
    // };
    export const CARD_IMAGE_PATHS: Record<CardImageId, string> = {
      1: '/img/cards/DebitCard.png',
      2: '/img/cards/Credit1.png',
      3: '/img/cards/prepaid1.png',
      4: '/img/cards/Gift1.png',
      5: '/img/cards/Universal1.png',
    };

    /** All supported card types */
    export type CardType = "debit" | "credit" | "prepaid" | "gift";

    /** Card form type */
    export type CardForm = "universal" | "virtual";

    export interface CardData {
      id: string;
      imageId: CardImageId;
      name: string;
      cardHolder: string;
      cardNumber: string;
      pin: string;
      expiry: string;
      balance: number;
      cardType: CardType;
      cardForm: CardForm;
      recentlyUsed: boolean;
      mostUsed: boolean;
      issuedDate: string;
      previousUsedCount: number;
      linkedVirtualCardId?: string | null;
    }

    // Plain array of card objects
    export const mockCards: CardData[] = [
      {
        id: "card-1",
        imageId: 1,
        name: "FCMB Debit",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "12/26",
        balance: 15000.50,
        cardType: "debit",
        cardForm: "virtual",
        recentlyUsed: true,
        mostUsed: true,
        issuedDate: "2024-01-05",
        previousUsedCount: 45,
      },
      {
        id: "card-2",
        imageId: 2,
        name: "GTB Credit",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "08/27",
        balance: 250000.00,
        cardType: "credit",
        cardForm: "virtual",
        recentlyUsed: true,
        mostUsed: true,
        issuedDate: "2024-02-10",
        previousUsedCount: 38,
      },
      {
        id: "card-3",
        imageId: 1,
        name: "Access Debit",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "03/28",
        balance: 8500.75,
        cardType: "debit",
        cardForm: "virtual",
        recentlyUsed: true,
        mostUsed: false,
        issuedDate: "2024-03-12",
        previousUsedCount: 12,
      },
      {
        id: "card-4",
        imageId: 5,
        name: "Prepaid Card",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "06/25",
        balance: 5000.00,
        cardType: "prepaid",
        cardForm: "universal",
        recentlyUsed: true,
        mostUsed: true,
        issuedDate: "2024-04-18",
        previousUsedCount: 28,
      },
      {
        id: "card-5",
        imageId: 5,
        name: "Gift Card",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "12/25",
        balance: 2500.00,
        cardType: "gift",
        cardForm: "universal",
        recentlyUsed: true,
        mostUsed: false,
        issuedDate: "2024-05-20",
        previousUsedCount: 5,
      },
      {
        id: "card-6",
        imageId: 5,
        name: "FCMB Magic",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "11/26",
        balance: 175000.00,
        cardType: "credit",
        cardForm: "universal",
        recentlyUsed: false,
        mostUsed: true,
        issuedDate: "2023-11-15",
        previousUsedCount: 52,
      },
      {
        id: "card-7",
        imageId: 1,
        name: "GTB Debit",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "10/25",
        balance: 3200.00,
        cardType: "debit",
        cardForm: "virtual",
        recentlyUsed: false,
        mostUsed: false,
        issuedDate: "2023-10-22",
        previousUsedCount: 8,
      },
      {
        id: "card-8",
        imageId: 2,
        name: "Access Credit",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "09/27",
        balance: 120000.00,
        cardType: "credit",
        cardForm: "virtual",
        recentlyUsed: false,
        mostUsed: false,
        issuedDate: "2023-09-30",
        previousUsedCount: 15,
      },
      {
        id: "card-9",
        imageId: 3,
        name: "Travel Card",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "04/28",
        balance: 10000.00,
        cardType: "prepaid",
        cardForm: "virtual",
        recentlyUsed: false,
        mostUsed: false,
        issuedDate: "2023-08-18",
        previousUsedCount: 3,
      },
      {
        id: "card-10",
        imageId: 4,
        name: "Reward Card",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "07/26",
        balance: 7500.00,
        cardType: "gift",
        cardForm: "virtual",
        recentlyUsed: false,
        mostUsed: true,
        issuedDate: "2023-07-05",
        previousUsedCount: 22,
      },
      {
        id: "card-11",
        imageId: 3,
        name: "Student Card",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "06/27",
        balance: 1500.00,
        cardType: "prepaid",
        cardForm: "virtual",
        recentlyUsed: false,
        mostUsed: false,
        issuedDate: "2023-06-12",
        previousUsedCount: 6,
      },
      {
        id: "card-12",
        imageId: 4,
        name: "Shopping Card",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "05/25",
        balance: 3000.00,
        cardType: "gift",
        cardForm: "virtual",
        recentlyUsed: false,
        mostUsed: false,
        issuedDate: "2023-05-01",
        previousUsedCount: 10,
      },
      {
        id: "card-13",
        imageId: 1,
        name: "FCMB Debit",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "04/26",
        balance: 22000.00,
        cardType: "debit",
        cardForm: "virtual",
        recentlyUsed: false,
        mostUsed: false,
        issuedDate: "2023-04-10",
        previousUsedCount: 18,
      },
      {
        id: "card-14",
        imageId: 2,
        name: "GTB Credit",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "03/27",
        balance: 85000.00,
        cardType: "credit",
        cardForm: "virtual",
        recentlyUsed: false,
        mostUsed: false,
        issuedDate: "2023-03-08",
        previousUsedCount: 25,
      },
      {
        id: "card-15",
        imageId: 5,
        name: "Access Debit",
        cardHolder: "Nirdesh Malik",
        cardNumber: "0000 0000 0000 0000",
        pin: "0000",
        expiry: "02/28",
        balance: 45000.00,
        cardType: "debit",
        cardForm: "universal",
        recentlyUsed: false,
        mostUsed: false,
        issuedDate: "2023-02-14",
        previousUsedCount: 30,
      },
    ];
