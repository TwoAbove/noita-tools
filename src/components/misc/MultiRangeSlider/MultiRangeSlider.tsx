import { FC, useCallback } from "react";
import ReactSlider from "react-slider";

import "./styles.css";

interface IDoubleSliderProps {
  min: number;
  max: number;
  value: [number, number];
  step?: number;
  disabled?: boolean;
  minDistance?: number;
  onChange: (value: [number, number]) => void;
}

const DoubleSlider: FC<IDoubleSliderProps> = ({ min, max, value, step, disabled, minDistance, onChange }) => {
  const toSliderValue = useCallback((val: number) => Math.round(((val - min) / (max - min)) * 100), [min, max]);
  const fromSliderValue = useCallback((val: number) => min + ((max - min) * val) / 100, [min, max]);

  const sliderValue: [number, number] = [toSliderValue(value[0]), toSliderValue(value[1])];

  return (
    <ReactSlider
      min={0}
      max={100}
      value={sliderValue}
      step={1}
      disabled={disabled}
      className="horizontal-slider"
      thumbClassName="slider-thumb"
      trackClassName="slider-track"
      pearling
      minDistance={minDistance || 1}
      onChange={vals => {
        const realVals: [number, number] = [fromSliderValue(vals[0]), fromSliderValue(vals[1])];
        if (step) {
          realVals[0] = Math.round(realVals[0] / step) * step;
          realVals[1] = Math.round(realVals[1] / step) * step;
        }
        onChange(realVals);
      }}
    />
  );
};

export default DoubleSlider;
