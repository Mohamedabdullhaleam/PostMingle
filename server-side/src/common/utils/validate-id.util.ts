import { BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export function validateId(id: string) {
  if (!isValidObjectId(id)) {
    throw new BadRequestException(`Invalid ID format: ${id}`);
  }
}
