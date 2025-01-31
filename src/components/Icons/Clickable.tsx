import classNames from "classnames";
import React, { useState } from "react";

export interface IClickableProps {
  clicked?: boolean;
  useHover?: boolean;
  wikiUrl?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Clickable = (props: IClickableProps) => {
  const { clicked, useHover, children, onClick, wikiUrl, ...rest } = props;
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Left click should always trigger onClick and prevent link
    if (e.button === 0) {
      e.preventDefault();
      e.stopPropagation();
      if (onClick) {
        onClick();
      }
    }
  };

  const clickedOrHoveredStyle = clicked ? "bg-info" : hovered ? "bg-light" : "";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: "0.1s",
        position: "relative",
        display: "flex",
        padding: "0.2rem",
      }}
      className={classNames(clickedOrHoveredStyle, "p-1 rounded-1")}
    >
      {wikiUrl ? (
        <a
          href={wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          style={{
            textDecoration: "none",
            color: "inherit",
            flex: 1,
          }}
        >
          {children}
        </a>
      ) : (
        <div
          onClick={handleClick}
          style={{
            flex: 1,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Clickable;
