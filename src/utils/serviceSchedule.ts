export type OperatingScheduleEntry = {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  isHoliday: boolean;
};

export type OperatingStatus = {
  isOpen: boolean;
  reason?: string;
};

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const parseTimeToMinutes = (timeText: string) => {
  const match = String(timeText || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
};

export const getOperatingStatus = (
  schedule: OperatingScheduleEntry[] | null | undefined,
  date: Date = new Date(),
): OperatingStatus => {
  if (!Array.isArray(schedule)) {
    return { isOpen: true };
  }

  const dayName = DAY_NAMES[date.getDay()];
  const entry = schedule.find((item) => item?.day === dayName);
  if (!entry) {
    return { isOpen: true };
  }

  if (entry.isHoliday) {
    return { isOpen: false, reason: `${dayName} is a holiday` };
  }

  if (entry.isOpen === false) {
    return { isOpen: false, reason: `${dayName} is closed` };
  }

  const openMinutes = parseTimeToMinutes(entry.openTime);
  const closeMinutes = parseTimeToMinutes(entry.closeTime);
  if (openMinutes === null || closeMinutes === null) {
    return { isOpen: true };
  }

  const nowMinutes = date.getHours() * 60 + date.getMinutes();
  if (nowMinutes < openMinutes || nowMinutes > closeMinutes) {
    return {
      isOpen: false,
      reason: `Service is closed. Hours: ${entry.openTime} - ${entry.closeTime}`,
    };
  }

  return { isOpen: true };
};
