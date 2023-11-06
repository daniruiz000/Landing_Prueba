/* eslint-disable @typescript-eslint/indent */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { CustomError } from "../../server/checkErrorRequest.middleware";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  segundo_apellido: string;

  @Column({ unique: true })
  telefono: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  dni: string;

  @Column({ unique: true, nullable: true })
  nie: string;

  @Column({ type: "longtext", nullable: true })
  foto: string;

  // Expresiones regulares
  private static readonly nameRegex = /^[A-Za-zÁ-ÿ\s]{3,19}$/;
  private static readonly phoneRegex = /^(34|\+34|0034)?[6789]\d{8}$/;
  private static readonly emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private static readonly dniRegex = /^\d{8}[A-Za-z]$/;
  private static readonly nieRegex = /^[XYZ]\d{7}[A-Za-z]$/;
  private static readonly nieMap: Record<string, number> = { X: 0, Y: 1, Z: 2 };
  private static readonly authLetters = "TRWAGMYFPDXBNJZSQVHLCKE";

  // Función de validación genérica para nombres
  private static validateName(name: string): boolean {
    return this.nameRegex.test(name.trim());
  }

  validateNombre(): boolean {
    return User.validateName(this.nombre);
  }

  validateApellido(): boolean {
    return User.validateName(this.apellido);
  }

  validateSegundoApellido(): boolean {
    return User.validateName(this.segundo_apellido);
  }

  validatePhoneNumber(): boolean {
    return User.phoneRegex.test(this.telefono);
  }

  validateEmail(): boolean {
    return User.emailRegex.test(this.email);
  }

  validateDNI(): boolean {
    const rawDNI = this.dni;
    if (!User.dniRegex.test(rawDNI.toUpperCase())) {
      throw new CustomError("Formato de DNI inválido.", 400);
    }

    const dniNumber = parseInt(rawDNI.substring(0, 8), 10);
    const letterIndex = dniNumber % 23;
    const calculatedLetter = User.authLetters.charAt(letterIndex);
    const providedLetter = rawDNI.charAt(8).toUpperCase();

    if (calculatedLetter !== providedLetter) {
      throw new CustomError("Letra del DNI incorrecta.", 400);
    }

    return true;
  }

  validateNIE(): boolean {
    const rawNIE = this.nie;
    if (!User.nieRegex.test(rawNIE.toUpperCase())) {
      throw new CustomError("Formato de NIE inválido.", 400);
    }

    const nieLetter = rawNIE.charAt(0).toUpperCase();
    const nieNumber = parseInt(rawNIE.substring(1, 8), 10);
    const letterIndex = (User.nieMap[nieLetter] * 7 + nieNumber) % 23;
    const calculatedLetter = User.authLetters.charAt(letterIndex);
    const providedLetter = rawNIE.charAt(8);

    if (calculatedLetter !== providedLetter) {
      throw new CustomError("Letra del NIE incorrecta.", 400);
    }

    return true;
  }
}

export const validUserPropertiesUser: string[] = ["nombre", "apellido", "segundo_apellido", "telefono", "email", "dni", "nie"];
