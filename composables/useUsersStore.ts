import { UsersRepository } from "~/repositories/UserRepository";
import type { User } from "~/server/database/schema";

const usersRepository = new UsersRepository()
export const useUsersStore = createEntityStore<User, UsersRepository>(
    'users',
    usersRepository,
)