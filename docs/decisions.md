# Architecture Decisions

- Use one navigation system consistently. The historical material mixes Expo Router and React Navigation; the foundation should choose one before code is copied.
- Keep Stripe, PayPal, AI, and social secrets in Cloud Functions.
- Every client and campaign must carry a tenant or company identifier.