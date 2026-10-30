Ribbons: the logomark's two waves, cropped large.

- The parent needs `position: relative` and `overflow: hidden`. Put text in a sibling with `position: relative`.
- Colour ribbons sit on Midnight. On Cloud, use `tone="outline"` or `tone="quiet"`.
- One ribbon field per view. Keep type in the clear area, away from the waves.
- `tone="outline"` draws the waves as dotted lines, matching the dot-matrix glyphs. It sits behind the site footer.

```jsx
<section className="tone-midnight" style={{ position: "relative", overflow: "hidden", aspectRatio: "16/9" }}>
  <Ribbons crop="cover" />
  <h1 className="t-poster" style={{ position: "relative" }}>Brand guidelines</h1>
</section>
```
