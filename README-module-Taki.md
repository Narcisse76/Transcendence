# Module Taki

**Contributor:** `oettaqi`

| Module | Type / points | Why | How |
| --- | --- | --- | --- |
| Frontend framework | Minor / 1 | Give players a menu before entering the FPS. | React and TypeScript screens styled with Tailwind CSS. |
| Custom design system | Minor / 1 | Keep the menu consistent and reuse UI elements. | Shared buttons, inputs, language and avatar selectors, accordion and controls components. |
| Multiple languages | Minor / 1 | Let players choose their language. | French, English and Spanish texts, a language selector and a saved profile preference. |
| User management and authentication | Major / 2 | Let players keep their account and profile. | Express API routes, salted scrypt password hashes, HttpOnly session cookies and profile editing/deletion. |
| Database ORM | Minor / 1 | Keep database operations simple. | Drizzle reads and updates accounts in SQLite. |

These are the subject's module values, not a confirmed score. Remaining requirements: avatar upload, friends and online status for User Management; at least 10 reusable components for the design system (currently 7 shared components); translation of remaining account screens and game text for languages.
