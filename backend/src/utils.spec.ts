import * as jsc from 'jsverify';
import { weekPeriod } from './utils';

describe('weekPeriod', () => {
  jsc.property("a 1 week duration is returned", jsc.datetime, function (d) {
    const weekDuration = 60 * 60 * 24 * 7 * 1000 - 1;
    //                   ^min ^h   ^day ^w  ^ms
    const res = weekPeriod(d);
    return res.sunday.getTime() - res.monday.getTime() === weekDuration;
  });
})
