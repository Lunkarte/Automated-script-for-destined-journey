import { FateSystem } from './types';
export function Lock_favorability(fatesystem: FateSystem): void {
  const { 红线对象 } = fatesystem;
  if (红线对象?.希洛西娅?.好感度 && 红线对象.希洛西娅.好感度 >= 40) {
    红线对象.希洛西娅.好感度 = 39;
  }
  if (红线对象?.希尔薇娅?.好感度 && 红线对象.希尔薇娅.好感度 >= 40) {
    红线对象.希尔薇娅.好感度 = 39;
  }
}