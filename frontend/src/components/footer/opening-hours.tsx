const HOURS = [
  { day: "Monday - Friday", time: "08:00 - 20:00" },
  { day: "Saturday", time: "09:00 - 21:00" },
  { day: "Sunday", time: "13:00 - 22:00" },
];

export function OpeningHours() {
  return (
    <ul className="flex flex-col gap-3 text-sm">
      {HOURS.map(({ day, time }) => (
        <li key={day} className="flex items-center justify-between gap-6">
          <span className="text-foreground/80">{day}</span>
          <span className="font-medium">{time}</span>
        </li>
      ))}
    </ul>
  );
}
