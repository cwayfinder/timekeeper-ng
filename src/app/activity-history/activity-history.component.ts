import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DbService } from '../db.service';
import { Observable } from 'rxjs/Observable';
import { deltaTime } from '../date-utils';
import { ActivityHistoryItemComponent } from '../activity-history-item/activity-history-item.component';
import { MdDialog } from '@angular/material';
import * as closestTo from 'date-fns/closest_to';
import * as differenceInMinutes from 'date-fns/difference_in_minutes';
import * as addMinutes from 'date-fns/add_minutes';
import * as format from 'date-fns/format';

@Component({
  selector: 'tk-activity-history',
  templateUrl: './activity-history.component.html',
  styleUrls: ['./activity-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityHistoryComponent implements OnInit {

  items$: Observable<any[]>;
  items: any[] = [];
  hours: string[] = [];

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
      });

    this.items$.subscribe(items => {
      console.log(items)
      this.items = items;
    });

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
    date.setHours(6, 0, 0, 0);
    return date.valueOf();
  }

  getGoToBedTime(): number {
    const date = new Date();
    date.setHours(22, 0, 0, 0);
    return date.valueOf();
  }

  editItem(item: any) {
    const dialogRef = this.dialog.open(ActivityHistoryItemComponent, {
      width: '320px',
      data: {
        mode: 'edit',
        item
      }
    });
  }

  addItem(event: MouseEvent) {
    const timings = this.getTimingsByClick(event);

    console.log(format(timings.start, 'HH:mm'), format(timings.stop, 'HH:mm'));

    const dialogRef = this.dialog.open(ActivityHistoryItemComponent, {
      width: '320px',
      data: { mode: 'create', item: timings }
    });
  }

  private getTimingsByClick(event: MouseEvent): { start: number, stop: number } {
    const minutesToAdd = event.layerY * 60 / 100;
    const timestamp = addMinutes(this.getWakeUpTime(), minutesToAdd);

    const result: any = {};

    const stops = this.items.map(item => item.stop);
    const lastStop = closestTo(timestamp, stops);

    if (differenceInMinutes(timestamp, lastStop) <= 30) {
      result.start = lastStop.valueOf();
    } else {
      result.start = timestamp;
    }

    const starts = this.items.map(item => item.start);
    const nextStart = closestTo(timestamp, starts);
    const diffStart = differenceInMinutes(nextStart, timestamp);
    if (diffStart > 0 && diffStart <= 30) {
      result.stop = nextStart.valueOf();
    } else {
      result.stop = addMinutes(result.start, 30).valueOf();
    }

    return result;
  }
}
