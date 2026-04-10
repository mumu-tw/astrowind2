import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),
      canonical: z.string().url().optional(),
      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),
      description: z.string().optional(),
      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),
      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: glob({
    // ✅ 同時抓：
    //   - 根層的 taiwan.md（舊格式，向下相容）
    //   - 子資料夾的 taiwan/index.md（新資料夾格式）
    pattern: ['*.md', '*.mdx', '*/index.md', '*/index.mdx'],
    base: 'src/content/blog',
  }),
  schema: ({ image }) =>
    z.object({
      // ✅ 改用 ({ image }) 解構，支援本地圖片
      publishDate: z.date().optional(),
      updateDate: z.date().optional(),
      draft: z.boolean().optional(),
      title: z.string(),
      excerpt: z.string().optional(),
      image: image().optional(), // ✅ 改為 image() 而非 z.string()
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      author: z.string().optional(),
      metadata: metadataDefinition(),
    }),
});

export const collections = {
  post: postCollection,
};
