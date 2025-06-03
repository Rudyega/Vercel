

type Props = {
  image?: string | null;
  username: string;
  size?: number; // px
  className?: string;
};

export function UserAvatar({ image, username, size = 40, className = "" }: Props) {
  const fallbackLetter = username[0]?.toUpperCase() || "?";

  return image ? (
    <img
      src={image}
      alt="Аватар"
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
    />
  ) : (
    <div
      className={`bg-[#fbe8cf] text-[#3a2e1c] rounded-full flex items-center justify-center font-semibold ${className}`}
      style={{ width: size, height: size }}
    >
      {fallbackLetter}
    </div>
  );
}
