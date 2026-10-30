Balance keeps every text block evenly shaped: lines close to the same length, the last at least two-thirds of the longest.

- Nothing to call. Loading the bundle balances p, li, dd, blockquote, td, .t-body and .t-body-l on load, on resize and when content changes.
- Wrap copy that lives in other elements: `<Balance as="span">…</Balance>`.
- Opt out with `data-balance="off"` (for example, code or tabular figures).

```jsx
<Balance as="p" className="t-body-l">We find whether the terms or the moment is in the way.</Balance>
```
