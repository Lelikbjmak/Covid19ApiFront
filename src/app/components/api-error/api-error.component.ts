import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/services/error-service.service';

@Component({
  selector: 'app-api-error',
  templateUrl: './api-error.component.html',
  styleUrls: ['./api-error.component.css']
})
export class ApiErrorComponent implements OnInit {

  constructor(public errorService: ErrorService){}

  ngOnInit(): void {
  }

}
