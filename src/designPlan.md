# Site Redesign & Organization Plan

## 1. Clean Customer-Facing Homepage
The current homepage focuses heavily on the "Hermes" data ingestion engine and raw telemetry. To make the site "ready for customers", we will reorganize the layout:
* **Clean Landing View**: A polished, minimalist search-centric homepage. 
* **Focus**: The primary action for a user will be the address search and viewing their local officials.
* **Featured Data**: A clean grid of highlighted officials or recent legislative changes, without overwhelming the user with raw data logs.

## 2. Hermes Telemetry Dashboard (Moved from Homepage)
* We will move the "Live Record Harvest Engine" and "Scraper Node Status" into a dedicated view or modal.
* **Header Link**: We will add a persistent navigation header with a link to "Hermes Engine" or "System Status".
* Clicking this link will reveal the complex dashboard we previously built, ensuring we don't lose any of the live counters or system visibility, but keeping it out of the way for regular users.

## 3. Assets & Styling
* **Pending Assets**: Waiting for the assets file (logos, icons, colors, fonts) to be uploaded to the workspace.
* **Global Theme**: Once the assets are provided, we will update `tailwind.config.ts`, `index.css`, and the UI components to strictly adhere to the brand guidelines (colors, typography, and logo placement).

## 4. Persistent Data Organization
* As requested previously, all elected official data (promises, bills, finances, profiles) has been modularized into separate JSON files in `src/data/` to ensure no data is lost and it is neatly organized for version control (GitHub).
