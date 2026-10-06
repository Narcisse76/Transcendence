type KeyboardKeyProps = {
  keyLabel: string;
};

export default function KeyboardKey({ keyLabel }: KeyboardKeyProps) {
  return (
    <kbd className="rounded border border-gray-500 bg-neutral-900 px-3 py-1 font-[Arial]">
      {keyLabel}
    </kbd>
  );
}
