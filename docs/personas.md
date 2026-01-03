# Personas

## Objective

With personas each journey should be associated with one or more personas. Additionally an "all" persona is available to tag to journeys. This allows to filter and prioritise journeys based on personas.

### Attributes

id: unique identifier for the persona
name: name of the persona
Descriptions: text area to describe the persona in more details.
createdAt: timestamp
updatedAt: timestamp
DeletedAt: Timestamp

# Implementation steps

0. Create a schema and type for the `personas` table.
1. Add a new table `personas` to the database.
2. Add the attributes defined above to the table.
3. Create end points for CRUD operations on the `personas` table.
4. Create a seed script with mockfile containing some personas.
5. Update the `user_journeys` table to add a many-to-many relationship with `personas`.
   - The relationship should be stored in a new table `user_journeys_connections`.
   - The table should have two columns: `user_journey_id` and `persona_id`.
6. Create a new page listing all personas.
7. Drawer to create persona
8. Drawer to update persona
9. Action in the list to delete a persona.
10.
