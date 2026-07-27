# NOVAHAUS Content Architecture

This directory is the editorial source layer for future case studies, journal articles, resources, testimonials and FAQs.

## Collections

- `case-studies/` — concept and client case study records
- `blog/` — editorial articles
- `resources/` — downloadable guides and tools
- `testimonials/` — approved client quotes when available
- `faqs/` — reusable question and answer content

Each collection contains a `schema.json`. Markdown files use YAML frontmatter followed by the long-form content. The runtime loader lives at `src/lib/content.js` and can be pointed at a headless CMS endpoint later.
