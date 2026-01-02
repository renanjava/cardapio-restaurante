export function calculatePlanDates(): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date();
  
  currentDate.setDate(currentDate.getDate() + 1);
  
  while (dates.length < 7) {
    if (currentDate.getDay() !== 0) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

export function isValidDeliveryTime(time: string): boolean {
  if (!time || typeof time !== 'string') {
    return false;
  }
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timeRegex.test(time)) {
    return false;
  }
  
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const minTime = 11 * 60;
  const maxTime = 14 * 60;
  
  return totalMinutes >= minTime && totalMinutes <= maxTime;
}

export function formatDateForDB(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getDayName(date: Date): string {
  const dayNames = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ];
  return dayNames[date.getDay()];
}

export function formatDateForDisplay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
