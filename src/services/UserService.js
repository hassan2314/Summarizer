import prisma from "../db/index.js";

export class UserService {
  async create(data) {
    return await prisma.user.create({ data });
  }
  async findByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async findById(id) {
    return await prisma.user.findUnique({ where: { id } });
  }
  async updateUser(id, data) {
    return await prisma.user.update({ where: { id }, data });
  }
  async deleteUser(id) {
    return await prisma.user.delete({ where: { id } });
  }
}
