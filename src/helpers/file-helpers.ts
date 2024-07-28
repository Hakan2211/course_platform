import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import React from 'react';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import { Plugin } from 'unified';
import remarkSlug from 'remark-slug';

import { slugify } from '@/lib/utils';
import { serialize } from 'next-mdx-remote/serialize';
import type { Heading, Root } from 'mdast';

type Frontmatter = {
  title: string;
  order: number;
  [key: string]: any;
};

type Module = {
  slug: string;
  title: string;
  order: number;
};

type Chapter = {
  chapterSlug: string;
  modules: Module[];
};

export async function getCourseChapters(): Promise<Chapter[]> {
  const chapterNames = await readDirectory('/content');

  const chapters: Chapter[] = [];

  for (let chapterName of chapterNames) {
    const moduleNames = await readDirectory(`/content/${chapterName}`);

    const modules: Module[] = [];

    for (let moduleName of moduleNames) {
      const rawContent = await readFile(
        `/content/${chapterName}/${moduleName}`
      );

      const { data: frontmatter } = matter(rawContent);

      modules.push({
        slug: `${moduleName.replace('.mdx', '')}`,
        title: frontmatter.title,
        order: frontmatter.order,
      });
    }

    chapters.push({
      chapterSlug: chapterName,
      modules: modules.sort((m1, m2) => m1.order - m2.order),
    });
  }

  return chapters.sort((c1, c2) =>
    c1.chapterSlug.localeCompare(c2.chapterSlug)
  );
}

type LoadModuleContentResult = {
  frontmatter: Frontmatter;
  content: string;
  headings: { depth: number; text: string; id: string }[];
  mdxSource: any;
} | null;

export const loadModuleContent = React.cache(async function loadModuleContent(
  chapterSlug: string,
  moduleSlug: string
): Promise<LoadModuleContentResult> {
  let rawContent;
  try {
    rawContent = await readFile(`/content/${chapterSlug}/${moduleSlug}.mdx`);
  } catch (error) {
    return null;
  }

  const { data: frontmatter, content } = matter(rawContent);

  const typedFrontmatter: Frontmatter = {
    title: frontmatter.title,
    order: frontmatter.order,
    ...frontmatter,
  };

  const headings = await extractHeadings(content);

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkSlug as unknown as Plugin],
    },
  });

  return { frontmatter: typedFrontmatter, content, headings, mdxSource };
});

async function extractHeadings(mdxContent: string) {
  let headings: { depth: number; text: string; id: string }[] = [];
  await remark()
    .use(remarkMdx)
    .use(remarkSlug as unknown as Plugin)
    .use(() => (tree: Root) => {
      visit(tree, 'heading', (node: Heading) => {
        const text = toString(node);
        let id: string;

        if (node.data && node.data.hProperties && node.data.hProperties.id) {
          id = toString(node.data.hProperties.id);
          if (typeof id !== 'string') {
            id = String(id); // Convert to string if not already
          }
        } else {
          id = slugify(text);
        }

        headings.push({ depth: node.depth, text, id });
      });
    })
    .process(mdxContent);
  return headings;
}

function readFile(localPath: string): Promise<string> {
  return fs.readFile(path.join(process.cwd(), localPath), 'utf8');
}

function readDirectory(localPath: string): Promise<string[]> {
  return fs.readdir(path.join(process.cwd(), localPath));
}
