import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags('Dashboard')
@Controller('api/dashboard')
export class DashboardController {}
