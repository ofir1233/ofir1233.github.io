# FYI: screen map for the rebrand

Inventory of what exists, what is missing, the tokens as coded, where the new art can enter, what hot pink does to the palette, and the order of work.

Sources read: `work/fyi-scenes.js` (kit `FX.k` and the seven scenes), `work/fyi-live.css` (app styles and tokens), `work/fyi-live.js` (shell, icons, mark), `work/fyi.html` and `work/fyi.css` (case page, formats, token table), the 16 original Figma screens in `/private/tmp/claude-501/fyi-audit/orig/`, and the two direction boards (`pepper.jpg`, `studio-session.jpg`). Every beat of every scene was rendered from `http://localhost:8001/work/fyi.html`; contact sheets are in `/private/tmp/claude-501/fyi-brand/shots/` (`scene-*.png`, `orig-sheet-*.png`, `formats.png`).

## The short answer to the question

The product's own story already has a shape: a private idea, then a crew, then a public night. The art should follow that shape instead of being spread evenly.

- **While people work (thread, tasks, calls, forms): no art.** Black, calm, one colour per role, as today.
- **Where something is about to leave the group (ticket, poster, Promote, formats): the print finish.** Halftone, offset fringe, brush edge, sticker border, pink. One loud object in a quiet thread.
- **Where the product faces someone new (first run, empty states, public pages): the painted world.** The studio, the players, the cat.

Two characters, two sides: the **cat** lives in the studio and belongs to the crew side (empty and waiting states). The **dog in headphones** is "the listener" on the board and belongs to the audience side (RSVP confirmed, a shared work). Neither is the AI. The AI stays the violet knot, a layer and not a character.

One useful finding: four of the five art colours are already in the app. Cobalt is Chat_Blue, violet is the AI, cyan is close to Event_Teal, warm wood is the Copper Hours project colour. **Pink is the only colour the art has and the product lacks.**

---

## 1. The inventory

"Brand today" means visible brand character, not correctness: **none** (generic dark iOS), **colour only** (a role colour or a tint carries it), **a moment** (something only FYI would draw).

File keys: `S` = `work/fyi-scenes.js`, `L` = `work/fyi-live.css`, `J` = `work/fyi-live.js`, `H` = `work/fyi.html`, `C` = `work/fyi.css`, `orig/` = original Figma export.

### First run

| Screen or part | Defined in | State today | Brand today |
|---|---|---|---|
| Welcome | S `origin` → `welcome()`; L `.a-welcome`; mark J `FX.mark` | Coded. Outlined FYI bubble, "Focus Your Ideas" in Bricolage, tagline, blue Continue, teal and plum corner glows | A moment (the only place the mark appears) |
| Welcome, original | `orig/fyi-welcome.webp` | Figma only. Solid white bubble on #151515, blue Continue | A moment (mark only) |
| Splash "Turbocharge Your Creativity" | `orig/fyi-turbocharge.webp` | Figma only. Mark on a teal, blue and red glow | A moment |
| Story pages ×3 | S `origin` → `story()`, `STORY`; L `.a-story`; C `.o1-st` | Coded. Uppercase Bricolage headline over the doodle ground, three dashes, Skip | A moment (doodle and display type) |
| Story pages, original | `orig/fyi-create.webp`, `orig/fyi-collaborate.webp` | Figma only. Mark on black; monster-doodle wallpaper behind "Collaborate through powerful messaging" | A moment (the doodle monsters are the old brand art) |
| Verify phone (SMS) | `orig/fyi-verify.webp` | Figma only, never coded | None |
| Profile setup | S `origin` → `profile()`; L `.a-pg`, `.a-fld`, `.a-tags`; `orig/fyi-profile-nb.webp` | Coded. Monogram from the name, role and skills tags. Original used a photo avatar | Colour only (the person's tint) |
| Pick a crew | S `origin` → `crew()`; L `.a-crew`, `.a-chk` | Coded only. Search, four people with crafts, checks | None |
| New project sheet | S `origin` → `sheet()`; L `.a-sheet`, `.a-colors`, `.g-cu` | Coded only. Name, four colours, crew, generated group mark | Colour only (project colour, mark) |
| First empty thread | S `origin` → `thread()` | Coded. Two system lines on the wallpaper, nothing else | Colour only |

### Chats list

| Screen or part | Defined in | State today | Brand today |
|---|---|---|---|
| Chats list | S `trailer` → `listView()`, `row()`; S `K.lt`; L `.a-lt`, `.a-row`, `.a-srch` | Coded. Large title, search, seven rows, live preview in green | None |
| Chats list, original | `orig/fyi-chats-nb.webp` | Figma only. Rows as cards, photo avatars, blue badges | None |
| Tab bar | S `K.tabbar`; L `.a-tabbar` | Coded: Chats, Projects, Events, Calls, AI. **Only Chats has a screen.** Original order was AI, Calls, Projects, Chats, Settings | None (the AI knot is the one distinct glyph) |
| Unread badge, new-time, pressed row | L `.a-row .bd`, `.tm.new`, `.hi` | Coded as styles; the badge is not used in any scene | Colour only |
| Empty list | not designed | Missing | n/a |

### Thread and message types

| Screen or part | Defined in | State today | Brand today |
|---|---|---|---|
| Thread header with Chat, Tasks, Project tabs | S `K.hd`; L `.a-hd`, `.a-nav`, `.a-seg` | Coded. **Project tab has no screen.** Original had a blue glow behind the header | Colour only |
| Wallpaper | S `K.wall`; L `.fx-wall`, `--doodle` | Coded. Line doodles (stars, notes, smileys) at 5% white, copper wash for the project. Original: dense monster doodles | A moment, and the one element that reads childish |
| Bubble, own and other | S `K.b`; L `.a-b`, `.o`, `.tl` | Coded. Own is blue, others grey with the sender's name in their tint | Colour only |
| Timestamp and read ticks | S `K.tm` | Coded | None |
| Day pill, system line, time-skip pill | S `K.pill`, `K.sys`; S `launch` → `skip()` | Coded | None |
| "64 new messages" divider | L `.a-div` (S `catchup` html) | Coded | Colour only |
| Typing, seen-by row, "3 here now" | S `K.typing`, `K.seen`; S `together` → `here()` | Coded | Colour only (green) |
| Reaction | S `K.rx`; L `.a-rx` | Coded. Drawn flame and heart, no emoji | A moment (small) |
| @AI mention | L `.a-b .at` | Coded | Colour only (violet) |
| Quoted reply, link preview card | `orig/fyi-chat-nb.webp` | Figma only | None |
| Message info (read by, delivered, transcription) | `orig/fyi-message-info-nb.webp` | Figma only. In code it is reduced to the seen row | None |
| Composer | S `K.comp`; L `.a-comp` | Coded. AI knot left, field with plus, mic or send | Colour only (the knot) |
| Keyboard | L `.fx-kb` | Coded as styles (dark iOS) | None |

### Voice

| Screen or part | Defined in | State today | Brand today |
|---|---|---|---|
| Voice bubble | S `K.voice`, `K.wave`; L `.a-voice`, `.a-wave` | Coded. Play, 26 to 30 bars, mono duration | Colour only |
| Transcript | S `K.tr`; L `.a-tr` | Coded. Grey text behind a 1 pt rule, under the bubble | None |
| Recording bar | S `spark` B2 inline; L `.a-rec` | Coded. Red dot, timer, live bars, send | Colour only |
| Recording and recorded preview, original | `orig/fyi-voice-nb.webp`, `orig/fyi-chat-nb.webp` | Figma only. Lock-to-record, trash, preview before send | None |

### Files and media

| Screen or part | Defined in | State today | Brand today |
|---|---|---|---|
| File bubble with upload ring | S `K.file`; L `.a-file` | Coded. "2.1 GB · full size" | Colour only |
| Album (three covers) | S `together` → `album()`; L `.a-album` | Coded | A moment, but it is demo content |
| Cover art A, B, C | S `K.cov`; L `.cov-a/b/c` | Coded as CSS drawings (Horizon, Grooves, Stack) | Content, not brand |
| Attach menu | `orig/fyi-attach-ai-nb.webp` | Figma only: Camera, Media Gallery, Documents, Project, Location, Contact, Giphy, New Task | None |
| Media gallery with filters | `orig/fyi-tasks-nb.webp` (header and chips) | Figma only | None |

### AI

| Screen or part | Defined in | State today | Brand today |
|---|---|---|---|
| AI knot and sparkle | S `K.knot`, `K.spark`; gradient `#fx-ai-g` | Coded. Two crossed orbits that spin while thinking | A moment (the strongest mark in the app after the logo) |
| AI card | S `K.ai`; L `.a-ai` | Coded. Violet hairline, visibility chip. States in S `statics` → `strips.ai`: thinking, streaming, only you, in group, drafted, partial, off | A moment |
| Catch-up pill and card | S `catchup` → `card()`; L `.a-aipill` | Coded. Pill grows into the card | A moment (motion) |
| Source chip, action buttons | S `K.src`; L `.a-src`, `.a-ab` | Coded | Colour only |
| Suggestion strip | S `K.sug`; L `.a-sug` | Coded. Dashed violet outline: plan, task, event | Colour only |
| Draft label in the composer | L `.a-draft` | Coded | Colour only |
| Group answer, plan card, call notes | S `catchup` → `groupCard()`; `trailer` → `aiCard()`; `together` → `notes()` | Coded | Colour only |
| Private AI assistant chat | `orig/fyi-ai-assistant.webp` | Figma only. The AI tab in code has no screen | A moment (knot on empty screen) |

### Tasks

| Screen or part | Defined in | State today | Brand today |
|---|---|---|---|
| Task chip under a message | S `K.chip`; L `.a-chip`, `.st-*` | Coded. Seven states in `strips.task` | Colour only |
| New task sheet | S `task` → `sheet()`, `fld()`; L `.a-fld`, `.a-pchip`, `.a-segc` | Coded. Four fields filled from the message, each with its source | Colour only (violet provenance) |
| Create task, original | `orig/fyi-create-task-nb.webp` | Figma only. Full-screen form | None |
| Tasks tab | S `task` → `tasks()`, `row()`; L `.a-tasks`, `.a-trow` | Coded. In progress, Approved, Finished | Colour only |
| Tasks list, original | `orig/fyi-tasks-nb.webp` | Figma only. Cards with avatars and status pills | None |
| Empty group | L `.a-empty` | Coded. "Nothing here yet" in an outlined box | None |

### Calls

| Screen or part | Defined in | State today | Brand today |
|---|---|---|---|
| Call bar in the thread | S `together` → `callbar()`; L `.a-callbar` | Coded. Green, with Join | Colour only |
| Call screen | S `together` → `call()`, `tile()`; L `.a-call`, `.a-tile`, `.a-pip`, `.a-ctl` | Coded. Monogram tiles on the person's tint, green ring on the speaker, "Notes on" chip | Colour only |
| Shared edit with one playhead | S `together` → `share()`, `strip()`; L `.a-share`, `.a-strip`, `.a-cap` | Coded. Preview, ruler, V1 and A1 tracks, Sync, Clip | A moment (it is the product's best idea on a call) |
| Drawn circle on the shared frame | L `.a-circle` | Coded, in Ines's pink tint | Colour only |
| Call, original | `orig/fyi-call-share-nb.webp` | Figma only. Photo video, Sharing and Sync pills | None |
| Calls tab | not designed | Missing | n/a |

### Votes

| Screen or part | Defined in | State today | Brand today |
|---|---|---|---|
| Poll | S `together` → `poll()`; L `.a-poll` | Coded. Cover thumbnails, blue bars, voter monograms, read receipt | Colour only |

### Events

| Screen or part | Defined in | State today | Brand today |
|---|---|---|---|
| Event ticket | S `K.ticket`, `K.poster`; `launch` → `ticket()`; L `.a-tk`, `.ps` | Coded. Poster, perforation with notches, date block, Going and Maybe | **A moment (the most branded object in the app)** |
| Poster styles | L `.ps`, `[data-ps="ink"]`, `[data-ps="paper"]` | Coded. Splash, Ink, Paper; copper arcs in all three | A moment |
| New event sheet | S `launch` → `evSheet()` | Coded. Drafted from the chat, eight fields, poster style | Colour only |
| Ticket states | S `statics` → `strips.event` | Coded. Draft, Published, Updated, Full, Canceled | Colour only |
| Public badge, RSVP lines, "has started" | L `.a-pub`; S `launch` → `rsvp()`; C `.l6-pulse`, `.l6-ln` | Coded | Colour only (teal; "Live now" is green) |
| Events tab | not designed | Missing | n/a |
| Public event page | exists only as the 200×300 "Link page" thumbnail | Missing as a screen | n/a |
| Shared Events in group info | `orig/fyi-group-nb.webp` (one row) | Figma only | None |

### Promotion formats

| Screen or part | Defined in | State today | Brand today |
|---|---|---|---|
| Promote button | C `.t0-pro`, `.l6-pro` | Coded. **Blue**, although everything else about an event is teal | Colour only |
| Promote sheet | S `launch` → `prSheet()` | Coded. Public switch, link, three format rows | Colour only |
| Format chips, toast | L `.a-fmts`, `.a-toast` | Coded | None |
| Story 9:16, Post 1:1, Link page | H lines 326 to 329; C `.fmt`, `.f-story`, `.f-post`, `.f-link` (lines 465 to 498) | Coded on the page, outside the phone. Bound to the event, "Out of date" until refreshed | A moment (they are FYI's only public face today) |

### Profile, crew, project

| Screen or part | Defined in | State today | Brand today |
|---|---|---|---|
| Avatar | S `K.av`, `K.stack`; L `.a-av` (18, 22, 28, 36, 50, 64, 96) | Coded. Monogram in the person's tint, never a photo | A moment (consistent, recognisable) |
| Group marks | L `.g-cu`, `.g-ll`, `.g-ai` | Coded. Generated geometric marks | A moment |
| Group info | `orig/fyi-group-nb.webp` | Figma only. Message, Audio, Video; **"Public project" switch**; gallery, music, voice notes, documents, links, events, calls | None |
| Own profile, someone's profile, crew page, Project tab, Projects tab | not designed | Missing | n/a |

### System

| Screen or part | Defined in | State today | Brand today |
|---|---|---|---|
| Phone shell, status bar, island, touch dot | J; L `.fx-dev`, `.fx-body`, `.fx-screen`, `.fx-touch` | Coded | None (by design) |
| Sheet, dim, toast, skip pill | L `.a-sheet`, `.a-dim`, `.a-toast`, `.a-skip` | Coded | None |
| Button, switch, check, segmented control, field, person chip, banner | L `.a-btn`, `.a-switch`, `.a-chk`, `.a-segc`, `.a-fld`, `.a-pchip`, `.a-banner` | Coded | Colour only |
| Icons | J `P` and `F` maps (55 glyphs, 24 pt, 1.75 stroke) | Coded | None (iOS manner) |
| Composed frame and state strips | S `statics` → `f1`, `strips` | Coded | Shows the system, adds nothing new |
| App icon, notifications, offline, errors, settings | not designed | Missing | n/a |

**Reading of the inventory.** About 60 parts. Brand "moments" exist in six places: the mark, the doodle ground, the AI knot, the monogram avatars, the ticket with its poster, and the three formats. Everything else is a well-made dark messenger. The four inconsistencies worth fixing during the rebrand: Promote is blue while events are teal; the event pulse is teal while "Live now" is green; five tabs and three in-thread tabs are drawn but only two of the eight have screens; the published token table lists 10 tokens and the code uses about 30.

---

## 2. What is missing for "a social platform for creators"

Today the app is a crew's private workroom with one door to the outside (Promote). The audience has no screen at all. In order of how much each matters to the story:

1. **Public event page** (`fyi/e/copper-hours`), full size, as a guest sees it: poster, title, when and where, RSVP, hosts with roles, who is going, about. States: published, updated, full with waitlist, canceled, live now, ended.
2. **Finished work page** ("the drop"): a released single, visualizer or cover with a player, credits by role, the crew, and the event it belongs to.
3. **Public crew page**: Copper Hours as the audience sees it: mark, members and crafts, works, upcoming and past events, Follow.
4. **Guest RSVP and "your ticket"**: RSVP without an account (name and phone), the confirmed ticket, the reminder, the day-of "Live now" state.
5. **Share a work sheet**: the Promote pattern for a finished piece (public switch, link, formats made from the work).
6. **Public creator profile**: Maya: monogram, role and skills, crews, works, events, Follow, Invite to a project.
7. **Discover**: events near you, new works, creators by craft (the "Search names or crafts" field in the crew picker is the seed).
8. **Following feed**, the audience's home: announcements from crews you follow (event announced, doors moved, work released).
9. **Events tab**: Hosting, Going, Past. The tab exists in `K.tabbar` with no screen.
10. **Announce to the audience**: a host's update to followers and RSVPs (the "Updated" ticket state exists; the screen that sends it does not).
11. **Project tab and Projects tab**: files, covers, final works, the "Public project" switch from the original group info.
12. **Event night and recap**: host's door list, the live state, and the recap afterwards (clip, photos, thanks to those who came).
13. **Activity**: new RSVPs, new followers, changes to events you are going to.

Exists in Figma but not in code, needed for completeness and not for the social story: verify phone, attach menu, media gallery, group info, message info, private AI chat, quoted reply and link preview. Never designed: Calls tab, settings, own profile, app icon, notifications, offline and error states, empty chats list.

---

## 3. The current tokens, exactly

All in `work/fyi-live.css` lines 27 to 43, on `.fx-app, .fx-vars`.

### Colour

| Token | Hex | Role | Name in the page's table |
|---|---|---|---|
| `--bg` | #000000 | Canvas | Dark_1000 |
| `--s0` | #0E0E10 | Bars: header, composer, tab bar, sheets | not listed |
| `--s1` | #1C1C1E | Others' bubbles, cells, cards, fields | Surface_1 |
| `--s2` | #2C2C2E | Raised: pills, composer field, date block, poll rows | not listed |
| `--hl` | #38383A | Hairlines, outlines, the sheet grabber | not listed |
| `--t1` | #FFFFFF | Primary text | Light_1000 |
| `--t2` | #9A9AA0 | Previews, meta, transcripts | Text_2 |
| `--blue` | #0F67F0 | You: own bubbles, primary buttons, unread badge, send | Chat_Blue |
| `--blue-t` | #0A84FF | Blue as text and line: back, links, tab underline, checks, "new" divider | not listed |
| `--green` | #30D158 | Live: presence, typing, speaking, call bar, Finished | Green Active |
| `--ai1` → `--ai2` | #6650F0 → #9638F0 | AI only: knot, hairline (`--ai` is the 135° gradient), caret, bullets | Components Purple |
| `--ai-s` | #121218 | AI card surface | in the spec list only |
| `--ai-t` | #C9B8FF | AI labels, chips, outline actions | AI_Text |
| `--ai-soft` | rgba(150,56,240,.16) | AI chip ground | in the spec list only |
| `--teal` | #34D1BF | Events: month in the date block, Going, Public, the public switch, format ticks | Event_Teal |
| `--teal-ink` | #04201C | Text on teal | not listed |
| `--red` | #FF453A | Recording dot, end call | not listed |
| `--over` | #FF6961 | Overdue | not listed |
| `--amber` | #FFB547 | A missing required field | Needs input |
| `--maya` `--theo` `--ines` `--kofi` `--gray` | #E8B45C, #C3DC6B, #F28DB2, #8EC8F2, #8E8E93 | People, identity only: name, monogram (the tint at 22% over black) | not listed |
| `--cu` `--cu2` `--cu-g` | #E39A5B, #A3532A, #160D08 | Copper Hours cover art, content only | not listed |
| `--cream` `--ink` | #F6EFE6, #0B0B0C | Poster paper and poster ink | not listed |
| `--doodle` | inline SVG, white at 5% | Wallpaper pattern, 180 px tile | not listed |

Hard-coded outside the tokens: call ground #050506, call controls #1A1A1D and #2C2C31, shared edit #101013, selected segment #636366, flame #FF9F43, heart #FF5F7E, audio track #6AA6FF, Join text #032010, keyboard #1C1C1E, #3A3A3D, #262628, Splash poster gradient #0C4842 → #06201D → #3A1C26. Teal is also hard-coded in nine places that a token change would miss: `fyi-scenes.js` lines 1605, 1606, 1722 and 1769; `fyi.css` lines 308, 483, 495, 502 and 503.

Measured contrast today: white on blue 4.98; blue-t on black 5.76, on s1 4.66; teal on black 11.02, on s2 7.31; teal-ink on teal 8.97; green on black 10.39; AI text on AI surface 10.47; t2 on black 7.50, on s1 6.08.

### Type

Three families (`--fxf`, `--fxd`, `--fxm`): **Geist** for the interface, **Bricolage Grotesque** for display, **Geist Mono** for data. Base: 17/22, weight 400, tracking -0.01em, tabular numerals. Sizes are points in a 390 × 844 screen.

| Step | Size/line, weight | Used for |
|---|---|---|
| Large title | 34/41, 700, Geist | "Chats" |
| Welcome headline | 34/36, 700, Bricolage | "Focus Your Ideas" |
| Page title | 30/34, 700, Geist | Onboarding questions |
| Story headline | 30/32, 700, Bricolage, uppercase | Story pages |
| Poster | 22/0.95, 700, Bricolage, uppercase; cover 26/0.86, 800 | Ticket poster, cover C |
| Date block | 20 and 13, 700, Bricolage | "20", "NOV" |
| Body | 17/22, 400 | Bubbles, fields, search |
| Headline | 17/22, 600 | Names, nav title, sheet title, primary button |
| AI body | 16/22, 400 | AI card |
| Secondary | 15/20, 400 to 600 | Previews, transcript, task titles, Going and Maybe |
| Action | 14, 600 | AI actions, toast, call pills |
| Label | 13/16, 500 and 600 | Sender names, in-thread tabs, chips, system lines (the most used style: 19 rules) |
| Meta | 12/15, 500 and 600 | Timestamps, visibility chips, source chips |
| Data | 12/15 and 11/14, 400, Geist Mono | Durations, file size, timecode |
| Tab label, badge | 11/13, 500; 11, 600 | Tab bar, count badges |

### Radius

Effective scale: **6, 10, 12, 14, 16, 18, pill, circle.**

| Radius | Used for |
|---|---|
| 2 to 3 | Bars: waveform, dashes, underline, grabber |
| 6 | Bubble tail corner, keyboard key, mention |
| 8 | Small chips: visibility, source, Public, name label on a tile |
| 9 to 10 | Task chip, segmented control, search, file thumb, poll row, date block |
| 12 | Fields, task rows, suggestion strip, banner, empty box |
| 14 | Primary button (50 tall), sheet top corners, call bar, picture-in-picture |
| 16 | AI card, ticket, poll, album |
| 18 | Bubbles, composer field |
| Pill (half the height) | 26, 28, 32, 36, 38, 40 tall controls |
| 20 and 26 | Call tile; call control tray |
| 30% | Group marks (squircle) |
| 50% | Avatars, round buttons, checks |
| 56 and 70 | Screen; device body |

Strays to clean up: 5, 7, 11, 13, 15, 17, 19 (one or two uses each, mostly a pill written as a number).

Control heights: 28 chip, 32 action pill, 36 composer and search, 40 toast and poll row, 46 call button, 50 primary button, 74 list row. Bars: header 47 + 56 + 36, composer 86, tab bar 83. Thread gutter 12, list and sheet gutter 16.

---

## 4. Where the new art could enter

Rules first, so every screen below is an application and not a new decision.

1. **Art density follows the journey**: none while working, print finish on what goes public, painted scenes where the product meets someone new.
2. **The creators' art outranks FYI's art.** On a ticket, a format or a public page, the crew's cover is the hero. FYI's painting appears only as a default (no cover yet) or in an empty state. FYI's presence on creators' pages is the finish and a sticker-bordered mark.
3. **The cat appears at most once on any path**: an empty chat, an empty list, an offline screen. It never speaks, never points, never stands for the AI.
4. **Painted images always sit on black with a scrim under text**; text never sits on unscrimmed painting (the boards are too busy for 4.5:1).
5. **The texture kit is five things**: halftone dots, a 1 to 2 px cyan and magenta offset, a brush-torn edge, a white die-cut sticker border, and pink. All five can be CSS (radial-gradient dots, two text-shadows, an SVG mask, a box-shadow ring).

Marks: **(a)** an art asset is needed, **(b)** CSS and texture only, **(c)** no art.

| Area | The one way the art appears | Mark | Where it must not appear |
|---|---|---|---|
| First run | **Welcome**: "What the phone sees" (the wide-angle frame, the thumb reaching for the glass) full bleed, a black scrim over the lower 45%, the white mark, the headline, a white Continue. It replaces the teal and plum glows. The three story pages each take one crop the same way: one player close, the session, the listener | (a) four crops | Verify phone, profile, crew picker, new project sheet: forms stay plain black |
| Chats list | **Empty list only**: the cat asleep on the flight case, 160 px wide, above "Start a project". Gone once one chat exists | (a) | Rows, large title, search, tab bar. No texture on avatars |
| Thread and messages | **Empty chat**: the cat's two eyes over the top edge of the composer, 96 px wide, a waveform reflected in them; they drop away on the first message. The wallpaper changes from doodles to a halftone dot field at the same 5% white (this is a system change, see System) | (a) one small asset | Bubbles, header, composer, day pills, system lines, reactions. Nothing painted behind text people read all day |
| Voice | None. The link to the art is formal: the waveform in the paintings is the same bar waveform as `K.wave` | (c) | Recording bar and bubbles. A pink waveform here would give pink a second meaning |
| Files and media | None. Covers and albums are the crew's own work | (c) | Thumbnails, upload ring, gallery |
| AI | None. The violet knot stays the only AI mark | (c) | The cat is never the assistant; no painting in AI cards, fields or the private AI chat |
| Tasks | **Once per project**: when the last task is finished, a "All done" sticker (white die-cut border, pink ground, turned 4°) sits on the Finished header until the tab is left | (b) | Task rows, chips, the new task sheet, every field |
| Calls | **Camera-off tiles**: the flat tint becomes a halftone field in the person's tint, dots growing toward the bottom. Texture, not a picture | (b) | Controls, the shared edit, the timeline, captions |
| Votes | **Closed poll only**: the winning row gets a sticker-bordered "Picked" label | (b) | Open polls, bars, voter stacks |
| Events | **The ticket's poster takes the print finish**: halftone over the poster ground, a 1.5 px cyan and magenta offset on the poster title, a brush-torn lower edge where the perforation sits now. Going, Public and the month turn pink. A fourth poster style, "Studio", uses a painted backplate when the crew has no cover | (b); the Studio style is (a) | The new event sheet and its fields; the ticket's stub text; RSVP lines |
| Promotion formats | **Full strength.** Story, Post and Link page are the public face: full print finish, pink RSVP, and the FYI mark as a small sticker in a corner ("RSVP on FYI"). The crew's cover stays the picture | (b) | The Promote sheet itself: rows, switch and link stay plain |
| Profile, crew, project | **Public profile and crew page headers**: a halftone banner in the person's or project's tint with the monogram or group mark as a die-cut sticker overlapping its lower edge. Private profile setup stays plain | (b) | Role and skills fields, member lists, settings |
| System | **App icon and launch screen**: the mark in white on pink with a cyan offset (alternative: the cat's eye with the waveform). **Wallpaper**: `--doodle` becomes a halftone tile. **Offline**: the cat sitting on an unplugged cable, 120 px | icon and offline (a); wallpaper (b) | Sheets, toasts, keyboard, switches, checks, segmented controls, notifications |

New public screens (section 2), in the same terms: the public event page and the work page carry the crew's cover with the print finish and a pink RSVP or Play (b), with a painted default when there is no cover (a). The guest's confirmed ticket shows the dog in headphones, 140 px, once (a). Discover uses one painted header band and plain cards below it (a).

Asset count for the whole plan: about ten paintings (four first-run crops, cat eyes, cat asleep, cat offline, the dog, one default poster backplate, one discover band) plus the icon. Everything else is CSS.

---

## 5. A proposed token change: hot pink #FF2E93

Relative luminance of #FF2E93 is 0.253. Computed with the WCAG formula:

| Pair | Ratio | Verdict |
|---|---|---|
| Pink on #000000 | 6.06 | Passes for text |
| Pink on `--s0` #0E0E10 | 5.57 | Passes |
| Pink on `--s1` #1C1C1E | 4.91 | Passes, narrowly |
| Pink on `--s2` #2C2C2E | 4.02 | **Fails for small text** (the month in the date block sits here) |
| Pink on `--ai-s` #121218 | 5.39 | Passes |
| White on pink | 3.46 | **Fails for body text.** Only large text (24 px, or 19 px bold) and icons |
| White at 72% on pink (timestamps in a bubble) | 2.35 | Fails |
| Black on pink | 6.06 | Passes |
| #1A000D on pink | 5.78 | Passes |
| Pink against red #FF453A | 1.02 | Same lightness; told apart by hue alone |
| Pink against Ines's tint #F28DB2 | 1.52 | Same hue family: a real collision |
| Pink against the heart #FF5F7E | 1.19 | Collision, minor |
| Pink against blue #0F67F0, violet #9638F0 | 1.44, 1.47 | Distinct by hue |

So pink behaves like teal and green, not like blue: **as a fill it needs dark text**. Three supporting tokens follow the pattern the system already uses (`--blue` and `--blue-t`, `--ai2` and `--ai-t`, `--teal` and `--teal-ink`):

| New token | Value | Use | Ratio |
|---|---|---|---|
| `--pink` | #FF2E93 | Fills, and text on black or s0 | above |
| `--pink-ink` | #1A000D | Text on a pink fill | 5.78 |
| `--pink-t` | #FF8CC2 | Pink text on raised surfaces | 9.78 on black, 7.93 on s1, 6.49 on s2 |
| `--pink-soft` | rgba(255,46,147,.16) | Chip ground | pink-t on it: 8.60 over black, 6.71 over s1 |
| `--fringe` | #22D3EE | The cyan half of the offset, texture only | 11.62 on black |

Either way, **Ines's tint must move** off pink (to an apricot or a mint, to be tested against the other three), and the heart reaction should move toward red.

### Option 1, minimal: pink is the brand and the public colour

Pink takes a new, single meaning: **"this goes out"**. It takes over the event role from teal and adds the brand moments.

- **Blue**: unchanged. Still "you". It is also the cobalt of the paintings.
- **Violet**: unchanged, AI only.
- **Teal**: retired as a role. The hue survives as `--fringe`, the cyan in the print offset, and is never used for meaning.
- **Green**: unchanged, live. The event pulse (`.l6-pulse`) moves from teal to green so that "live" has one colour.
- **Pink gets**: the month in the date block (as `--pink-t`), Going, Public, the public switch, format ticks, the Promote button (today blue, which was already inconsistent), RSVP on the formats and the link page, the stickers, the app icon.

What it breaks:
- The page's story "teal for events" and its token table (`fyi.html` lines 381 and 393) must be rewritten.
- Teal is used in 7 rules in `fyi-live.css` (`.a-go`, `.a-pub`, `.a-switch.on`, `.a-btn.tl`, `.a-fmts .i`, `.a-up`, `.a-tk .db b`), 2 in `fyi.css` (`.l6-pulse`, `.l6-pr.on .l6-sw`) and hard-coded in the nine places listed in section 3.
- The Splash poster's teal and plum ground no longer matches its own buttons; the default poster needs a new ground (black to cobalt, with pink).
- Pink and red now meet in two places: an overdue task beside an event chip, and End call during an event. Neither shares a control, so it holds.
- A crew whose project colour is Rose (`#C98A9A` in the new project sheet) will sit close to the brand colour; drop or shift that swatch.

### Option 2, bold: pink replaces blue as "you"

Pink takes own bubbles, primary buttons, unread badges, send, and the `--blue-t` jobs (back, links, tab underline, checks).

- **Blue**: retired from the interface, or kept only as cobalt in art. Links need a new treatment.
- **Violet**: kept for AI, but it now sits one step along the wheel from the dominant colour; "violet only where AI acted" becomes harder to read at a glance, most of all in the composer, where the knot sits beside a pink send button.
- **Teal**: stays for events, because pink can no longer mean "public". Or retire it and lose the event colour.
- **Green**: unchanged.

What it breaks:
- **Legibility.** White 17/22 on pink is 3.46 and its timestamp is 2.35. Either own bubbles carry black text (6.06, a different, sticker-like product) or pink is darkened to about #D6106F (white 5.04), which is no longer the neon in the paintings and drops to 4.16 on black.
- **Calm.** A thread is mostly your own messages, voice notes, files and albums. All of them turn hot pink. This is the opposite of "the tool stays calm".
- **Meaning.** When the brand colour is on every bubble it can no longer mark the moment something goes public. The loud object in the quiet thread stops being loud.
- **Red.** The recording dot, End call and Overdue sit beside pink controls at the same lightness (1.02). Recording, where the dot is the only signal, is the worst case.
- **Scope.** Every scene, the eight-item spec, the state strips, the hard-coded blues (`.a-poll .bar`, `.a-div`, the audio track #6AA6FF, the task indicator) and the page's headline "Chat_Blue is for you" change.

**Recommendation: option 1.** It gives pink a job the product needs and does not have (a colour for "public"), it keeps the paintings' cobalt alive as "you", and it costs one role swap instead of a re-skin.

---

## 6. The order of work

**Step 0, before any screen (one sitting):** add the five pink tokens, build the texture kit as four utility classes (halftone, offset, torn edge, sticker), swap `--doodle` for the halftone tile, move Ines's tint. Nothing visible changes in the working thread except the wallpaper.

**The proof: three screens, chosen as the two ends and the hinge of the journey.**

1. **Welcome** (S `origin` → `welcome()`). The first thing anyone sees and the only screen that is pure brand. It tests the painted world behind real interface text: the crop, the scrim, the mark, a white button. Low risk, no role colours involved.
2. **The event ticket in the thread, with Promote** (S `launch` beats 3 to 5: `ticket()`, `prSheet()`, the format chips). The hinge. It tests the hardest claim: that a calm black thread can hold one pink, printed object without the rest of the tool changing. It also settles pink's role and the teal retirement in real context.
3. **The public event page** (new; today a 200×300 thumbnail). The other end: the audience's first screen, at full print finish, with the crew's cover as the hero and FYI as a sticker. It is the most important missing screen and the proof that the product is more than a messenger.

If these three hold together side by side, every other screen is an interpolation between them. A cheap rider to the proof: the empty-chat cat, because it tests whether the humour survives at 96 px.

**Then, in groups:**

- **A. Rest of first run**: three story pages, then verify, profile, crew, new project as plain forms (checked only for colour).
- **B. Rest of the event system**: new event sheet, the five ticket states, RSVP lines, the three formats, the "Studio" default poster, the Events tab.
- **C. The public side**: work page and share-a-work sheet, crew page, creator profile, guest RSVP and ticket (the dog), then Discover and the following feed.
- **D. The working tool, as an audit, not a redesign**: chats list, thread, voice, files, AI, tasks, calls, polls. The job is to confirm no pink leaked in, then add the four small moments: empty list, "All done", halftone call tiles, "Picked".
- **E. System**: app icon and launch screen, offline, notifications, and the drawn-but-empty tabs (Projects, Calls, AI, Project).
- **F. The case study page**: token table, the "Each color has one role" chapter, the type and radius scale, and new state strips for the public screens.
