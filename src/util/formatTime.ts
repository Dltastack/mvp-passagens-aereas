export function formatTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
