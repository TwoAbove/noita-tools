export const CountBadge = ({ text }: { text: String }) => (
  <div
    className="text-body"
    style={{
      fontSize: "0.5rem",
      lineHeight: "0.8rem",
      width: "0.7rem",
      height: "0.7rem",
    }}
  >
    {text}
  </div>
);

export default function BadgesWrapper({
  children,
  badges,
  size = 1,
}: {
  children: React.ReactNode;
  badges: React.ReactNode[];
  size?: number;
}) {
  if (badges.length <= 0) {
    return <>{children}</>;
  }

  return (
    <div className="position-relative">
      {children}
      <div
        className="position-absolute"
        style={{
          top: "-0.2rem",
          right: "-0.2rem",
        }}
      >
        {badges}
      </div>
    </div>
  );
}
