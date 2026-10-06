import KeyboardKey from './KeyboardKey';

type CommandRowProps = {
  action: string;
  keyLabel: string;
};

export default function CommandRow({ action, keyLabel }: CommandRowProps) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span>{action}</span>
      <KeyboardKey keyLabel={keyLabel} />
    </li>
  );
}
