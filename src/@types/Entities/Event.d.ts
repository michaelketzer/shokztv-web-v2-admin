export type EventLinkType = 'homepage' | 'liquipedia' | 'custom';

export interface EventLink {
    id: number;
    event: number;
    name: string;
    link: string;
    linkType: EventLinkType;
}

export type EventDescriptionType = 'description' | 'information' | 'advice'; 

export interface Event {
    id: number;
    name: string;
    organizer: number;
    descriptionShort: string;
    start: number;
    end: number;
    country: string;
    location: string;
    pricePool: string;
    description: string;
    descriptionType: EventDescriptionType;
    disclaimer: string;
    tags: number[];
    links: number[];
    banner: string;
    organizerLogo: string;
    isFeatured: boolean;
    isMainEvent: boolean;
}