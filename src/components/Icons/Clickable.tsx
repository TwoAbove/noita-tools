import classNames from 'classnames';
import React from 'react';

export interface IClickableProps {
  clicked?: boolean;
  children: React.ReactNode;
}

const Clickable = (props: IClickableProps | any) => {
  const { clicked, children, ...rest } = props;
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { ...rest });
    }
    return child;
  });
  return (
    <div
      className={classNames(clicked && 'border border-3 p-1 flex-shrink-1')}
    >
      {childrenWithProps}
    </div>
  );
};

export default Clickable;
