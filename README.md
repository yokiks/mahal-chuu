# Para sa mahal ko 🤍

A buildless, mobile-friendly page for Mahal Chuu. Open `index.html` or serve this directory with `python3 -m http.server 4173`.

## Flow

- Welcome with the approved message and Yes/No buttons.
- Yes reveals the ten supplied photos in order and loads the chosen YouTube song. Slideshow, swipe, previous/next, photo selectors, and pause are available.
- No moves three times within the card. The fourth click reveals the letter respecting her space. Back resets the experience.

Photos keep their full framing. Reduced-motion preferences disable decorative animation and automatic slideshow. No forms, analytics, or response collection are included; clicking Yes/No does not send a notification.

## Music

User-selected source: https://www.youtube.com/watch?v=QOVW18nSa74. Playback uses the visible YouTube embed, loaded only after Yes; some browsers require tapping its Play control. Availability, advertisements, and playback restrictions depend on YouTube and the uploader. No song audio is copied into this repository.

## GitHub Pages

Static files publish from the `main` branch root. `.nojekyll` skips Jekyll processing. All URLs are relative so project Pages paths work. The deployed website and its images are public; `noindex` requests search engines to skip indexing, but is not access control.
