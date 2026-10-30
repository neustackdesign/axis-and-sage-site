Form field (input / textarea / select) with medium label, underline-only control and help/error line.

```jsx
<Field label="Work email" type="email" placeholder="you@company.com" />
<Field label="Message" as="textarea" state="error" help="Tell us who needs to act." />
```

Styling comes from the brand classes in `styles.css` (css/components.css, css/chrome.css). Square corners, 1px rules, no shadows; one orange element per view.
