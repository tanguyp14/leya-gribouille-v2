# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shopify theme for **leya-gribouille.myshopify.com**, built on the **Tinker theme (v3.5.1)** by Shopify. The store sells puzzles, toys, games, and apparel.

## Development Commands

Start the development server:
```bash
shopify theme dev --store leya-gribouille.myshopify.com
```

This launches a local preview with live-reload at the URL provided by the CLI.

No build process or test suite is currently configured.

## Architecture

### Shopify Theme Structure (Online Store 2.0)

- **layout/** — `theme.liquid` is the main HTML shell; `password.liquid` for maintenance mode
- **templates/** — JSON-based page templates that define which sections appear on each page type (product, collection, index, etc.)
- **sections/** — Page-level components configured via Shopify's theme editor
- **blocks/** — Reusable sub-components used within sections (93 files). Prefixed with `_` for internal/private blocks not shown in theme editor
- **snippets/** — Liquid partials included via `{% render %}` (107 files)
- **assets/** — CSS, JavaScript modules, and static assets (115 files)
- **config/** — `settings_schema.json` (theme editor schema) and `settings_data.json` (active theme values)
- **locales/** — 53 translation files (default: English)

### Key Rendering Flow

`theme.liquid` → renders snippets for meta-tags, stylesheets, fonts, scripts, theme-styles-variables, color-schemes → `{% sections 'header-group' %}` and footer → `{{ content_for_layout }}` renders the active template

Templates are JSON files that compose sections with nested blocks.

### JavaScript Architecture

Modular JS files in `assets/` — no bundler, each file loaded independently by Shopify.

**Key pattern:** Component-based architecture using custom base class (`component.js`):
- Custom web components extending `Component` or `DeclarativeShadowElement`
- Declarative Shadow DOM for style isolation
- Ref-based element tracking via `ref` attributes
- Mutation observers for dynamic DOM updates

**Important modules:**
- `component.js` — Base class for all custom elements
- `utilities.js` — Core helpers (header calculations, money formatting, debounce, view transitions)
- `facets.js` — Product filtering system (largest JS file)
- `variant-picker.js` — Product variant selection
- `cart-drawer.js` — Shopping cart drawer UI
- `section-renderer.js` — Dynamic section rendering (Section Rendering API)
- `theme-editor.js` — Live preview hooks for theme editor

### Template Patterns

All templates follow JSON schema:
```json
{
  "sections": {
    "section-id": {
      "type": "section-name",
      "blocks": { /* nested block instances */ },
      "settings": { /* section-level config */ }
    }
  },
  "order": ["section-id-1", "section-id-2"]
}
```

Blocks can be nested within sections, marked `"static": true` (can't be removed), or `"disabled": true` (hidden).

### Theming System

- **7 configurable color schemes** (`scheme-1` through `scheme-7`) defined in `settings_schema.json`
- **CSS custom properties** — All theme values exposed as `--color-*`, `--font-*` variables
- **Color scheme snippet** — `snippets/color-schemes.liquid` generates CSS from settings
- **Typography presets** — H1-H6 with customizable font, size, line-height, letter-spacing, case

### Performance Patterns

- **Inline header height calculations** — In `theme.liquid` to prevent layout shift (CLS)
- **View Transitions API** — Smooth page navigation via `view-transitions.js`
- **Lazy loading** — Deferred image loading via `lazy-load-images.js`
- **requestIdleCallback** — Non-critical initialization deferred to browser idle time
- **Section Rendering API** — Re-render sections without full page reload

## Conventions

- Templates use JSON format (Shopify Online Store 2.0 pattern)
- Liquid files use `{% render %}` (not deprecated `{% include %}`)
- Private/internal blocks prefixed with `_` (e.g., `_product-card`, `_cart-summary`)
- Component JavaScript files use class-based inheritance from `component.js`
- Event handling uses custom event system (`events.js`) with `ThemeEvents` dispatcher
- CSS scoped via Declarative Shadow DOM where appropriate