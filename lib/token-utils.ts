
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export class TokenUtils {
  /**
   * Genera un token único y seguro para evaluaciones externas
   */
  static generateSecureToken(): string {
    const uuid = uuidv4();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now().toString(36);
    
    // Combinar diferentes fuentes de aleatoriedad
    const combined = `${uuid}-${randomBytes}-${timestamp}`;
    
    // Hash final para mayor seguridad
    return crypto
      .createHash('sha256')
      .update(combined)
      .digest('hex')
      .substring(0, 32); // Token de 32 caracteres
  }

  /**
   * Calcula la fecha de expiración del token (24 horas por defecto)
   */
  static getTokenExpiry(hoursFromNow: number = 24): Date {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + hoursFromNow);
    return expiry;
  }

  /**
   * Verifica si un token ha expirado
   */
  static isTokenExpired(expiryDate: Date): boolean {
    return new Date() > expiryDate;
  }

  /**
   * Calcula el tiempo restante hasta la expiración
   */
  static getTimeUntilExpiry(expiryDate: Date): {
    hours: number;
    minutes: number;
    expired: boolean;
  } {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry.getTime() - now.getTime();

    if (diffMs <= 0) {
      return { hours: 0, minutes: 0, expired: true };
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes, expired: false };
  }
}
