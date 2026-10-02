type AvatarOptionProps = {
  avatarId: string;
  avatarLabel: string;
  selectedAvatar: string;
  setSelectedAvatar: (newAvatar: string) => void;
};

export default function AvatarOption({
  avatarId,
  avatarLabel,
  selectedAvatar,
  setSelectedAvatar,
}: AvatarOptionProps) {
  let borderColor = 'border-gray-500';

  if (selectedAvatar === avatarId) {
    borderColor = 'border-yellow-400';
  }

  return (
    <button
      type="button"
      onClick={() => setSelectedAvatar(avatarId)}
      aria-pressed={selectedAvatar === avatarId}
      className={`cursor-pointer rounded-full border-2 p-3 ${borderColor}`}
    >
      <img
        src={`/avatars/${avatarId}.svg`}
        alt={avatarLabel}
        className="h-8 w-8"
      />
    </button>
  );
}
