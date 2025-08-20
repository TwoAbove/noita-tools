import React, { FC } from 'react';
import { Button } from "react-bootstrap";

interface IRerollPaneProps {
  handleRerollUndo?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  loaded: boolean;
  advanced: boolean;
  rerollsForLevel: number;
  nextRerollPrices: number; // In advanced view, this is a direct number. In simple, it might be calculated differently or not shown.
  rerollsToFavorite?: number;
  favoritesInNextReroll?: number;

  handleReroll: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleLoad: () => void; // Specific to advanced view for loading a row.
}

const RerollPane: FC<IRerollPaneProps> = (props) => {
  const {
    handleRerollUndo,
    rerollsToFavorite,
    favoritesInNextReroll,
    loaded,
    advanced,
    rerollsForLevel,
    nextRerollPrices,
    handleReroll,
    handleLoad,
  } = props;

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '3.5rem' }}> {/* Added align-items-center and minHeight for consistency */}
      {!loaded && advanced ? (
        <Button className="mx-auto" onClick={handleLoad} size="sm">
          Load
        </Button>
      ) : (
        <>
          {handleRerollUndo && !advanced && ( // Only show undo if handler exists and not in advanced mode
            <Button variant="outline-primary" onClick={handleRerollUndo} size="sm" disabled={!rerollsForLevel}>
              {"<"}
            </Button>
          )}
          {/*Spacer for when undo is not shown in advanced to keep elements aligned if needed, or adjust styling */}
          {/* {!handleRerollUndo || advanced && <div style={{width: '2.125rem'}}></div>}  */}
          {advanced && <div className="me-1">Next: {nextRerollPrices}</div>} {/* In advanced, show price if applicable */}
          <span className="m-2">{rerollsForLevel || 0}</span>
          <Button variant="outline-primary" onClick={handleReroll} size="sm">
            <div className="position-relative">
              {">"}
              {rerollsToFavorite && (
                <div className="position-absolute top-0 start-100 text-info translate-middle">
                  {rerollsToFavorite || ""}
                </div>
              )}
            </div>
          </Button>
        </>
      )}
    </div>
  );
};

export default RerollPane;
export type { IRerollPaneProps };
