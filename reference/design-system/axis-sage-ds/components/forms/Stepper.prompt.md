Tool step indicator (done midnight, current orange) and a thin ProgressBar.

```jsx
<Stepper steps={["The action","Terms","Moments","Result"]} active={1} />
<ProgressBar label="QUESTION 4 OF 12" value={33} />
```

Styling comes from the brand classes in `styles.css` (css/components.css, css/chrome.css). Square corners, 1px rules, no shadows; one orange element per view.
