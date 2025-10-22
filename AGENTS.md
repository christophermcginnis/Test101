# Community Circles — Social+Creator Platform Guidelines

These instructions apply to the entire repository.

## Vision Overview
- Build **Community Circles**, a hybrid platform that blends Reddit-style communities, Discord-like real-time spaces, Facebook-inspired social graphs, and Patreon monetization.
- Core differentiator: every community offers an always-on **Public Center** plus creator-run **Circles** with free and paid tiers. Any member can become a creator without switching apps.

## Product Pillars
1. **Communities** host feeds, rules, channels, events, files, and a Public Center lounge for ambient voice/text interaction.
2. **Circles** are creator hubs with tiered perks, content drops, analytics, and integrated payments.
3. **Profiles & DMs** let members showcase identity, follow creators, and communicate privately or in groups.
4. **AI Copilots** support moderation, summarization, content packaging, and safety workflows.

## Scope Expectations
- Focus on delivering the MVP feature set first: auth, profiles, communities, Public Center voice rooms, Circles with Stripe-backed tiers, multimedia posts, DMs, moderation tooling, search/discovery, analytics, and payment operations.
- Plan for v1.0 enhancements (events, long-form content, courses/drops, analytics expansion, import tools, multi-currency, gift subs) once MVP foundations are stable.

## Development Guidelines
- Favor modular services aligned with the system design snapshot: Next.js/React web, React Native mobile, GraphQL gateway, and domain services (Auth, Community, Circle/Payments, Posts, Chat, Voice, Search, Analytics, Moderation).
- Use PostgreSQL for core data, Redis for sessions/queues, S3-compatible storage for media, ClickHouse/BigQuery for analytics, and OpenSearch for search.
- Real-time components should leverage WebSockets for chat and a WebRTC SFU (e.g., LiveKit/Janus/mediasoup) for voice/voice rooms.
- All asynchronous events must publish through Kafka/Redpanda and include observability via OpenTelemetry-compatible tracing/metrics.
- Embed AI responsibly: enable human-in-the-loop moderation decisions and prioritize privacy (edge/on-device inference where feasible).

## Trust, Safety, and Compliance
- Enforce policy parity across all tiers—paywalls do not bypass community rules.
- Provide moderators with role-based permissions, queues, notes, shadowbans, and rate limits. AI triage may rank reports but must allow manual review.
- Respect user privacy: private DMs by default, payment details hidden from creators, compliance with GDPR/CCPA, and special protection for minors.
- Handle payments with Stripe (or equivalent) including VAT/sales tax, refunds, risk checks, KYC for payouts, and dispute tooling.

## Notifications & Growth
- Notifications should prioritize meaningful engagement (mentions, replies, drops, events, digests) with quiet hours and per-community granularity; avoid streak-based dark patterns.
- Support creator seeding, referral engines, cross-posting to external platforms, and local community onboarding flows.

## Documentation Standards
- Keep README and related docs current with product scope, feature roadmap, and success metrics.
- Document open questions (e.g., video support for Public Centers, merchant-of-record posture, cross-posting rules) in tracking issues or future planning sections.

Follow these guidelines for all future changes in this repository.
