import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/**
 * The documentation lives in `src/content/docs` as plain Markdown.
 *
 * - `group`  the sidebar section the page belongs to
 * - `order`  the position inside that group
 * - `title`  the page title, also used for the document title and the nav
 */
const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    group: z.string().default("Guide"),
    order: z.number().default(0),
    eyebrow: z.string().optional(),
  }),
});

export const collections = { docs };
