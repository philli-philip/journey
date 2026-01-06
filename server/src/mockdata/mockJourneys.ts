import type { UserJourney, Dimension } from "@shared/types";

export const mockDimensions: Dimension[] = [
  {
    slug: "pains",
    name: "Paint points",
    description: "Pain points of the user for this step",
    type: "Text",
  },
  {
    slug: "insights",
    name: "Insights",
    description: "Insights of the user for this step",
    type: "Text",
  },
  {
    slug: "services",
    name: "Services",
    description: "Services involved in this step",
    type: "Text",
  },
];

export const mockUserJourneys: UserJourney[] = [
  {
    id: "uj1",
    name: "Onboarding Flow",
    description: "The initial user onboarding process.",
    personas: [
      {
        slug: "admin",
        name: "Administrator",
      },
    ],
    steps: [
      {
        id: "s0",
        journeyId: "uj2",
        name: "landing page",
        description: "Welcome to the onboarding process.",
        attributes: {
          pains: "No account to start with",
          insights: "Users want to sign up easily",
          services: "",
        },
      },
      {
        id: "s1",
        journeyId: "uj2",
        name: "Sign Up",
        description: "User creates an account.",
        attributes: {
          pains: "Difficulty with complex forms",
          insights: "Users prefer social login",
          services: "Authentication service",
        },
      },
      {
        id: "s2",
        journeyId: "uj2",
        name: "Profile Creation",
        description: "User fills out their profile information.",
        attributes: {
          pains: "Unsure what information is required",
          insights: "Progress bar helps completion",
          services: "User profile service",
        },
      },
    ],
    createdAt: "2023-01-01T10:00:00Z",
    updatedAt: "2023-01-01T10:00:00Z",
  },
  {
    id: "uj2",
    name: "Purchase Process",
    description: "Steps involved in making a purchase.",
    personas: [],
    steps: [
      {
        id: "s3",
        name: "Browse Products",
        description: "User views product listings.",
        journeyId: "uj2",
        attributes: {
          pains: "Overwhelmed by choices",
          insights: "Personalized recommendations increase engagement",
          services: "Product catalog service",
        },
      },
      {
        id: "s4",
        name: "Add to Cart",
        journeyId: "uj2",
        description: "User adds items to the shopping cart.",
        attributes: {
          pains: "Unclear shipping costs",
          insights: "Displaying total cost upfront reduces abandonment",
          services: "Shopping cart service",
        },
      },
      {
        id: "s5",
        name: "Checkout",
        journeyId: "uj2",
        description: "User completes the purchase.",
        attributes: {
          pains: "Long checkout process",
          insights: "Guest checkout option improves conversion",
          services: "Payment gateway, Order service",
        },
      },
    ],
    createdAt: "2023-02-15T11:30:00Z",
    updatedAt: "2023-02-15T11:30:00Z",
  },
  {
    id: "uj3",
    name: "Customer Support Interaction",
    description: "Process of a user seeking and receiving support.",
    personas: [],
    steps: [
      {
        id: "s6",
        name: "Access Help Center",
        journeyId: "uj3",
        description: "User navigates to the help or support section.",

        attributes: {
          pains: "Difficulty finding relevant articles",
          insights: "Search functionality is crucial for self-service",
          services: "Knowledge base service",
        },
      },
      {
        id: "s7",
        name: "Submit Ticket",
        journeyId: "uj3",
        description: "User submits a support request.",
        attributes: {
          pains: "Long wait times for response",
          insights:
            "Clear communication on expected response times improves satisfaction",
          services: "Ticketing system",
        },
      },
      {
        id: "s8",
        name: "Receive Resolution",
        journeyId: "uj3",
        description: "User gets a solution to their problem.",
        attributes: {
          pains: "Unresolved issues or multiple interactions",
          insights:
            "Follow-up surveys help gauge satisfaction and identify areas for improvement",
          services: "Customer support agent, CRM",
        },
      },
    ],
    createdAt: "2023-03-20T09:00:00Z",
    updatedAt: "2023-03-20T09:00:00Z",
  },
];
