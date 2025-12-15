export function uninject(): void {
  const idsToRemove = ["AP+", "LV+", "Location", "Time", "RedlineObjectSpecies", "UserSpecies"];
  uninjectPrompts(idsToRemove);
}
