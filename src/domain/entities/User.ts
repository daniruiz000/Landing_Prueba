/* eslint-disable @typescript-eslint/indent */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
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

  @Column()
  dni: string;

  validateNombre(): boolean {
    const rawFirstName = this.nombre;
    const nameRegex = /^[A-Za-zÁ-ÿ\s]{2,19}$/;
    return nameRegex.test(rawFirstName.trim());
  }

  validateApellido(): boolean {
    const rawLastName = this.apellido;
    const nameRegex = /^[A-Za-zÁ-ÿ\s]{2,19}$/;
    return nameRegex.test(rawLastName.trim());
  }

  validateSegundoApellido(): boolean {
    const rawLastName = this.segundo_apellido;
    const nameRegex = /^[A-Za-zÁ-ÿ\s]{2,19}$/;
    return nameRegex.test(rawLastName.trim());
  }

  validatePhoneNumber(): boolean {
    const rawPhoneNumber = this.telefono;
    const phoneRegex = /^(34|\+34|0034)?[6789]\d{8}$/;
    return phoneRegex.test(rawPhoneNumber);
  }

  validateEmail(): boolean {
    const rawEmail = this.email;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(rawEmail);
  }

  validateDni(): boolean {
    const rawDni = this.dni;
    const dniRegex = /^[0-9]{8}[a-zA-Z]$/;

    if (dniRegex.test(rawDni)) {
      const validChars = "TRWAGMYFPDXBNJZSQVHLCKET";
      const letter = rawDni.charAt(8).toUpperCase();
      const charIndex = parseInt(rawDni.substring(0, 8)) % 23;

      return validChars.charAt(charIndex) === letter;
    }

    return false;
  }
}
