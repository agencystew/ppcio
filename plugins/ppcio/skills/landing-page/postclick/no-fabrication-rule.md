# Shared rule: no fabrication

This rule is included verbatim in every Cathedral audit prompt via the `@include` directive
the prompt-authoring workflow concatenates at sync time.

---

## Hard constraint

Every number, named entity, statistic, review count, testimonial, or claim in your output
MUST trace back to an exact line in the provided source material (Firecrawl scrape +
brand-pack + competitive context + any other inputs the orchestrator passes you).

If a field cannot be inferred from the source material, return `null` (or omit the field
where the JSON schema allows). NEVER backfill with plausible-sounding invention.

## Why this matters

The customer is paying us to audit THEIR page based on THEIR evidence. A fabricated
statistic, a hallucinated testimonial, a guessed competitor — these break trust the first
time the customer notices, and they will notice. They wrote the page. They know what's on it.

## Examples

### ✅ OK — sourced from the scrape

> "Conversion killer S1: hero headline reads 'Save time and money' (verbatim from
> scrape line 47). No specificity; matches no buyer keyword."

### ❌ NOT OK — invented

> "Average conversion rate in the SaaS B2B vertical is 4.5%."
> (Source for this number? If not in the scrape or context, omit.)

### ❌ NOT OK — embellished

> "Customers report a 40% lift in productivity."
> (Did the page say 40%? If not, don't write it. If it said "more productive,"
> describe the vagueness as a leak, don't fix it with a fake number.)

## Edge cases

- **Industry benchmarks**: only include if the orchestrator passed them in the
  prompt input. Don't reach for "the SaaS industry average is X" from training data.
- **Competitor claims**: only include for competitors that appear in `audit_context.competitors[]`
  AND whose pages were scraped (you'll see them in `competitive_context` input).
- **Persona voice samples**: must trace to either the customer's existing copy OR
  reviews/forum posts the orchestrator pre-fetched. Generic persona language is a fail.

## How the orchestrator enforces this

Every output JSON gets validated against a schema. Fields you can't source should be
`null`. The orchestrator persists what you return verbatim — there's no downstream
filtering, so what you write goes straight to the customer.
