import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { PassThrough } from 'stream';
// import { Response } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@UseInterceptors(ClassSerializerInterceptor) // this decorator ensure that my @Exclude() decorator in user.entity password works, and won't let password shows up. This at controller level. but can be applied to handler level.
@Controller()
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  @Post('register')
  async register(@Body() body: RegisterDto): Promise<any> {
    if (body.password !== body.password_confirm) {
      throw new BadRequestException(`Passwords do not match!`);
    }

    const hashed = await bcrypt.hash(body.password, 12);
    return this.userService.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: hashed,
    });
  }
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response, //@Res({ passthrough: true }) response: Response,if we want to get the cookie from the fron end and sent it to the back end, we need to add this passwthrough as true, this is how we exchange with front end, we can replace this with app.enable({credentials: true}) so it enable it for the whole app
  ) {
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }
    if (!(await bcrypt.compare(password, (await user).password))) {
      throw new BadRequestException('Invalid credential');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });
    return user;
  }

  @Get('user')
  @UseGuards(AuthGuard)

  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    const user = await this.userService.findOne({ id: data['id'] });
    return user;
  }
  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    response.clearCookie('jwt');
    return 'logout successfully';
  }
}
