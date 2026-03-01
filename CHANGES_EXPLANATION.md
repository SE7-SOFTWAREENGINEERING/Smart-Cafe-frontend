# Changes Explanation

As requested, new testing instructions have been added to the Login Page (`src/auth/login/page.tsx`).

### Summary of Changes:
- Added an informational UI block below the Sign-In button explicitly displaying the testing instructions.
- Added "Auto-fill" buttons to quickly populate Manager and Staff test credentials.
- Explicitly stated the permission mappings for testing validation:
  - **Walk-in Management** → Staff
  - **Slot Management** → Manager
  - **Food Waste Control** → Manager
  - **Queue Monitor** → Manager

These changes allow developers and testers to immediately know which account to log in with, and which features they possess based on their role.
