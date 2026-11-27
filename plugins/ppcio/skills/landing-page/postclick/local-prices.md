<!-- LOCALPRICE:v1: a price can show in the viewer's currency. Single source
     of truth. Injected verbatim into every LIVE prompt that writes findings
     from the page, between <!-- LOCALPRICE:v1 --> ... <!-- /LOCALPRICE -->
     markers, right after the FIXLINES block, or after the VOICE block in a
     prompt without one. To update: edit here first, re-inject into every
     prompt that carries it, re-upload. prompt-mirror-review.test.ts checks
     each copy word for word.
     Added 2026-10-19: sangamonwatches.com, a US store, was read from GB as
     £113.00, and the audit told the owner "Sangamon serves US buyers with
     British Pounds (£113.00)". A US buyer sees $122.35. -->

LOCAL PRICES: a price can show in the viewer's currency.
Many stores convert their prices for each visitor's country, and we read the
page from one country only. The currency on the page may not be the one the
store's own buyers see.
1. Never report a currency mismatch on that basis alone. No finding,
   objection, journey step, competitor gap or fix says the page charges
   buyers in the wrong currency or makes them convert it.
2. The same goes for checkout notes that only visitors from abroad see: a
   merchant of record such as Global-e, import duties, or "prices in GBP".
3. Quote a price as the page shows it, and judge the offer on its amount.
