import { MetadataRoute } from "next";
import { getDeadlines, getSubjects } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/deadlines`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/subjects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const subjectRoutes: MetadataRoute.Sitemap = subjects.map((sub) => ({
    url: `${baseUrl}/subjects/${sub.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const deadlineRoutes: MetadataRoute.Sitemap = deadlines.map((d) => ({
    url: `${baseUrl}/deadlines/${d.id}`,
    lastModified: new Date(d.createdAt),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...subjectRoutes, ...deadlineRoutes];
}
