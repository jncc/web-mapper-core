import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-legends',
  templateUrl: './legends.component.html',
  styleUrls: ['./legends.component.scss']
})
export class LegendsComponent implements OnInit {

  show = true;

  legends = [
    'seabed',
    'littoral habitats',
    'biological zones'
  ];

  constructor() { }

  ngOnInit() {
  }

  toggleShow() {
    this.show = !this.show;
  }

}
