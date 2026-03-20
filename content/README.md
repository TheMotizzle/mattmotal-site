# Content Editing Guide

Use this folder to update site content without touching app code.

## Files to edit

- `content/resume.json` - controls the `/resume` page
- `content/work.json` - controls the `/work` page

## `resume.json` shape

```json
{
  "about": ["Paragraph 1", "Paragraph 2"],
  "experience": [
    {
      "company": "Company Name",
      "companyUrl": "https://...",
      "note": "(optional note)",
      "role": "Role title",
      "period": "Date range"
    }
  ],
  "primarySkills": {
    "heading": "Section heading",
    "items": ["Skill A", "Skill B"]
  },
  "secondarySkills": {
    "heading": "Secondary Skills",
    "groups": [
      {
        "title": "Group Name",
        "items": ["Item 1", "Item 2"]
      }
    ]
  },
  "education": [
    {
      "school": "School",
      "degree": "Degree",
      "period": "Years"
    }
  ],
  "manualReview": []
}
```

### Edit About Me

- Update the `about` array in `content/resume.json`
- Each string becomes one paragraph on the page

Example:

```json
"about": [
  "First paragraph.",
  "Second paragraph."
]
```

### Reorder skills

- `primarySkills.items`: move items up/down in the array
- `secondarySkills.groups`: reorder groups by moving whole objects
- Inside each group, reorder `items` by moving entries in the array

## `work.json` shape

```json
{
  "categories": [
    {
      "title": "Commercials",
      "entries": [
        {
          "label": "Client or project name",
          "url": "https://...",
          "details": [
            {
              "label": "Child item",
              "url": "https://..."
            }
          ]
        }
      ]
    }
  ],
  "manualReview": []
}
```

### Add a new work entry

1. Open the category in `categories` (for example `Commercials`)
2. Add a new object to that category's `entries` array
3. Use:
   - `label` (required)
   - `url` (optional)
   - `details` (optional nested children)

Example:

```json
{
  "label": "New Client",
  "details": [
    { "label": "\"Spot A\"", "url": "https://example.com/a" },
    { "label": "\"Spot B\"", "url": "https://example.com/b" }
  ]
}
```

## Common mistakes to avoid

- Invalid JSON (missing commas, trailing commas, unclosed quotes)
- Renaming keys (`label`, `details`, `categories`, etc.)
- Mixing object and string types in the wrong place
- Changing item order accidentally
- Deleting `manualReview` fields

Tip: run `npm run build` after edits to catch JSON/typing issues quickly.
