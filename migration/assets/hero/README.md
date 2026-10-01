# Homepage hero artwork

"Sunset on Lagos skyline" by Chibuzo Nwaneri, Unsplash License — https://unsplash.com/photos/gE3ign9Lx1Q

Place the two approved crops here before running `pnpm sanity:seed --apply`:

| File | Size | Used for |
| --- | --- | --- |
| `lagos-sunset-desktop-3200x1800.jpg` | 3200×1800 landscape | `homePageV2.desktopHeroImage` |
| `lagos-sunset-mobile-1200x1800.jpg` | 1200×1800 portrait | `homePageV2.mobileHeroImage` |

The seeder uploads them as Sanity image assets and checks their dimensions and orientation. It refuses to publish the
homepage without both.
