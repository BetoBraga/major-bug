# Major Bug

Weekly AI and tech magazine. GitHub Pages publishes `docs/` from `main`.

- English PDFs: `docs/en/issues/YYYY-MM-DD.pdf`
- Brazilian Portuguese PDFs: `docs/pt-br/issues/YYYY-MM-DD.pdf`
- Add the date and localized title to `issues.json` next to each language's index. Submit both editions and email copy in one weekly pull request. Merge on editorial approval.
- The root uses a country-level IP lookup to choose the landing page. Only a confirmed BR response redirects to Portuguese. English is the default. Both language pages have direct links.
- Configure the hosted newsletter sign-up URLs in `docs/newsletter.json`. Keep subscribers and credentials in the mailing provider. Once Pages serves both PDFs, send the approved copy with the corresponding public edition URLs.
