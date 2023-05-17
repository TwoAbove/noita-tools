import classNames from "classnames";
import React, { useState } from "react";

export interface IClickableProps {
  clicked?: boolean;
  useHover?: boolean;
  children: React.ReactNode;
}

const Clickable = (props: IClickableProps | any) => {
  const { clicked, useHover, children, onClick, ...rest } = props;
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { ...rest });
    }
    return child;
  });
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = e => {
    setHovered(true);
  };

  const handleMouseLeave = e => {
    setHovered(false);
  };

  // Clicked-style is prioritized, then hovered-style, otherwise fallback to default style.
  const clickedOrHoveredStyle = clicked ? "bg-info" : hovered ? "bg-light" : "bg-body";

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: "pointer",
        transition: "0.1s",
      }}
      onClick={e => {
        if (onClick) {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }
      }}
      className={classNames(clickedOrHoveredStyle, "p-1 rounded-1")}
    >
      {childrenWithProps}
    </div>
  );
};

export default Clickable;
