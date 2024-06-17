
class Utils {
  static formatDateToInputValue(date: Date | string): string {
    if (typeof date === "string") return date; // Assume already in YYYY-MM-DD format
    return date.toISOString().split("T")[0];
  }

  static generateUUID() {
    return ([1e7].join('') + (-1e3 + -4e3 + -8e3 + -1e11)).replace(/[018]/g, c =>
      (parseInt(c, 16) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> parseInt(c, 16) / 4).toString(16)
    );
  }
  
}

export default Utils;
