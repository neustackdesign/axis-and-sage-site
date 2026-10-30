import React from "react";
/** SliderField: label + mono value, orange-accent range, paired numeric input, mono scale ends. */
export function SliderField({ label, value, min = 0, max = 100, step = 1, suffix = "", onChange = () => {} }) {
  return (
    <div className="slider-field">
      <div className="slider-head"><span className="field-label">{label}</span><span className="slider-value">{value}{suffix}</span></div>
      <div className="slider-row">
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
        <input className="field-control" type="number" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      </div>
      <div className="slider-scale t-label"><span>{min}{suffix}</span><span>{max}{suffix}</span></div>
    </div>
  );
}
