import { ObjectType, PickType } from '@nestjs/graphql';
import { AuthUser } from './authUser.entity';

@ObjectType()
export class SignedUpUser extends PickType(AuthUser, ['id', 'username']) {}
