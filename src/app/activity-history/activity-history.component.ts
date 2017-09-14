import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DbService } from '../db.service';
import { Observable } from 'rxjs/Observable';
import { deltaTime } from '../date-utils';
import { ActivityHistoryItemComponent } from '../activity-history-item/activity-history-item.component';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'tk-activity-history',
  templateUrl: './activity-history.component.html',
  styleUrls: ['./activity-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityHistoryComponent implements OnInit {

  items$: Observable<any[]>;
  hours: string[]= [];

  constructor(private db: DbService, private dialog: MdDialog) { }

  ngOnInit() {
    this.items$ = this.db.activityHistory()
      .map(items => {
        const startTime = this.getWakeUpTime();
        const endTime = this.getGoToBedTime();
        const totalTime = endTime - startTime;

        const totalPx = 1600;

        items.forEach(item => {
          if (!item.stop) {
            item.stop = Date.now();
          }

          item.startPx = totalPx * (item.start - startTime) / totalTime;
          const stopPx = totalPx * (item.stop - startTime) / totalTime;
          item.heightPx = stopPx - item.startPx;
        });
        return items;
      })
      .do(val => console.log(val));

    for (let i = 6; i < 22; i++) {
      this.hours.push(`${String(i + 1).padStart(2, '0')}:00`);
    }
  }

  delta(start: number, stop: number): string {
    if (stop) {
      return deltaTime(start, stop);
    } else {
      return deltaTime(start, Date.now());
    }
  }

  getWakeUpTime(): number {
    const date = new Date();
    date.setUTCHours(3, 0, 0, 0);
    return date.valueOf();
  }

  getGoToBedTime(): number {
    const date = new Date();
    date.setUTCHours(19, 0, 0, 0);
    return date.valueOf();
  }

  editItem(item: any) {
    const dialogRef = this.dialog.open(ActivityHistoryItemComponent, {
      width: '320px',
      data: item
    });

    dialogRef.afterClosed()
      // .filter(activity => !!activity)
      // .switchMap(activity => this.db.create('activities', activity))
      .subscribe(key => console.log('edited activity', key));
  }
}
