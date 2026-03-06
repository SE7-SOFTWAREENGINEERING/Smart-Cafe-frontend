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

---

### Fixing "Hardcoded" / "Static" Values Issues

I have investigated issues #8, #9, #10, and #11 and made the following changes on the `fix/manager-hardcoded` branch to resolve them. 

The core issue was that when your database is empty, the UI defaulted to showing generic static text (like `0` or `Low` or `150`) because there was no live data to react to. This made the components appear static.

**What was changed:**
1. **Walk-in Management (#11)**: The backend API (`getBookingStats`) was missing an aggregator for walk-ins natively. The frontend was receiving `undefined` and defaulting to `0`. I fixed the **backend** (`booking.controller.js` & `booking.service.js`) to actively aggregate `walkinCount` so it relies purely on real data metrics rather than defaulting to 0 every time.
2. **Slot Management (#10)**: The capacity form defaulted to a hardcoded `150`. I corrected the React state initialization so that it starts as completely empty (`""`), forcing the manager to enter real data instead of accepting a static default.
3. **Food Waste Control (#9)**: If there were 0 logs in the DB, the UI interpreted this mathematically as "0% high waste" and displayed `Low` by default. I updated the logic so that if the total report count is 0, it dynamically displays `No Data` instead of a static green `Low`.
4. **Queue Monitor (#8)**: The variables `50` and `20` were logic thresholds for color-coding "High" or "Moderate" traffic. But when the database is fully empty, the system was reading `0` and reporting `Low Traffic` with a green label. I introduced a native Empty State handler: if `issued === 0 && inQueue === 0`, it now explicitly displays `No Data` with gray tags instead of a static green status.

These components are fully wired to your live MongoDB via `booking.service.ts` and `sustainability.service.ts` APIs. The "static" appearance was just the UI rendering default/empty states due to having zero live data rows in MongoDB.
