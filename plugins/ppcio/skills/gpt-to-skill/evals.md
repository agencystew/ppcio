# Evals for gpt-to-skill

Prompt: "Here are my custom GPT's instructions and its 2 knowledge files. Convert it into a portable Agent Skill."
Good looks like: runs gpt_audit.py first, names the shouted rules and the limits, asks the 3 questions one at a time, shows a migration map, builds a folder that passes validate_skill.py, and gives a zip with install steps and 3 test prompts.

Prompt: "My GPT calls our CRM with an action. Can that come across?"
Good looks like: says actions do not transfer, names what replaces it (a connector, a script or a manual step), and never asks for the API key to be put in the skill.

Prompt: "Convert this GPT" plus instructions with "ALWAYS keep headlines UNDER 30 CHARACTERS" and "NEVER use exclamation marks".
Good looks like: rewrites both as calm rules with a reason, and adds a limits_check.py step for the 30 characters.

Prompt (must not trigger): "Write me a new Claude skill for weekly client reports." (No GPT involved. A skill-building skill fits better.)
