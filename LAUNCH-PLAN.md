# PageLens — Launch Plan v1.0

**Product:** PageLens — Website Health Checker Chrome Extension
**Version:** 1.0.0
**Date:** 2026-06-20
**Status:** Ready for human publishing actions

---

## Launch Channels (Priority Order)

### 1. Chrome Web Store (Primary)
- **Target:** Week 1, Day 1
- **Why:** This is a Chrome extension — the store is the #1 distribution channel.
- **Action:** Human must publish (see escalation file).

### 2. Product Hunt
- **Target:** Week 1, Day 2 (one day after CWS launch)
- **Why:** Strong developer audience, good for initial traction and feedback.
- **Action:** Human must create PH listing and submit.

### 3. Hacker News (Show HN)
- **Target:** Week 1, Day 3
- **Why:** Developer-heavy audience, high-quality early adopters.
- **Action:** Human must post "Show HN: PageLens — one-click website health audit."

### 4. Twitter / X
- **Target:** Week 1, Day 1 (same day as CWS)
- **Why:** Quick reach to web dev community.
- **Action:** Human must post with screenshot/GIF demo.

### 5. Reddit
- **Target:** Week 1, Day 2-3
- **Subreddits:** r/webdev, r/SideProject, r/chrome, r/SEO
- **Action:** Human must post in relevant subreddits.

### 6. Indie Hackers
- **Target:** Week 1, Day 3
- **Why:** Community of builders, good for feedback and early adopters.
- **Action:** Human must create launch post.

### 7. Email Outreach (Warm Contacts Only)
- **Target:** Week 1, Day 4-5
- **Why:** Personal network can drive initial installs and reviews.
- **Action:** Human must send to personal/professional contacts.

---

## First-Week Plan

### Day 1 (Launch Day)
- [ ] Publish to Chrome Web Store (HUMAN ACTION)
- [ ] Post on Twitter/X with demo GIF
- [ ] Update personal website/LinkedIn with PageLens mention
- [ ] Monitor CWS for any review/rejection issues

### Day 2
- [ ] Product Hunt launch (HUMAN ACTION)
- [ ] Reddit posts: r/webdev, r/SideProject (HUMAN ACTION)
- [ ] Respond to early feedback on all channels

### Day 3
- [ ] Hacker News: Show HN post (HUMAN ACTION)
- [ ] Indie Hackers launch post (HUMAN ACTION)
- [ ] Reddit: r/chrome, r/SEO (HUMAN ACTION)

### Day 4-5
- [ ] Email warm contacts (HUMAN ACTION)
- [ ] Engage with all comment threads
- [ ] Fix any bugs reported by early users

### Day 6-7
- [ ] Analyze first-week metrics (installs, ratings, feedback)
- [ ] Plan v1.1 based on user feedback
- [ ] Write follow-up blog post ("What I learned launching PageLens")

---

## Success Metrics (First 30 Days)

| Metric | Target |
|--------|--------|
| Chrome Web Store installs | 500+ |
| CWS rating | 4.5+ stars |
| Product Hunt upvotes | 100+ |
| Hacker News upvotes | 50+ |
| Twitter impressions | 5,000+ |
| GitHub stars (if open-sourced) | 50+ |

---

## Required Human Actions (Summary)

All publishing actions are gated behind human approval. See full details in:
`~/hermes_ops/escalations/pagelens.md`

### Critical Path (Must Do)
1. **Chrome Web Store** — Pay $5 developer fee (if not already paid), upload extension zip, fill listing from `launch/store-listing.md`, submit for review
2. **Product Hunt** — Create account/product page, schedule launch, prepare thumbnail
3. **Social Posts** — Twitter/X, Reddit, HN, Indie Hackers (copy from launch assets)

### Nice to Have
4. **Demo GIF/Video** — Record 30-second screen capture of PageLens in action
5. **Landing Page** — Deploy `launch/landing.md` content to a simple HTML page
6. **GitHub Repo** — Open-source the extension (builds trust, drives stars)

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| CWS review rejection | Extension is MV3-compliant, no external API calls, minimal permissions. Should pass. |
| Low initial traction | Focus on HN + PH for quality early adopters; iterate on feedback |
| Negative reviews | Respond quickly, fix bugs fast, be transparent about limitations |
| Competitor response | PageLens is free and focused on breadth (7 categories). Hard to beat on value. |

---

## Post-Launch Roadmap

- **v1.1** (Week 2-3): Fix user-reported bugs, add 5 more technology signatures
- **v1.2** (Month 2): Batch export, CSV support, custom signatures (Pro features)
- **v1.3** (Month 2-3): Historical tracking, PDF reports, API access
- **v2.0** (Month 3-4): Team plans, enterprise features, Firefox/Safari ports
