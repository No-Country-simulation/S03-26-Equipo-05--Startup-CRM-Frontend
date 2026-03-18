import { Component, OnInit } from '@angular/core';
import { DataService } from './services/mock-data.service';
import { Kpi } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sidebarAbierto: boolean = true;
  kpis: Kpi[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getKpis().subscribe(data => {
      this.kpis = data;
    });
  }

  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
  }
}
