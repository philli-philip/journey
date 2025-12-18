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
    steps: [
      {
        id: "s0",
        name: "landing page",
        description: "Welcome to the onboarding process.",
        img: "https://img.icons8.com/ios/50/000000/landing-page.png",
        attributes: {
          pains: "No account to start with",
          insights: "Users want to sign up easily",
          services: "",
        },
      },
      {
        id: "s1",
        name: "Sign Up",
        description: "User creates an account.",
        img: "https://img.icons8.com/ios/50/000000/sign-up.png",
        attributes: {
          pains: "Difficulty with complex forms",
          insights: "Users prefer social login",
          services: "Authentication service",
        },
      },
      {
        id: "s2",
        name: "Profile Creation",
        description: "User fills out their profile information.",
        img: "https://img.icons8.com/ios/50/000000/profile.png",
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
    steps: [
      {
        id: "s3",
        name: "Browse Products",
        description: "User views product listings.",
        img: "https://img.icons8.com/ios/50/000000/browse.png",
        attributes: {
          pains: "Overwhelmed by choices",
          insights: "Personalized recommendations increase engagement",
          services: "Product catalog service",
        },
      },
      {
        id: "s4",
        name: "Add to Cart",
        description: "User adds items to the shopping cart.",
        img: "https://img.icons8.com/ios/50/000000/add-to-cart.png",
        attributes: {
          pains: "Unclear shipping costs",
          insights: "Displaying total cost upfront reduces abandonment",
          services: "Shopping cart service",
        },
      },
      {
        id: "s5",
        name: "Checkout",
        description: "User completes the purchase.",
        img: "https://img.icons8.com/ios/50/000000/checkout.png",
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
];
