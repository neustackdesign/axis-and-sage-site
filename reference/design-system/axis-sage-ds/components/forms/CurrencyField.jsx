import React from "react";
/** CurrencyField: NGN / USD / AED mono toggle fused to a numeric control. */
export function CurrencyField({ currencies = ["NGN", "USD", "AED"], currency, onCurrency = () => {}, value, onChange, placeholder = "0" }) {
  return (
    <div className="currency-field">
      <div className="currency-toggle">{currencies.map((c) => <button key={c} type="button" aria-pressed={currency === c} onClick={() => onCurrency(c)}>{c}</button>)}</div>
      <input className="field-control" style={{ borderBottom: 0, fontFamily: "var(--font-mono)" }} inputMode="decimal" value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}
