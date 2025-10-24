import { FateSystem } from './types';
export function Lock_favorability(fatesystem: FateSystem): void {
  if (fatesystem.命定之人?.希洛西娅?.好感度 && fatesystem.命定之人.希洛西娅.好感度 >= 40) {
    fatesystem.命定之人.希洛西娅.好感度 = 39;
  }
  if (fatesystem.命定之人?.希尔薇娅?.好感度 && fatesystem.命定之人.希尔薇娅.好感度 >= 40) {
    fatesystem.命定之人.希尔薇娅.好感度 = 39;
  }
}