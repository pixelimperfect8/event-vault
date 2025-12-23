
export interface User {
    id: string;
    name: string | null;
    email: string;
    password?: string | null;
    hasCompletedOnboarding?: boolean;
    workspaceName?: string | null;
    role?: 'USER' | 'APP_MASTER';
    createdAt: string;
    updatedAt: string;
}

export interface Event {
    id: string;
    userId: string;
    name: string;
    clientName?: string | null;
    type: 'Wedding' | 'Corporate' | 'Social' | 'Conference' | 'Non-Profit' | 'Other';
    status: 'DRAFT' | 'PLANNING' | 'ACTIVE' | 'COMPLETED';
    startDate?: string | null;
    endDate?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    venueName?: string | null;
    venueAddress?: string | null;
    timezone: string;
    sections: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    createdAt: string;
    updatedAt: string;
    role?: string; // For client-side role passing
}

export interface Bug {
    id: string;
    reporter_id: string;
    element_selector: string;
    element_text?: string | null;
    description: string;
    status: 'PENDING' | 'FIXED';
    created_at: string;
    updated_at: string;
}

export interface Contract {
    id: string;
    eventId: string;
    title: string;
    status: 'DRAFT' | 'FINAL' | 'SIGNED';
    versions: ContractVersion[];
    createdAt: string;
    updatedAt: string;
}

export interface ContractVersion {
    version: number;
    file: string;
    date: string;
}
