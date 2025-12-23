---
description: Automatically register new components into the Master Design System sheet.
---

Whenever a new UI component is created in `src/components/`, call this workflow to ensure visibility for the App Master.

### Steps:

1. **Detect Component**: Confirm the component follows the project's styling guidelines (Geist font, Slate/Indigo palette).
2. **Update Registry**: Locate the "Component Sheet" section in `src/app/dashboard/design-system/design-system-client.tsx`.
3. **Insert Preview**:
    - Add a new `<ComponentSection>` if applicable.
    - Insert a live demonstration of the component with common variations.
4. **Notify Master**: Mention the new addition in the final walkthrough.

// turbo
5. **Verify Layout**: Run a quick lint/build check to ensure the documentation page remains performant.
