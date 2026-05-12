import { CARD_CONFIG } from "@/lib/card-config";
import { CardType } from "@/lib/types";

export const getCardImage = (cardType: CardType | null): string => {
    if (!cardType) return '/img/debitmockup.png';
    if (cardType && cardType in CARD_CONFIG) {
        return CARD_CONFIG[cardType].mockupImage;
    }

    return '/img/debitmockup.png';
};