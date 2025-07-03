export function getClassName(classCode: string) {
  switch (classCode) {
    case "Y":
      return "Econômica"
    case "W":
      return "Premium Economy"
    case "J":
      return "Executiva"
    case "F":
      return "Primeira"
    default:
      return "Classe desconhecida"
  }
}