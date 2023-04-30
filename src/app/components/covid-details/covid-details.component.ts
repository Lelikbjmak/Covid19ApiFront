import { Component, Input, OnInit } from '@angular/core';
import { CovideDetails } from 'src/app/model/CovidDetails';

@Component({
  selector: 'app-covid-details',
  templateUrl: './covid-details.component.html',
  styleUrls: ['./covid-details.component.css']
})
export class CovidDetailsComponent implements OnInit {

  @Input() covidDetails: CovideDetails

  details = false

  constructor() {
  }

  ngOnInit(): void {
  }

}
