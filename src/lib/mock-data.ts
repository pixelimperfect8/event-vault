
export const MOCK_EVENTS = [
    { id: "evt_1", name: "Smith-Jones Wedding", clientName: "Alice Smith", date: "2024-06-15", venue: "Grand Plaza Hotel" },
    { id: "evt_2", name: "TechConf 2024", clientName: "TechCorp Inc.", date: "2024-09-20", venue: "Convention Center" },
    { id: "evt_3", name: "Q3 Board Meeting", clientName: "Acme Co", date: "2024-07-10", venue: "HQ Boardroom" },
]

export const MOCK_CONTRACTS = [
    {
        id: "ctr_1",
        eventId: "evt_1",
        title: "Venue Agreement",
        status: "SIGNED",
        versions: [
            { version: 2, date: "2023-12-01", file: "venue_v2_signed.pdf" },
            { version: 1, date: "2023-11-20", file: "venue_v1_draft.pdf" }
        ]
    },
    {
        id: "ctr_2",
        eventId: "evt_1",
        title: "Catering Contract",
        status: "DRAFT",
        versions: [
            { version: 1, date: "2024-01-05", file: "catering_proposal.pdf" }
        ]
    },
]

export const MOCK_ACTIVITY = [
    { id: "act_1", eventId: "evt_1", description: "Contract 'Venue Agreement' signed", timestamp: "2023-12-01T10:00:00Z" },
    { id: "act_2", eventId: "evt_1", description: "Uploaded 'Catering Contract' draft", timestamp: "2024-01-05T14:30:00Z" },
    { id: "act_3", eventId: "evt_1", description: "Event created", timestamp: "2023-11-15T09:00:00Z" },
]
