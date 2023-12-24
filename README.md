# Notion markdown add YAML boundaries

This script will add the YAML boundaries `---` above and below the YAML properties in your Notion-exported markdown files, so that you can also use them in other non-Notion tools such as Obsidian.

## Usage

After cloning navigate to the repository and then run the following, substituting the path:

```sh
node main.js /your/notion/export
```

It's best run after [Notion to Obsidian Converter](https://github.com/connertennery/Notion-to-Obsidian-Converter), as that tool helps with other aspects links.
