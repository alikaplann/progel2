import { BadRequestException,Body} from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { Group } from "@prisma/client";