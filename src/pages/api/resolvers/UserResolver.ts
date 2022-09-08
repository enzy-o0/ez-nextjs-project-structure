import { Resolver, Query } from 'type-graphql';
import { User } from '../models/entities/index';


// typeorm
@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users() {
    const user = await User.find();

    if (!user) {
      throw new Error('Could not find user');
    }
    return user;
  }
}
