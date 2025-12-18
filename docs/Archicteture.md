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

### Dimension
- id: ShortID
- name: A unique name for the dimension.
- description: A detailed description of the dimension. short support Markdown
- Type: The type of the dimension. Can be one of the following. In the future the type should be extenable as it makes the system more flexible and powerful.
    - Text
    - Number
    - Image

### Utilities
- ShortID: Is a unique identifier for identiying any object. Created with NanoID or any other unique identifier generator.