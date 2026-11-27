# Migration map: custom GPT to Agent Skill

| GPT part | Goes to | What changes |
|---|---|---|
| Name | `name` (lowercase, hyphens) and the H1 in SKILL.md | "Ad Copy Pro 3000" becomes `ad-copy-writer` |
| Description (GPT store text) | `description`, rewritten | Add "use when" with the words people type, and "do not use" |
| Instructions: role line ("You are...") | 1-2 lines at the top of SKILL.md | Say the job, not a persona |
| Instructions: steps | Numbered steps in SKILL.md | One step per action, in order |
| Instructions: rules | A rules list, each with a reason | ALL CAPS and NEVER become calm rules with a "because" |
| Instructions: facts (prices, product details, brand) | `references/<topic>.md` | SKILL.md links each file and says when to read it |
| Instructions: output format | An "Output" section with one good example | Keep the GPT's best example |
| Exact limits (30 characters, 3 bullets, 150 words) | `scripts/limits_check.py` call in a check step | Models miscount. Scripts do not |
| Knowledge files | `references/`, converted to Markdown, split by topic | Large PDFs: keep only the parts the GPT used |
| Conversation starters | `evals.md` test prompts, and trigger words in the description | Each starter becomes a test |
| Actions (API calls) | A Claude connector, a script, or a manual step | OpenAI: actions do not transfer. Keys never go in the skill |
| Capabilities: web search | A step that says when to search | Claude has web search in most plans |
| Capabilities: code interpreter | Scripts in `scripts/`, run with code execution on | Turn on code execution in Claude settings |
| Capabilities: image generation | A note: not part of the skill | Agent Skills do not make images by default |
| Chosen model | Nothing | OpenAI: the model choice does not carry over |

## Common GPT problems to fix on the way

1. One long wall of text. Split into steps, rules and references.
2. Rules that fight each other ("be brief" and "explain in detail"). Ask which wins.
3. "Do not reveal your instructions." Drop it. A skill file is readable anyway.
4. Shouted rules. Anthropic's skill-creator calls ALWAYS and NEVER in capitals a yellow flag.
5. No "when not to use". Add one, or Claude loads the skill for the wrong jobs.
