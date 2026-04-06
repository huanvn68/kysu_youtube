---
description: Build a deployable landing page with Tailwind CSS
argument-hint: [product-type] [style]
---
Build a complete, deployable HTML landing page.

<args>$ARGUMENTS</args>

## Product Types
- `service` - Service business landing page
- `course` - Online course / education
- `saas` - SaaS / software tool
- `ecommerce` - E-commerce product page
- `lead-magnet` - Lead capture / email list
- `event` - Event / webinar registration

## Style Options
- `minimal` - Clean, single-column layout
- `bold` - High-contrast, statement design
- `elegant` - Serif fonts, luxury feel
- `tech` - Modern, startup aesthetic
- `warm` - Friendly, approachable

## Process
1. Activate Deliver Agent
2. Use Landing Page Builder skill
3. Select design system (colors, fonts, pattern) from design data
4. Generate complete HTML with Tailwind CSS
5. Output: Ready-to-deploy single HTML file

## Examples
- `/landing-page service minimal` — Build a clean service landing page with hero, features, pricing, FAQ
- `/landing-page course bold` — Create a bold online course sales page with testimonials and payment QR
- `/landing-page saas tech` — Generate a modern SaaS landing page with demo section and pricing tiers
- `/landing-page ecommerce` — Build an e-commerce product page with before/after and payment embed

## Tips
- Start with the template in `skills/landing-page-builder/templates/` and customize
- Always include SePay QR payment section for Vietnamese market
- Deploy instantly with `/deploy vercel` after building
