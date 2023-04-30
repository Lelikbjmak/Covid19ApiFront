import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  firstTitlePart = "Covid19"
  secondTitlePart = "API"
  currentTime: Date = new Date()
  
  constructor() { }

  ngOnInit(): void {
      setInterval(() => {
        this.currentTime = new Date();
      }, 1000);
  }

}
