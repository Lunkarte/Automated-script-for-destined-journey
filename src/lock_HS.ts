import { FateSystem } from './types';
export function Lock_favorability(fatesystem: FateSystem): void {
  if (fatesystem.红线对象?.希洛西娅?.好感度 && fatesystem.红线对象.希洛西娅.好感度 >= 40) {
    fatesystem.红线对象.希洛西娅.好感度 = 39;
  }
  if (fatesystem.红线对象?.希尔薇娅?.好感度 && fatesystem.红线对象.希尔薇娅.好感度 >= 40) {
    fatesystem.红线对象.希尔薇娅.好感度 = 39;
  }
}