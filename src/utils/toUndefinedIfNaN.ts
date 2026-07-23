export default function toUndefinedIfNaN(value: any) {
  return Number.isNaN(value) ? undefined : value as number;
}