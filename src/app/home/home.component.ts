import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tk-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  tasks = [
    { name: 'morning routine', color: '#4CAF50', priority: 1 },
    { name: 'listening podcasts', color: '#FF5722' },
    { name: 'meeting', color: '#607D8B' },
    { name: 'bugfix', color: '#607D8B' },
    { name: 'interviewing', color: '#607D8B' },
    { name: 'item 6', color: '#607D8B' },
  ];

  recent = [
    { name: 'listening podcasts', color: '#FF5722' },
    { name: 'meeting', color: '#607D8B' },
    { name: 'bugfix', color: '#607D8B' },
    { name: 'interviewing', color: '#607D8B' },
    { name: 'item 1', color: '#607D8B' },
    { name: 'item 2', color: '#607D8B' },
    { name: 'item 9', color: '#607D8B' },
  ];

  completed = [
    { name: 'morning routine', color: '#4CAF50' },
    { name: 'interviewing', color: '#607D8B' },
    { name: 'item 1', color: '#607D8B' },
  ];

  day = [
    { name: 'home', color: '#80DEEA', proportion: 20 },
    { name: 'walk', color: '#C5E1A5', proportion: 1 },
    { name: 'metro', color: '#E1BEE7', proportion: 5 },
    { name: 'walk', color: '#C5E1A5', proportion: 4 },
    { name: 'office', color: '#EF9A9A', proportion: 40 },
    { name: 'walk', color: '#C5E1A5', proportion: 4 },
    { name: 'metro', color: '#E1BEE7', proportion: 5 },
    { name: 'walk', color: '#C5E1A5', proportion: 1 },
    { name: 'home', color: '#80DEEA', proportion: 20 },
  ];

  contexts = [
    { name: 'home', color: '#80DEEA' },
    { name: 'walk', color: '#C5E1A5' },
    { name: 'metro', color: '#E1BEE7' },
    { name: 'office', color: '#EF9A9A' },
    { name: 'swimming pool', color: '#B2EBF2' },
    { name: 'gym', color: '#FFECB3' },
    { name: 'cafe', color: '#D7CCC8' },
    { name: 'taxi', color: '#D7CCC8' },
  ];

  constructor() { }

  ngOnInit() {
  }

}
