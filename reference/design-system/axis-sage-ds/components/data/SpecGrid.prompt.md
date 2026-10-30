Ruled grid of spec cells (mono label top, sans value bottom); SpecList is the numbered-row variant.

```jsx
<SpecGrid cols={4} cells={[{label:"TIME",value:"10 working days",index:"01"}]} />
<SpecList items={["…"]} />
```

Styling comes from the brand classes in `styles.css` (css/components.css, css/chrome.css). Square corners, 1px rules, no shadows; one orange element per view.
