import { Component, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
export interface DashboardData {
	category: number;
	product: number;
	bill: number;
}
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	responseMessage: string = '';
	data: DashboardData = { category: 0, product: 0, bill: 0 };


	constructor(private dashboardService: DashboardService,
		private ngxService: NgxUiLoaderService,
		private snackbarService: SnackbarService,
		private cdr: ChangeDetectorRef
	) {
	}
	ngOnInit(): void {
		this.ngxService.start();
		this.dashBoardData();
	}

	dashBoardData() {
		this.dashboardService.getDetails().subscribe((response: any) => {
			console.log('Data received:', response);
			this.ngxService.stop();
			this.data = response;
			this.cdr.detectChanges();
		},
			(error) => {
				this.ngxService.stop();
				console.log(error);
				if (error.error?.message) {
					this.responseMessage = error.error?.message;
				} else {
					this.responseMessage = GlobalConstants.genericError;
				}
				this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
				this.cdr.detectChanges();
			}
		)
	}
}
