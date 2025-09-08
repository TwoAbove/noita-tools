/* 
TODO planned and discussed
  unshure how to work with badges maybe refactor the alwaysCast from Perk to use Icon with Badge instead background paramenter.
 skipped sizing for now
*/
export const CountBadge = ({text} : {text: String}) => (<div className="bg-white text-black link-black" style={{ 
    fontSize: "0.5rem",
    lineHeight: "0.8rem",
    width: "0.7rem", 
    height: "0.7rem", 
    borderRadius: "50%"
}}>{text}</div>);


export default function BadgesWrapper({ children, badges, size = 1 }: { children: React.ReactNode; badges: React.ReactNode[], size?: number }) {
    if (badges.length <= 0) {
        return <>{children}</>;
    }

    return (
        <div className="position-relative">
          {children}
          <div className="position-absolute" style={{
            top: "-0.2rem",
            right: "-0.2rem",
          }}>{badges}</div>
        </div>
    );
};