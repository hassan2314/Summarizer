import prisma from "../db/index.js";

export class QAService {
  async createQuestion(data) {
    const result = await prisma.question.create({ data });
    return result;
  }

  async findByUserId(userId) {
    return await prisma.question.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id) {
    return prisma.question.findUnique({ where: { id } });
  }

  async update(id, data) {
    return await prisma.question.update({ where: { id }, data });
  }
  async delete(id) {
    return await prisma.question.delete({ where: { id } });
  }
}
