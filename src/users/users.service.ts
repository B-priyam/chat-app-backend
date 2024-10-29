import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import * as bcryptjs from "bcryptjs"

@Injectable()
export class UsersService {
  constructor (private readonly databaseService : DatabaseService){}
  async create(createUserDto: Prisma.UserCreateInput) {
    console.log(createUserDto)
    const existingUser = await this.databaseService.user.findUnique({
      where : {
        email : createUserDto.email
      }
    })
    if(existingUser){
      return {error: "email already exists"}
    }
    return this.databaseService.user.create({
      data : createUserDto
    });
  }

  async findAll() {
    return this.databaseService.user.findMany();
  }

  findOne(id: string) {
    return this.databaseService.user.findUnique({
      where :{
        id : id
      }
    });
  }

  async findUser(userData:{email:string,password:string}){
    const userExists = await this.databaseService.user.findUnique({
      where : {
        email : userData.email
      }
    })

    if(!userExists){
      return {error : "User does not exists"}
    }

    const matchedPassword = await bcryptjs.compare(userData.password,userExists.password)

    if(!matchedPassword){
      return {error : "Invalid Credentials"}
    }
    return userExists
  }

  update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where : {
        id
      },
      data : updateUserDto
    });
  }

  remove(id: string) {
    return this.databaseService.user.delete({
      where : {
        id
      }
    });
  }
}
