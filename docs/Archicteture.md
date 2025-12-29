# Architecture

## Components

### User journey

- ID: ShortID
- Name: A unique name for the user journey.
- Description: A detailed description of the user journey. short support Markdown
- Steps: A list of steps in the user journey. Each step should have a unique ShortID.
- CreatedAt: The timestamp when the user journey was created.
- UpdatedAt: The timestamp when the user journey was last updated.
- DeletedAt: The timestamp when the user journey was deleted.

### Step

- id: ShortID
- name: A unique name for the step.
- Dimensions: A list of dimensions for the step.
  - description: A detailed description of the step. short support Markdown

# Dimensions

## base attributes

- id: ShortID
- name: A unique name for the dimension.
- description: A detailed description of the dimension. short support Markdown
- createdAt, updatedAt, deletedAt

## Insights

Insights can be small snippets about a producct, user, market.
An insight can be linked to multiple steps.

### Utilities

- ShortID: Is a unique identifier for identiying any object. Created with NanoID or any other unique identifier generator.
