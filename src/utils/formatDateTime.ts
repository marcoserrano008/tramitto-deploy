export const formatDateTime = (
  isoString: string | null | undefined,
  timeZone: string = 'America/New_York'
): string => {
  if (!isoString) return '';

  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone,
  };

  return date.toLocaleDateString('es-ES', options);
};
