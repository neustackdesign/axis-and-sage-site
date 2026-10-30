Mono uppercase pill tag for roles and conversion actions; becomes a filter toggle when given onClick.

```jsx
<Chip label="FOUNDED" />
<Chip label="CUSTOMERS BUY" kind="conversion" />
<ChipRow chips={[{label:"BUILT",kind:"role"}]} />
```

Styling comes from the brand classes in `styles.css` (css/components.css, css/chrome.css). Square corners, 1px rules, no shadows; one orange element per view.
