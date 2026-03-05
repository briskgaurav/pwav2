    /**
     * Card data types and mock data for the cards screen.
     */

    // Card image mapping - using static imports from public/img/cards/
    import debitCard from "../../../public/img/cards/debit.png";
    import creditCard from "../../../public/img/cards/credit.png";
    import prepaidCard from "../../../public/img/cards/prepaid.png";
    import giftCard from "../../../public/img/cards/gift.png";
    import { StaticImageData } from "next/image";

    // Card image mapping
    export const CardImages: Record<number, StaticImageData> = {
      1: debitCard,
      2: creditCard,
      3: prepaidCard,
      4: giftCard,
    };

    export type CardImageId = 1 | 2 | 3 | 4;

    /** All supported card types */
    export type CardType = "debit" | "credit" | "prepaid" | "gift";

    /** Card form type */
    export type CardForm = "universal" | "virtual";

    export interface CardData {
      id: string;
      imageId: CardImageId;
      name: string;
      cardNumber: string;
      cardType: CardType;
      cardForm: CardForm;
      recentlyUsed: boolean;
      issuedDate: string;
    }

    // Plain array of card objects
    export const mockCards: CardData[] = [
      {
        id: "card-1",
        imageId: 1,
        name: "FCMB Debit",
        cardNumber: "**** **** **** 1234",
        cardType: "debit",
        cardForm: "virtual",
        recentlyUsed: true,
        issuedDate: "2024-01-05",
      },
      {
        id: "card-2",
        imageId: 2,
        name: "GTB Credit",
        cardNumber: "**** **** **** 1235",
        cardType: "credit",
        cardForm: "virtual",
        recentlyUsed: true,
        issuedDate: "2024-02-10",
      },
      {
        id: "card-3",
        imageId: 1,
        name: "Access Debit",
        cardNumber: "**** **** **** 1236",
        cardType: "debit",
        cardForm: "virtual",
        recentlyUsed: true,
        issuedDate: "2024-03-12",
      },
      {
        id: "card-4",
        imageId: 3,
        name: "Prepaid Card",
        cardNumber: "**** **** **** 1237",
        cardType: "prepaid",
        cardForm: "universal",
        recentlyUsed: true,
        issuedDate: "2024-04-18",
      },
      {
        id: "card-5",
        imageId: 4,
        name: "Gift Card",
        cardNumber: "**** **** **** 1238",
        cardType: "gift",
        cardForm: "universal",
        recentlyUsed: true,
        issuedDate: "2024-05-20",
      },
      {
        id: "card-6",
        imageId: 2,
        name: "FCMB Magic",
        cardNumber: "**** **** **** 1239",
        cardType: "credit",
        cardForm: "universal",
        recentlyUsed: false,
        issuedDate: "2023-11-15",
      },
      {
        id: "card-7",
        imageId: 1,
        name: "GTB Debit",
        cardNumber: "**** **** **** 1240",
        cardType: "debit",
        cardForm: "virtual",
        recentlyUsed: false,
        issuedDate: "2023-10-22",
      },
      {
        id: "card-8",
        imageId: 2,
        name: "Access Credit",
        cardNumber: "**** **** **** 1241",
        cardType: "credit",
        cardForm: "virtual",
        recentlyUsed: false,
        issuedDate: "2023-09-30",
      },
      {
        id: "card-9",
        imageId: 3,
        name: "Travel Card",
        cardNumber: "**** **** **** 1242",
        cardType: "prepaid",
        cardForm: "virtual",
        recentlyUsed: false,
        issuedDate: "2023-08-18",
      },
      {
        id: "card-10",
        imageId: 4,
        name: "Reward Card",
        cardNumber: "**** **** **** 1243",
        cardType: "gift",
        cardForm: "virtual",
        recentlyUsed: false,
        issuedDate: "2023-07-05",
      },
      {
        id: "card-11",
        imageId: 3,
        name: "Student Card",
        cardNumber: "**** **** **** 1244",
        cardType: "prepaid",
        cardForm: "virtual",
        recentlyUsed: false,
        issuedDate: "2023-06-12",
      },
      {
        id: "card-12",
        imageId: 4,
        name: "Shopping Card",
        cardNumber: "**** **** **** 1245",
        cardType: "gift",
        cardForm: "virtual",
        recentlyUsed: false,
        issuedDate: "2023-05-01",
      },
      {
        id: "card-13",
        imageId: 1,
        name: "FCMB Debit",
        cardNumber: "**** **** **** 1246",
        cardType: "debit",
        cardForm: "virtual",
        recentlyUsed: false,
        issuedDate: "2023-04-10",
      },
      {
        id: "card-14",
        imageId: 2,
        name: "GTB Credit",
        cardNumber: "**** **** **** 1247",
        cardType: "credit",
        cardForm: "virtual",
        recentlyUsed: false,
        issuedDate: "2023-03-08",
      },
      {
        id: "card-15",
        imageId: 1,
        name: "Access Debit",
        cardNumber: "**** **** **** 1248",
        cardType: "debit",
        cardForm: "universal",
        recentlyUsed: false,
        issuedDate: "2023-02-14",
      },
    ];
