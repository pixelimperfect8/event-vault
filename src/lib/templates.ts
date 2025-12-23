export interface EventTemplate {
    id: string;
    name: string;
    type: string;
    sections: {
        title: string;
        tasks: {
            title: string;
            description?: string;
            completed: boolean;
        }[];
    }[];
}

export const EVENT_TEMPLATES: EventTemplate[] = [
    {
        id: "blank",
        name: "Blank",
        type: "Other",
        sections: []
    },
    {
        id: "wedding-basic",
        name: "Wedding – basic",
        type: "Wedding",
        sections: [
            {
                title: "Venue & Catering",
                tasks: [
                    { title: "Book venue", completed: false },
                    { title: "Select menu", completed: false },
                    { title: "Final count", completed: false }
                ]
            },
            {
                title: "Logistics",
                tasks: [
                    { title: "Hire photographer", completed: false },
                    { title: "Book DJ/Music", completed: false },
                    { title: "Order flowers", completed: false }
                ]
            }
        ]
    },
    {
        id: "corporate-basic",
        name: "Corporate – basic",
        type: "Corporate",
        sections: [
            {
                title: "Program",
                tasks: [
                    { title: "Confirm speakers", completed: false },
                    { title: "Set agenda", completed: false },
                    { title: "AV setup", completed: false }
                ]
            },
            {
                title: "Attendees",
                tasks: [
                    { title: "Send invitations", completed: false },
                    { title: "Registration setup", completed: false },
                    { title: "Badge printing", completed: false }
                ]
            }
        ]
    }
];
