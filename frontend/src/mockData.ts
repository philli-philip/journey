import type { UserJourney } from "@shared/types";

export const mockUserJourneys: UserJourney[] = [
  {
    id: "uj1",
    name: "Onboarding Flow",
    description: "The initial user onboarding process.",
    steps: [
      {
        id: "s1",
        name: "Sign Up",
        description: "User creates an account.",
        dimensions: [
          { id: "d1", name: "Email", description: "User email", type: "Text" },
          {
            id: "d2",
            name: "Password",
            description: "User password",
            type: "Text",
          },
        ],
      },
      {
        id: "s2",
        name: "Profile Creation",
        description: "User fills out their profile information.",
        dimensions: [
          {
            id: "d3",
            name: "Name",
            description: "User full name",
            type: "Text",
          },
          { id: "d4", name: "Age", description: "User age", type: "Number" },
        ],
      },
    ],
    createdAt: "2023-01-01T10:00:00Z",
    updatedAt: "2023-01-01T10:00:00Z",
  },
  {
    id: "uj2",
    name: "Purchase Process",
    description: "Steps involved in making a purchase.",
    steps: [
      {
        id: "s3",
        name: "Browse Products",
        description: "User views product listings.",
        dimensions: [
          {
            id: "d5",
            name: "Category",
            description: "Product category viewed",
            type: "Text",
          },
        ],
      },
      {
        id: "s4",
        name: "Add to Cart",
        description: "User adds items to the shopping cart.",
        dimensions: [
          {
            id: "d6",
            name: "Product ID",
            description: "ID of product added",
            type: "Text",
          },
          {
            id: "d7",
            name: "Quantity",
            description: "Number of items",
            type: "Number",
          },
        ],
      },
      {
        id: "s5",
        name: "Checkout",
        description: "User completes the purchase.",
        dimensions: [
          {
            id: "d8",
            name: "Payment Method",
            description: "Method of payment",
            type: "Text",
          },
        ],
      },
    ],
    createdAt: "2023-02-15T11:30:00Z",
    updatedAt: "2023-02-15T11:30:00Z",
  },
];
