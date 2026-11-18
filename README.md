# Campus Stores

Campus Stores is a Product Engineer work sample about managing equipment at a fictional campus media equipment desk. It is built using plain HTML, CSS, and JavaScript and runs entirely in the browser without requiring a backend server or database.

## How to Run

Open `index.html` in a current browser. The application can run directly from the local file or through a simple local HTTP server.

From the project folder, run:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then visit [http://localhost:8000](http://localhost:8000).

The application saves shift progress in browser `localStorage`. Refreshing the page preserves loans, notes, and handover state.

**Restart sample shift** restores the original fictional records in the current browser.

## What Worked in the Existing Product

The Inventory page provides a useful physical view of the equipment. Each item has an individual asset ID, model, shelf location, and availability status.

For example:
- `PR-04` – BenQ MH550 projector, located at A2.
- `SP-02` – JBL Eon One speaker, located at B1.
- `AD-12` – Belkin USB-C to HDMI adapter, located at C4.

This makes it possible for staff to identify and issue specific physical units instead of relying only on equipment categories or club names.

I decided to retain this asset-level inventory approach because it provides a reliable foundation for equipment tracking.

## Problem Observed During the Sample Shift

During Friday's return, Kabir Sen reports that `PR-04` and `SP-02` have been returned, while `AD-12` is still with Leela Das.

The original Loan register provided a single **Record return** action that closed a loan without requiring confirmation of the physical item.

This created an important operational problem: an item could be marked as returned based only on someone's statement, without the next employee physically checking it.

The morning shift also had to combine information from the Desk book and Loan register to understand which equipment was still outstanding.

I wanted to improve this handover process without replacing the existing workflow.

## Improvements Made

### 1. Smart Shift Handover

I added a dedicated **Shift handover** section to the existing navigation.

It provides a consolidated view of outstanding equipment, grouped by approved request.

The improvement includes:

- Groups outstanding loans by approved request.
- Displays physical asset IDs, borrowers, due times, and loan slip numbers.
- Separates outstanding equipment from returned-and-recorded items.
- Highlights items reported as returned but awaiting physical verification.
- Provides actions to verify an item or mark it as requiring verification.
- Allows staff to record notes explaining why an item needs checking.
- Displays completed returns separately from outstanding equipment.

This reduces the need to manually combine information from multiple sections during shift changes.

### 2. Physical Return Verification

I updated the return workflow in `app.js` to avoid closing loans without confirming the physical item.

The new verification process:

1. Staff select the outstanding loan.
2. The application asks for the physical asset ID.
3. The entered ID is compared with the asset ID associated with the loan.
4. If the ID does not match, the loan remains open and an error message is displayed.
5. If the ID matches, the return is recorded and the loan is closed.

This ensures that inventory availability changes only after a successful physical-item verification.

### 3. Reported Return and Verification Status

The application now distinguishes between an item reported as returned and an item physically verified at the desk.

For example, when the Friday evening shift begins:

- `PR-04` is marked as reported returned, awaiting verification.
- `SP-02` is marked as reported returned, awaiting verification.
- `AD-12` remains outstanding because Leela Das still has it.

Staff can record a short verification note and complete the physical check before closing the corresponding loan.

### 4. Updated Shift Progression

The existing three-stage sample shift has been retained.

The JavaScript logic now automatically identifies the projector and speaker as reported returns when the application moves from Friday afternoon to Friday evening, provided their loans have been issued.

This makes the handover scenario more realistic and demonstrates how the next employee can distinguish between reported returns and verified returns.

## UI/UX Improvements

Along with the functional improvements, I updated the visual styling to give the application a cleaner and more professional interface.

The original HTML structure, navigation behavior, and application workflow have been retained.

The CSS redesign includes:

- A refined light-theme interface with indigo and blue accents.
- Improved typography, visual hierarchy, and spacing.
- A cleaner application header and branding.
- Redesigned sidebar navigation with clearer active states.
- More polished buttons, input fields, and forms.
- Improved inventory rows, records, and status indicators.
- Better presentation of shift handover and verification panels.
- Subtle hover and focus interactions.
- Responsive layouts for smaller screens.
- Improved accessibility through visible keyboard focus states and reduced-motion support.

The intention was to improve readability and usability while preserving the familiarity of the original application.

## Test RQ-214: Friday to Saturday Workflow

The following steps demonstrate the updated functionality.

### Friday – 3:45 PM: Equipment Pickup

1. Start at **Friday · 3:45 pm**.
2. Open **Loan register**.
3. Select **New issue slip**.
4. Create three separate issue slips for request `RQ-214`, using:
   - Collected by: `Kabir Sen`
   - Return by: `Fri 8 pm`
   - `PR-04` – HDMI projector
   - `SP-02` – Portable speaker
   - `AD-12` – USB-C to HDMI adapter
5. Open **Inventory** and confirm that all three physical units show **On loan**.

### Friday – 7:30 PM: Partial Return

6. Click **Move to return time**.
7. Open **Shift handover**.
8. Confirm that `PR-04`, `SP-02`, and `AD-12` appear under request `RQ-214`.
9. The application automatically marks `PR-04` and `SP-02` as reported returned, awaiting physical verification.
10. Select **Check physical item** for `PR-04`.
11. Enter `SP-02` instead of `PR-04`. The application should reject the incorrect ID and keep the loan open.
12. Enter `PR-04` correctly. The loan should close and the asset should become available again.
13. Repeat the verification process for `SP-02`.
14. Leave `AD-12` outstanding because Leela Das still has the adapter.

### Saturday – 9:00 AM: Morning Handover

15. Click **Move to next morning**.
16. Open **Shift handover** and confirm that `AD-12` remains outstanding under `RQ-214`.
17. Select **Verify return** for the adapter.
18. Enter `AD-12` as the physical item ID.
19. Confirm that the loan closes and the adapter becomes available again.
20. Refresh the browser and verify that the recorded loan and inventory states persist.

## Original Features Retained

The following original features have been preserved:

- Approved requests and request details.
- Inventory with physical asset IDs and availability filters.
- Individual equipment issue slips.
- Loan register with outstanding and completed slips.
- Desk book messages from clubs.
- Manual handover notes.
- Three-stage sample shift progression.
- Restart sample shift functionality.
- Browser-based local storage.

The improvements extend the existing application rather than replacing its original workflow.

## What I Would Validate at a Real Counter

I would observe how staff handle reported returns and shift changes during actual equipment handovers.

In particular, I would measure:

- How often equipment is incorrectly marked as returned before physical verification.
- How long it takes the incoming shift to identify outstanding items.
- How frequently staff need to contact the previous shift for missing information.
- Whether physical asset ID verification reduces mistakes during returns.

A useful outcome would be fewer incorrectly closed loans and less time spent clarifying outstanding equipment during shift handovers.

## Limitations and Future Improvements

This is a browser-based prototype rather than a complete equipment management system.

Current limitations include:

- No user authentication or role-based access.
- No backend server or shared database.
- Local storage is specific to the current browser and device.
- Physical verification currently uses manually entered asset IDs rather than barcode scanning.
- Return condition and damage tracking are not implemented.
- There is no automatic synchronization between multiple employees or devices.

Potential future improvements include barcode-based asset verification, equipment condition tracking, overdue notifications, shared shift records, and a searchable equipment activity history.

## Technology Stack

- **HTML5** – Application structure.
- **CSS3** – Responsive layouts and visual design.
- **JavaScript (Vanilla JS)** – Application logic, equipment tracking, return verification, and shift handover.
- **Browser localStorage** – Local persistence of sample shift records.

The application does not require any external framework, backend service, or database to run.