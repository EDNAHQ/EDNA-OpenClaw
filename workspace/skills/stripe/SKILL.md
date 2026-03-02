---
name: stripe
description: "Stripe billing and payments for Enterprise DNA. Customer lookups, subscription management, dispute handling, refunds, and invoicing."
---

# Stripe Skill — Enterprise DNA

## Auth
- **Token:** `STRIPE_SECRET_KEY` env var (live secret key, full access)
- **Account:** Enterprise DNA (NZD primary, USD secondary)
- **Mode:** Live

### API Pattern
```bash
curl -s -u "$STRIPE_SECRET_KEY:" https://api.stripe.com/v1/...
```

## Common Operations

### Customers
```bash
# List customers
curl -s -u "$STRIPE_SECRET_KEY:" "https://api.stripe.com/v1/customers?limit=10"

# Search customer by email
curl -s -u "$STRIPE_SECRET_KEY:" "https://api.stripe.com/v1/customers/search?query=email:'user@example.com'"

# Get specific customer
curl -s -u "$STRIPE_SECRET_KEY:" "https://api.stripe.com/v1/customers/cus_xxx"
```

### Subscriptions
```bash
# List subscriptions for a customer
curl -s -u "$STRIPE_SECRET_KEY:" "https://api.stripe.com/v1/subscriptions?customer=cus_xxx"

# Cancel subscription
curl -s -X DELETE -u "$STRIPE_SECRET_KEY:" "https://api.stripe.com/v1/subscriptions/sub_xxx"
```

### Charges & Payments
```bash
# List recent charges
curl -s -u "$STRIPE_SECRET_KEY:" "https://api.stripe.com/v1/charges?limit=10"

# Refund a charge
curl -s -X POST -u "$STRIPE_SECRET_KEY:" -d "charge=ch_xxx" "https://api.stripe.com/v1/refunds"

# Partial refund
curl -s -X POST -u "$STRIPE_SECRET_KEY:" -d "charge=ch_xxx&amount=1000" "https://api.stripe.com/v1/refunds"
```

### Disputes
```bash
# List disputes
curl -s -u "$STRIPE_SECRET_KEY:" "https://api.stripe.com/v1/disputes?limit=10"

# Get dispute details
curl -s -u "$STRIPE_SECRET_KEY:" "https://api.stripe.com/v1/disputes/dp_xxx"

# Submit dispute evidence
curl -s -X POST -u "$STRIPE_SECRET_KEY:" \
  -d "evidence[customer_name]=John Doe" \
  -d "evidence[customer_email_address]=john@example.com" \
  -d "evidence[uncategorized_text]=Evidence description..." \
  "https://api.stripe.com/v1/disputes/dp_xxx"
```

### Invoices
```bash
# List invoices
curl -s -u "$STRIPE_SECRET_KEY:" "https://api.stripe.com/v1/invoices?limit=10"

# Get invoice
curl -s -u "$STRIPE_SECRET_KEY:" "https://api.stripe.com/v1/invoices/in_xxx"
```

### Balance
```bash
curl -s -u "$STRIPE_SECRET_KEY:" "https://api.stripe.com/v1/balance"
```

## Safety Rules
- **ALWAYS confirm with a team member before processing refunds**
- **NEVER cancel subscriptions without explicit approval**
- Dispute evidence submission should be reviewed before submitting
- Read operations (list, get, search) are safe to do freely
