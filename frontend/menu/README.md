# Menu

Independent React and TypeScript frontend. Requires Node.js 22.12 or newer.

From this directory:

```sh
npm install
npm run dev
```

Run `npm run build` to check TypeScript and build the interface.

The home screen contains a nickname input, language selector, four avatars and
expandable game rules. The Controls button opens a QWERTY-only reference screen.
Returning home preserves the nickname, language and avatar in React state.
The menu does not start the game or send player information to a server.

Reading order:

1. `src/App.tsx`: owns the nickname, language, avatar and screen states with `useState`.
2. `src/HomeScreen.tsx`: receives the state and arranges the page.
3. `src/components/TextInput.tsx`: displays a labelled input and reports changes.
4. `src/main.tsx`: mounts React inside the HTML root element.
5. Tailwind classes in the components style the page; `src/index.css` only imports Tailwind.

`src/translations.ts` holds the French, English and Spanish texts.
`src/components/LanguageSelector.tsx` displays the three language buttons.
`src/CommandsScreen.tsx` displays the QWERTY controls using `CommandRow` and `KeyboardKey`.
`src/components/Button.tsx` is shared by the Controls and Back to menu buttons.
