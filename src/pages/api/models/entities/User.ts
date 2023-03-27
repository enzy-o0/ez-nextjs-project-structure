import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@Index('user_UN', ['id'], { unique: true })
@Entity('user', { name: 'default', database: 'db', schema: 'db' })
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'seq' })
  @Field(() => ID)
  seq: number;

  @Column('varchar', {
    name: 'id',
    unique: true,
    comment: '아이디',
    length: 30,
  })
  @Field(() => String)
  id: string;

  @Column('varchar', {
    name: 'password',
    comment: '비밀번호',
    length: 200,
  })
  @Field(() => String)
  pswd: string;

  @Column('varchar', { name: 'phone', comment: '전화번호', length: 20 })
  @Field(() => String)
  phone: string;

  @Column('varchar', { name: 'name', comment: '이름', length: 20 })
  @Field(() => String)
  name: string;

  @Column('date', { name: 'birth', comment: '생년월일' })
  @Field(() => String)
  birth: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', {
    name: 'email',
    nullable: true,
    comment: '이메일',
    length: 200,
  })
  email: string | null;

  @Field(() => String, { nullable: true })
  @Column('char', {
    name: 'gender',
    nullable: true,
    comment: '성별',
    length: 1,
  })
  gender: string | null;
}
