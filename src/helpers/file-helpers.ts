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
  parent: string | null;
  moduleBadge?: string;
  moduleDescription?: string;
  [key: string]: any;
};

type Lesson = {
  slug: string;
  title: string;
  order: number;
  parent: string | null;
  moduleBadge?: string;
  moduleDescription?: string;
};

type Module = {
  moduleSlug: string;
  lessons: Lesson[];
};

export async function getCourseModules(): Promise<Module[]> {
  const moduleNames = await readDirectory('/content');

  const modules: Module[] = [];

  for (let moduleName of moduleNames) {
    const lessonNames = await readDirectory(`/content/${moduleName}`);

    const lessons: Lesson[] = [];

    for (let lessonName of lessonNames) {
      const rawContent = await readFile(`/content/${moduleName}/${lessonName}`);

      const { data: frontmatter } = matter(rawContent);

      lessons.push({
        slug: `${lessonName.replace('.mdx', '')}`,
        title: frontmatter.title,
        order: frontmatter.order,
        parent: frontmatter.parent || null,
        moduleBadge: frontmatter.moduleBadge,
        moduleDescription: frontmatter.moduleDescription,
      });
    }

    modules.push({
      moduleSlug: moduleName,
      // lessons: lessons.sort((l1, l2) => l1.order - l2.order),
      lessons: lessons,
    });
  }

  return modules.sort((m1, m2) => m1.moduleSlug.localeCompare(m2.moduleSlug));
}

type LoadLessonContentResult = {
  frontmatter: Frontmatter;
  content: string;
  headings: { depth: number; text: string; id: string }[];
  mdxSource: any;
} | null;

export const loadLessonContent = React.cache(async function loadLessonContent(
  moduleSlug: string,
  lessonSlug: string
): Promise<LoadLessonContentResult> {
  let rawContent;
  try {
    rawContent = await readFile(`/content/${moduleSlug}/${lessonSlug}.mdx`);
  } catch (error) {
    return null;
  }

  const { data: frontmatter, content } = matter(rawContent);

  const typedFrontmatter: Frontmatter = {
    title: frontmatter.title,
    order: frontmatter.order,
    parent: frontmatter.parent || null,
    moduleBadge: frontmatter.moduleBadge,
    moduleDescription: frontmatter.moduleDescription,
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
