import {
  Entity, // Para hacer entidades
  PrimaryGeneratedColumn, // Para crear una columna id y autogenerada
  Column,
  CreateDateColumn, // Para crear columnas
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  createdAt: Date;

  validatePhoneNumber(rawPhoneNumber: string): void {
    const phoneRegex = /^(34|\+34|0034)?[6789]\d{8}$/;
    if (phoneRegex.test(rawPhoneNumber)) {
      this.telefono = rawPhoneNumber;
    } else {
      throw new Error("Número de teléfono inválido");
    }
  }
  validateNombre(rawfirstName: string): void {
    const nameRegex = /^[A-Za-zÁ-ÿ\s]{2,19}$/;
    if (nameRegex.test(rawfirstName.trim())) {
      this.nombre = rawfirstName.toLowerCase();
    } else {
      throw new Error("El nombre no cumple con los requisitos.");
    }
  }

  validateApellido(rawlastName: string): void {
    const nameRegex = /^[A-Za-zÁ-ÿ\s]{2,19}$/;
    if (nameRegex.test(rawlastName.trim())) {
      this.apellido = rawlastName.toLowerCase();
    } else {
      throw new Error("El apellido no cumple con los requisitos.");
    }
  }
  validateSegundoApellido(rawlastName: string): void {
    const nameRegex = /^[A-Za-zÁ-ÿ\s]{2,19}$/;
    if (nameRegex.test(rawlastName.trim())) {
      this.segundo_apellido = rawlastName.toLowerCase();
    } else {
      throw new Error("El segundo apellido no cumple con los requisitos.");
    }
  }

  validateEmail(rawEmail: string): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(rawEmail)) {
      this.email = rawEmail;
    } else {
      throw new Error("Email Invalido");
    }
  }

  validateDni(rawDni: string): void {
    const dniRegex = /^[0-9]{8}[a-zA-Z]$/;

    if (dniRegex.test(rawDni)) {
      const validChars = "TRWAGMYFPDXBNJZSQVHLCKET";
      const letter = rawDni.charAt(8).toUpperCase();
      const charIndex = parseInt(rawDni.substring(0, 8)) % 23;

      if (validChars.charAt(charIndex) === letter) {
        this.dni = rawDni.toUpperCase();
      } else {
        throw new Error("DNI Inválido");
      }
    } else {
      throw new Error("Formato de DNI Inválido");
    }
  }
}
