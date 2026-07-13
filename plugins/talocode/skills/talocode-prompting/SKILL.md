# Talocode Prompting Tips

## Tera Chat

```opencode
tera_chat message="How do I implement retry logic in TypeScript?"
tera_chat message="Review my approach" system="You are a senior TypeScript architect"
```

## Code Review

```

{
  "code": "function add(a,b){return a+b}",
  "focus": "security",
  "language": "javascript"
}
```

For best results, include the full file content or diff.

## Skill Generation

Generate a skill pack from any GitHub profile or repo:

```
skills_generate input="octocat" type="github-profile"
skills_generate input="https://github.com/talocode/tera" type="github-repo"
```

The generated SKILL.md is compatible with Cursor, Claude Code, OpenCode, and Codra.
