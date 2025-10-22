# Community Circles — Social+Creator Platform

Community Circles (working names include CircleHub, Commons, Hearth, Orbit, Conflux, Kinship, Loom, and Locality) is a 2026-ready social+creator platform that blends Reddit-style communities, Discord-like real-time interaction, Facebook-inspired profiles, and Patreon-class monetization into a unified experience.

## Core Concept
- **Public Center:** An always-on voice and text lounge inside every community for ambient co-working, live talks, and serendipitous hangouts.
- **Circles:** Creator-run hubs within communities that offer free and paid tiers, multimedia posts, live chats, drops/courses, and tier-based perks.
- **Unified Profiles & DMs:** Every user can showcase their identity, follow or support creators, and participate in private/group conversations without leaving the platform.

## Target Users
- Creators such as streamers, educators, organizers, hobby experts, artists, and small teams.
- Members who follow topics, local groups, class cohorts, or gaming guilds.
- Community admins seeking integrated tools that go beyond fragmented Reddit/Discord setups.

## Why It Works
- Combines social engagement with direct monetization, eliminating audience fragmentation.
- Ambient Public Centers drive daily retention compared to static feeds.
- AI copilots accelerate moderation, summarization, and content packaging.
- Interoperability paths let communities import existing audiences and export mailing lists.

## MVP Feature Checklist (0–6 months)
- Authentication and profiles.
- Create/join communities with feeds, tags, and rule pinning.
- Public Center with WebRTC voice, stage mode, hand-raise, reactions, and text chat.
- Circles with free/paid tiers powered by Stripe checkout.
- Posts supporting text, images, video upload, scheduling, and polls.
- Direct messages for 1:1 and small groups with attachments.
- Moderation roles, reporting, spam/phishing detection, and AI triage.
- Search & discovery across communities, creators, and posts.
- Payments for subscriptions, tips, refunds, and tax handling.
- Web and mobile (React Native) clients, with desktop considered later.

## v1.0 Roadmap Highlights (6–12 months)
- Events calendar and ticketing, long-form articles, and file libraries.
- Voice room recording, highlights, and Circle bundles/courses.
- Expanded analytics for creators and communities.
- API/bot framework, Discord/Patreon import tools, multi-currency, and gift subscriptions.

## System Design Snapshot
- **Frontend:** Next.js/React web, React Native mobile, optional Electron desktop.
- **Backend:** GraphQL gateway with specialized services for Auth, Community, Circles/Payments, Posts, Chat, Voice, Search, Analytics, and Moderation.
- **Data Layer:** PostgreSQL core, Redis for sessions/queues, S3-compatible storage with CDN, ClickHouse/BigQuery for analytics, OpenSearch for discovery.
- **Real-time:** WebSockets for chat and WebRTC SFU (LiveKit/Janus/mediasoup) for voice.
- **Eventing & Observability:** Kafka/Redpanda event bus, feature flags, and OpenTelemetry instrumentation.

## Trust, Safety, and Compliance
- Consistent enforcement of community guidelines across free and paid spaces.
- AI-assisted moderation with human-in-the-loop controls, role-based permissions, and rate limiting.
- Privacy safeguards for DMs, payment information, and minors; GDPR/CCPA compliance.
- KYC, risk checks, and dispute tooling for payouts and payments.

## Growth & Distribution
- Creator seeding with revenue-share promotions and migration concierge.
- Referral engine with invite links and rewards.
- Cross-posting to external networks with smart previews.
- Local community discovery and onboarding kits for universities or clubs.

## Success Metrics
- DAU/MAU ratios, 7-day retention, session length (Public Center minutes).
- Creators with ≥100 paying subscribers, MRR, and churn <5% monthly.
- Moderation response times and false positive rates.

## Open Questions
- Should Public Centers launch with video support or treat it as an add-on?
- Merchant of record vs. marketplace facilitator for optimal tax posture.
- Policy for cross-posting Circle-exclusive content to external platforms.

Stay aligned with the [Community Circles Guidelines](AGENTS.md) when contributing to this repository.
