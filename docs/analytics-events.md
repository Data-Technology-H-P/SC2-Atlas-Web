# SC2 Atlas — Internal Analytics Event Documentation

This document describes all analytics events instrumented within the StarCraft II Interactive Unit Atlas project. This implementation tracks user engagement metrics safely and anonymously to power product-driven iteration.

## Privacy & Safety Regulations

In compliance with the **SC2 Atlas Privacy Rules**:
- **No Personal Identifiable Information (PII)**: The application does not collect, store, or transmit names, emails, IP addresses, or unique user IDs.
- **Anonymized Search Inquiries**: Raw text queries typed into the search filters are stripped entirely. Google Analytics only receives `query_length` and `results_count`.
- **Anonymized Navigation**: Faction selections, unit card clicks, and custom filters are mapped purely to generic ID properties (e.g. `zerg`, `stalker`, `name`, `ranged`).

---

## Analytics Events Reference

### 1. `race_selected`
Fires when a user clicks a faction card in the Command Center on the landing page.
- **Category**: `engagement`
- **Label**: `raceId` (e.g. `protoss`)
- **Custom Parameters**:
  - `race`: `terran` | `zerg` | `protoss`

### 2. `sort_changed`
Fires when a user selects a new sort order from the dropdown menu in a faction roster.
- **Category**: `filter`
- **Label**: `sortBy` (e.g. `minerals`)
- **Custom Parameters**:
  - `race`: Roster's race ID.
  - `sort_by`: `name` | `minerals` | `gas` | `buildTime`

### 3. `unit_card_clicked`
Fires when a user clicks a unit's grid card to explore its detailed tactical sheets.
- **Category**: `engagement`
- **Label**: `unitSlug` (e.g. `stalker`)
- **Custom Parameters**:
  - `race`: Unit's race.
  - `unit`: Unit's slug.

### 4. `unit_detail_opened`
Fires immediately when the custom dynamic `UnitDetailModal` mounts or opens.
- **Category**: `engagement`
- **Label**: `unitSlug` (e.g. `stalker`)
- **Custom Parameters**:
  - `race`: Unit's race.
  - `unit`: Unit's slug.

### 5. `role_filter_used`
Fires when a user clicks a category filter chip (e.g. basic, air, siege) on the roster page.
- **Category**: `filter`
- **Label**: `selectedRole` (e.g. `air`)
- **Custom Parameters**:
  - `race`: Faction roster ID.
  - `role`: Filter chip value.

### 6. `search_used`
Fires when a user searches for a unit. Fired on a 1.5-second debounce delay to prevent spamming Google Analytics, or when the search input loses focus (`blur`).
- **Category**: `filter`
- **Label**: *None*
- **Custom Parameters**:
  - `race`: Faction roster ID.
  - `query_length`: Character length of the search.
  - `results_count`: Number of matching cards visible after search.

### 7. `language_changed`
Fires when a user switches the active localization of the application.
- **Category**: `preferences`
- **Label**: `newLocale` (e.g. `es`)
- **Custom Parameters**:
  - `language`: `en` | `es` | `pt`

### 8. `external_link_clicked`
Fires when a user clicks outbound links, specifically the DataTech H&P link in the footer.
- **Category**: `engagement`
- **Label**: `outboundLabel` (e.g. `DataTech H&P`)
- **Custom Parameters**:
  - `label`: Name of clicked link.
  - `location`: Page section (e.g. `footer`).
