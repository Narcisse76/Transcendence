type TextInputProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  setPseudo: (value: string) => void;
};

export default function TextInput({
  id,
  label,
  placeholder,
  value,
  setPseudo,
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <input
        className="rounded border border-gray-500 bg-neutral-900 p-3"
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => setPseudo(event.target.value)}
      />
    </div>
  );
}
