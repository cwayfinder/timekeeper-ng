export function deltaTime(timestamp1: number, timestamp2: number): string {
  const delta = new Date(timestamp2 - timestamp1);

  const parts = [delta.getUTCHours(), delta.getUTCMinutes(), delta.getUTCSeconds()];

  if (!parts[0]) {
    parts.shift();
  }

  return parts
    .map(part => String(part).padStart(2, '0'))
    .join(':');
}
