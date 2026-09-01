# REJECTED DATA & PURGE LEDGER

Timestamp: 2026-09-01T12:00:00Z

The following records have been rejected and purged from the data/ research vault:

1. **Maria Thompson (`person_maria_thompson`)**
   - Reason: Demo fixture from Orange County School Board District 2 (fl-sd-oc-thompson.json).
   - Real Official: Maria Salamanca.
   - Purged Files: `person_maria_thompson.json`, `seat_oc_school_b2.json`, `occ_maria_thompson.json`, `snap_person_maria_thompson.json`.

2. **Synthetic / Mock Generators**
   - Reason: Automated 50-state synthetic generation containing fake 555-phone numbers, filler email addresses, and Unsplash avatars.
   - Action: Excluded from `data/` research vault.

3. **Invalid / 404 Source URLs**
   - Reason: Dead links such as `https://www.flgov.com/governor-ron-desantis/`.
   - Action: Corrected to valid HTTP 200 canonical URLs (e.g., `https://www.flgov.com/`).
