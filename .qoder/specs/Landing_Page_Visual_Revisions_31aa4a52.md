# CryptoSharia Masterclass Landing Page — Visual Revisions Plan

## Context

The landing page is a single-file inline implementation (`src/routes/+page.svelte`, 1358 lines) rendering 11 configurable sections driven by `src/lib/landingContent.ts` via Firestore. The current design is functional but visually uniform — card layouts are repetitive, no carousels or scroll animations, section titles use plain white text, and cards have flat dark backgrounds. The goal is 7 visual enhancements to make the page more premium and dynamic while maintaining the existing dark-mode crypto/Islamic fintech aesthetic with orange/amber/green accents.

**Guiding Principles** (per user feedback):
- Do NOT over-engineer layouts. Keep the overall design consistent, clean, not too busy.
- Preserve all CTAs, WhatsApp links, admin/auth/database logic, routing, and payment logic.
- Do NOT break Firestore admin-edited content rendering.
- All changes are visual/frontend only on the landing page.

---

## Files to Modify

| File | Purpose |
|------|---------||
| `src/routes/+page.svelte` | Main landing page (all revisions touch this) |
| `src/app.css` | Keyframe animations, gradient utilities, carousel styles |
| `src/lib/landingContent.ts` | Update default activity images (revision 6) — carefully, preserving Firestore compatibility |

## Files to Create

| File | Purpose |
|------|---------||
| `src/lib/components/TestimonialCarousel.svelte` | Horizontal auto-scrolling testimonial carousel |
| `src/lib/components/CoinTicker.svelte` | Slow marquee ticker for coin stats |

## Assets to Move

Move activity images from project root → `/static/events/`:
- `nushafest.png` → `/static/events/nushafest.png`
- `halalkulture.png` → `/static/events/halalkulture.png`
- `bootcamp.png` → `/static/events/bootcamp.png`
- `kopdar.png` → `/static/events/kopdar.png`

## Assets to Create

Coin logo fallbacks in `/static/coins/`:
- `fhe.png`, `umbra.png`, `humanity.png`, `light.png`
- **Strategy**: Create clean branded circular fallback initials (inline SVG rendered as component). Structure code so real PNG/WebP logos can be dropped in later without refactoring — use an `<img>` with `onerror` fallback to initials, or check file existence at render.

---

## Batch 1: Heading Gradients + Card Backgrounds + "Setelah 4 Hari" Differentiation

### Task 1A: Gradient Section Titles

**Target**: All section `<h2>` headings (Authority, Testimonials, USP, Curriculum, Instructors, Pricing, FAQ)

**Changes**:
- Replace `text-white` / `dark:text-white` on h2s with gradient text: `bg-clip-text text-transparent bg-gradient-to-r`
- Dark mode gradient: `from-white via-orange-100 to-orange-300` (subtle warm sheen)
- Light mode gradient: `from-slate-900 via-orange-900 to-orange-700`
- Hero h1 keeps its existing word-highlight treatment (NO change)
- Add utility class `.heading-gradient` in `app.css` for DRY application

### Task 1B: Decorated Card Backgrounds

**Target**: USP cards, Curriculum day cards, Testimonial cards, FAQ expanded items

**Changes** (keep decorations subtle, max ~10-12% opacity):
- **USP cards** (line 552): Add subtle radial gradient glow in top-right (`radial-gradient(circle at 85% 15%, rgba(249,115,22,0.10), transparent 60%)`)
- **Curriculum day cards** (line 807): Add soft `box-shadow: inset 0 1px 0 rgba(249,115,22,0.12)` top highlight
- **Testimonial cards** (line 455–529): Subtle glass-morphism hint — very faint radial glow center
- **FAQ expanded items**: Gradient bg `from-orange-950/15 to-transparent` instead of solid orange

### Task 1C: "Setelah 4 Hari" Outcomes Differentiation

**Target**: Curriculum outcomes sub-section (lines 935–1026)

**Current issue**: Same `bg-slate-50 dark:bg-slate-900` as parent curriculum, visually blends.

**Changes**:
- Wrap outcomes area in distinct container:
  - Background: `bg-slate-900 dark:bg-slate-950` (inverted from parent)
  - Rounded with top gradient border (orange → teal via `bg-gradient-to-r` on a pseudo border)
  - Subtle geometric pattern overlay (very low opacity)
- **6 outcome items** — increased visual weight:
  - Left-border accent in alternating orange/emerald colors
  - Numbered badge (1–6) on each item
  - Slightly larger text + bolder weight
  - Soft glow shadow on cards
  - On light mode: keep readable with inverted contrast

**Post-Batch 1**: Run `npm run build`, summarize changed files.

---

## Batch 2: Premium Activity Proof Section + Coin Ticker Structure

### Task 2A: Premium Storytelling Proof Section (Authority Section)

**Target**: Authority section ("Dibangun dari pengalaman edukasi dan komunitas nyata") — lines 309–376

**Current state**: 4 cards in a 2x2 grid with `image: ''` in defaults. Generic card layout.

**Design Intent**: This section should communicate: *"CryptoSharia is not just a random online class. It comes from real education activities, real community events, and real market/community experience."* — a premium visual proof/storytelling section that breaks away from the typical card grid.

**Changes**:

1. **Move images** to `/static/events/` (only if files exist at project root; report missing ones)
2. **Update `landingContent.ts` defaults** (carefully — Firestore compatibility preserved):
   - `{ title: 'Nushafest 2025', image: '/events/nushafest.png', meta: 'Event 2025', description: '...' }`
   - `{ title: 'Halal Kulture Market 2025', image: '/events/halalkulture.png', ... }`
   - `{ title: 'Bootcamp Crypto Sharia 2025', image: '/events/bootcamp.png', ... }`
   - `{ title: 'Kopdar Crypto Sharia 2025', image: '/events/kopdar.png', ... }`

3. **Layout — Premium alternating storytelling** (NOT a simple grid):

   **Desktop**:
   - Alternating layout: odd items = image left + text right, even items = text left + image right
   - First item (Nushafest) is the featured/strongest: larger image (`aspect-[16/10]`), more prominent title/description, subtle orange glow behind image
   - Items 2–4: slightly smaller images (`aspect-[16/9]`), compact text
   - Large numbered badges (1–4) positioned at the start of each item, semi-transparent (opacity ~15%), large font size (~6xl–8xl)
   - Connecting vertical line/timeline element between items (subtle, orange gradient)
   - Each image: `object-cover`, rounded corners, gradient overlay from bottom (dark → transparent) for text readability
   - Subtle orange/amber glow (radial gradient) behind each image

   **Mobile**:
   - Vertical timeline/story layout
   - Left timeline line with numbered dots
   - Each item: image on top (full width), text below
   - Clean stacked flow, no alternating needed

4. **Visual details**:
   - Dark section background (`bg-slate-950` or `bg-gray-950`)
   - Section title + description at top (keep existing heading + heading-gradient)
   - Badge on each image: event type pill (e.g., "Event 2025") in orange/amber
   - Images with bottom gradient overlay for title readability
   - If image file missing: show a clean dark placeholder with geometric pattern + event title text
   - Subtle Islamic geometric pattern in section background (very low opacity)

**Firestore safety**: `normalizeActivities()` already handles missing/empty images with fallback. Adding default image paths won't break admin-overridden data since normalization preserves non-empty fields.

### Task 2B: Coin Ticker with Logo Structure

**Target**: Hero highlights grid (lines 294–303)

**Confirmed symbols** (from `landingContent.ts` line 221–225): **FHE, UMBRA, HUMANITY, LIGHT**

**Changes**:
1. Create `CoinTicker.svelte` — slow horizontal marquee:
   - Animation: CSS `@keyframes marquee` with `translateX`, duration ~30s (slow, premium)
   - Duplicates items for seamless infinite loop
   - Pause on hover (`:hover` pauses animation)
   - `prefers-reduced-motion`: show static grid layout (current 2x2/4-col) instead of marquee
2. Each coin item:
   - Coin logo area (circular, 28-32px): Try `<img src="/coins/{symbol.toLowerCase()}.png">` with fallback to styled initial letter in a gradient circle
   - Symbol name + performance text
   - Subtle green glow on the percentage number
3. Logo fallback strategy:
   - Code: `<img ... onerror handler or {#if}` that shows a styled `<div>` with first letter + gradient bg
   - When real PNGs are placed in `/static/coins/`, they auto-display without code changes

**Post-Batch 2**: Run `npm run build`, summarize changed files.

---

## Batch 3: Testimonial Carousel + Final Responsive Polish

### Task 3A: Testimonial Carousel

**Target**: Testimonials section (lines 455–529)

**Approach**: Full horizontal carousel (simple, responsive):
- Create `TestimonialCarousel.svelte`:
  - CSS `scroll-snap-type: x mandatory` container
  - Auto-slide via `setInterval` (~5s per slide)
  - Pause on hover / touch interaction
  - Touch-scrollable on mobile (native scroll behavior)
  - Shows: 1 card on mobile, 2 on tablet (md), 3 on desktop (lg)
  - Subtle dot indicators below
  - Smooth transition between slides
- Card design: Keep existing card structure but apply Task 1B's glass-morphism decorations
- No left-right arrow buttons needed (dots + auto-scroll + swipe suffice)

### Task 3B: Layout Variation Polish

Minimal, non-over-engineered layout adjustments:
- **USP section**: Slight size variation — first 2 cards and last 2 cards normal, middle 2 cards slightly wider (span-2 on lg only) to break the uniform grid rhythm
- **General**: Ensure all sections have consistent vertical spacing and the page flows naturally between dark/light backgrounds
- **Mobile final check**: Ensure all new elements (ticker, carousel, activity grid) look clean on 375px width

**Post-Batch 3**: Run `npm run build`, full visual verification via Browser agent on desktop + mobile.

---

## Design Constraints (Strict)

- All existing CTAs, WhatsApp links untouched
- All copywriting preserved (no content text edits)
- Mobile-first responsive — all revisions clean on mobile
- Dark-mode primary aesthetic
- No external JS animation libraries — pure CSS + minimal vanilla JS
- Firestore admin content flow must remain intact
- Do NOT touch auth, admin, payment, routing logic
- Decorative elements: subtle (max ~10-12% opacity)
- Animations: slow, smooth, premium — never distracting
- `prefers-reduced-motion`: all animations disabled, static fallback shown

---

## Verification Plan

**After each batch**:
1. `npm run build` — must pass with zero errors
2. List all modified/created files

**Final verification (after Batch 3)**:
1. **Browser agent**: Start dev server, check desktop (1440px) and mobile (375px) rendering
2. **Dark mode**: Verify gradients/glows render correctly
3. **Carousel**: Auto-slides, pauses on hover, touch-scrollable on mobile
4. **Ticker**: Slow smooth scroll, pauses on hover, static on reduced-motion
5. **Content integrity**: Admin-edited Firestore content still renders (normalization unbroken)
6. **Performance**: No CLS from carousel/ticker loading
7. **Accessibility**: `prefers-reduced-motion` disables all auto-animations