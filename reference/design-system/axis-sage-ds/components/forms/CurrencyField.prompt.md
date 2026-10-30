Money input with a fused NGN / USD / AED toggle; the selected currency inverts to midnight.

```jsx
<CurrencyField currency="USD" onCurrency={setC} value={amt} onChange={e=>setAmt(e.target.value)} />
```

Styling comes from the brand classes in `styles.css` (css/components.css, css/chrome.css). Square corners, 1px rules, no shadows; one orange element per view.
