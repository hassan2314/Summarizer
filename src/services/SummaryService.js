import prisma from "../db/index.js";

export class SummaryService {
  async create(data) {
    return await prisma.summary.create({ data });
  }
  async find() {
    return await prisma.summary.findMany();
  }
  async findByUserId(userId) {
    return await prisma.summary.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }, // optional
    });
  }

  async findByUserIdAndTag(userId, tag) {
    return await prisma.summary.findMany({
      where: {
        userId,
        tags: { has: tag },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getTopTags(userId) {
    const results = await prisma.summary.findMany({
      where: { userId },
      select: { tags: true },
    });

    const tagMap = {};
    results.forEach(({ tags }) => {
      tags.forEach((tag) => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });

    const sorted = Object.entries(tagMap).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 10).map(([tag]) => tag);
  }

  async update(id, data) {
    return await prisma.summary.update({ where: { id }, data });
  }
  async delete(id) {
    return await prisma.summary.delete({ where: { id } });
  }
}
