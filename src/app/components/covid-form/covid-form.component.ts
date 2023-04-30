import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Country } from 'src/app/model/CountryInterface';
import { MaxMinCovidDetails } from 'src/app/model/MaxMinCovidDetailsInterface';
import { CountryService } from 'src/app/services/country-service.service';
import { CovidService } from 'src/app/services/covid-service.service';

@Component({
  selector: 'app-covid-form',
  templateUrl: './covid-form.component.html',
  styleUrls: ['./covid-form.component.css']
})
export class CovidFormComponent implements OnInit {

  isDayPeriod = true
  loading = false;

  dropdownCountryList: string[] = [];

  dropdownSettings = {
    singleSelection: false,
    idField: 'slug',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  covidInfoDetails: MaxMinCovidDetails; // respponse from API
  covidCasesForm: FormGroup = this.formBuilder.group({
    selectedCountries: ['', Validators.required],
    from: ['', Validators.required],
    to: ''
  }); // Form

  constructor(private countryService: CountryService, private formBuilder: FormBuilder,
    private covidService: CovidService) { }

  ngOnInit(): void {

    let temp: string[] = [];

    this.countryService.getPossibleCountries<Country[]>().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        temp.push(data[i].slug.toUpperCase());
      }
      this.dropdownCountryList = temp;
    });
  }

  onCountrySelect(item: any) {
    console.log('selected: ', item);
  }

  onCountryDeselect(item: any) {
    console.log('deselected: ', item);
  }

  get firstTermDayControl() {
    return this.covidCasesForm.get('from');
  }

  get lastTermDayControl() {
    return this.covidCasesForm.get('to');
  }

  get selectedCountriesControl() {
    return this.covidCasesForm.get('selectedCountries');
  }

  onPeriodChange() {
    this.isDayPeriod = !this.isDayPeriod;
    if (this.isDayPeriod)
      this.lastTermDayControl?.clearValidators();
    else
      this.lastTermDayControl?.setValidators([Validators.required]);

    this.lastTermDayControl?.updateValueAndValidity();
  }

  getCurrentDate() {
    return new Date();
  }

  submit() {

    this.loading = true;
    let counrySlugList = this.selectedCountriesControl?.value;
    console.log(counrySlugList);

    for (let index = 0; index < counrySlugList.length; index++) {
      counrySlugList[index] = counrySlugList[index].toLowerCase()
    }

    if (this.isDayPeriod) {
      this.loading = true;

      let day = this.firstTermDayControl?.value;
      this.getCovidDetailsForDay(day, counrySlugList);
    } else {
      this.loading = true;

      let firstDay = this.firstTermDayControl?.value;
      let lastDay = this.lastTermDayControl?.value;
      this.getCovidDEtailsForTerm(firstDay, lastDay, counrySlugList);
    }
  }

  private getCovidDetailsForDay(day: string, countries: string[]) {
    this.covidService.getSummaryForDay(day, countries).pipe(
      finalize(() => this.loading = false)
    ).subscribe(data => {
      this.covidInfoDetails = data
    });
  }

  private getCovidDEtailsForTerm(firstDay: string, lastDay: string, countries: string[]) {
    this.covidService.getSummaryForTerm(countries, firstDay, lastDay).pipe(
      finalize(() => this.loading = false)
    ).subscribe(data => {
      this.covidInfoDetails = data
    });
  }
}
