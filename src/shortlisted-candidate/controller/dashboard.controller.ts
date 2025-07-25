import { Controller, Get } from '@nestjs/common';
import { DashboardStats } from './dashboard.dto';
import { ShortlistedCandidatesService } from '../services/shortlisted-candidates.service';

@Controller('shortlisted-candidate/dashboard')
export class DashboardController {
  constructor(private readonly shortlistedCandidatesService: ShortlistedCandidatesService) {}

  @Get('stats')
  async getDashboardStats(): Promise<any> {
    return this.shortlistedCandidatesService.getDashboardStats();
  }
}
