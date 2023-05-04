import { FC } from "react";
import ReactSlider from "react-slider";

import "./styles.css";

interface IDoubleSliderProps {
  min: number;
  max: number;
  value: [number, number];

  disabled?: boolean;
  minDistance?: number;

  onChange: (value: [number, number]) => void;
}
const DoubleSlider: FC<IDoubleSliderProps> = ({ min, max, value, disabled, minDistance, onChange }) => {
  return (
    <ReactSlider
      min={min}
      max={max}
      value={value}
      disabled={disabled}
      className="horizontal-slider"
      thumbClassName="slider-thumb"
      trackClassName="slider-track"
      defaultValue={[0, 100]}
      ariaLabel={["Lower thumb", "Upper thumb"]}
      ariaValuetext={state => `Thumb value ${state.valueNow}`}
      // renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
      pearling
      minDistance={minDistance || 10}
      onChange={onChange}
    />
  );
};

export default DoubleSlider;
