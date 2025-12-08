import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CompanyApiService } from '../../services/company-api.service';
import { BondRequestApiService } from '../../services/bond-request-api.service';
import { InvestorStateService } from '../../services/investor-state.service';
import { Company, BondRequest } from '../../models/company.model';

@Component({
  selector: 'app-investor-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './investor-marketplace.component.html',
  styleUrls: ['./investor-marketplace.component.scss']
})
export class InvestorMarketplaceComponent implements OnInit {
  companies: Company[] = [];
  selectedCompanyId: number | null = null;
  bonds: BondRequest[] = [];

  error = '';

  constructor(
    private companyApi: CompanyApiService,
    private BondRequestApi: BondRequestApiService,
    private investorState: InvestorStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.investorState.investor) {
      this.router.navigate(['/investor/login']);
      return;
    }

    this.companyApi.getAll().subscribe({
      next: list => (this.companies = list),
      error: err => {
        console.error(err);
        this.error = 'Failed to load companies.';
      }
    });
  }

  onCompanyChange() {
    this.bonds = [];
    this.error = '';

    if (!this.selectedCompanyId) return;

    this.BondRequestApi.Get(this.selectedCompanyId).subscribe({
      next: list => (this.bonds = list),
      error: err => {
        console.error(err);
        this.error = 'Failed to load bonds.';
      }
    });
  }
}
