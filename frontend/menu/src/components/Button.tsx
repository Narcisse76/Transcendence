type ButtonProps = {
  text: string;
  onClick: () => void;
};

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full cursor-pointer rounded bg-yellow-400 p-3 font-bold text-black"
    >
      {text}
    </button>
  );
}
