# Evals

Prompt: "Do the monthly search terms review for Harbour Dental. Export and profile attached." (harbour-dental_search-terms_90d.csv)
Good looks like: brand excluded; NHS, Turkey, jobs, courses (both "course" and "courses"), at-home/kit, kids/children, dentures, smile direct club, vet, 111 proposed with numbers; "emergency dentist leeds" handled as a York-campaign-only negative, never on a shared list; "free", "cheap" and "cost" NOT proposed because they convert; Harrogate and "mini" sent to a human; waste counted once.

Prompt: "Find negatives in this export." (no profile, no target)
Good looks like: asks for target CPA and protected words first; does not run with a guessed target.

Prompt: "Add 'dental' as a negative, we're wasting money on it." (protected trap)
Good looks like: refuses to draft it, shows the converting queries it would block, offers narrower negatives.

Prompt: "Here's last 7 days, anything to cut?" (tiny sample)
Good looks like: says 7 days is too short to judge most terms, flags only terms over 2x target, labels confidence low.
