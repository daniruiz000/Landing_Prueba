import mongoose, { Schema } from "mongoose";

const nameRegex = /^[A-Za-zÁ-ÿ\s]{3,19}$/;
const phoneRegex = /^(34|\+34|0034)?[6789]\d{8}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const dniRegex = /^\d{8}[A-Za-z]$/;
const nieRegex = /^[XYZ]\d{7}[A-Za-z]$/;
const authLetters = "TRWAGMYFPDXBNJZSQVHLCKE";
const nieMap: Record<string, number> = { X: 0, Y: 1, Z: 2 };

const validateName = (name: string): boolean => {
  return nameRegex.test(name.trim());
};

const validatePhoneNumber = (phoneNumber: string): boolean => {
  return phoneRegex.test(phoneNumber);
};

const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

const validateDNI = (rawDNI: string): boolean => {
  if (!dniRegex.test(rawDNI.toUpperCase())) {
    throw new Error("Formato de DNI inválido.");
  }

  const dniNumber = parseInt(rawDNI.substring(0, 8), 10);
  const letterIndex = dniNumber % 23;
  const calculatedLetter = authLetters.charAt(letterIndex);
  const providedLetter = rawDNI.charAt(8).toUpperCase();

  if (calculatedLetter !== providedLetter) {
    throw new Error("Letra del DNI incorrecta.");
  }

  return true;
};

const validateNIE = (rawNIE: string): boolean => {
  if (!nieRegex.test(rawNIE.toUpperCase())) {
    throw new Error("Formato de NIE inválido.");
  }

  const nieLetter = rawNIE.charAt(0).toUpperCase();
  const nieNumber = parseInt(rawNIE.substring(1, 8), 10);
  const letterIndex = (nieMap[nieLetter] * 7 + nieNumber) % 23;
  const calculatedLetter = authLetters.charAt(letterIndex);
  const providedLetter = rawNIE.charAt(8);

  if (calculatedLetter !== providedLetter) {
    throw new Error("Letra del NIE incorrecta.");
  }

  return true;
};

export interface IUserCreate {
  nombre: string;
  apellido: string;
  segundo_apellido: string;
  telefono: string;
  email: string;
  password: string;
  dni?: string;
  nie?: string;
  foto?: string;
}

export interface IUser extends IUserCreate, Document {
  createdAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    nombre: { type: String, required: true, validate: { validator: validateName, message: "Nombre inválido." } },
    apellido: { type: String, required: true, validate: { validator: validateName, message: "Apellido inválido." } },
    segundo_apellido: { type: String, required: true, validate: { validator: validateName, message: "Segundo apellido inválido." } },
    telefono: {
      type: String,
      unique: true,
      required: true,
      validate: { validator: validatePhoneNumber, message: "Número de teléfono inválido." },
    },
    email: { type: String, unique: true, required: true, validate: { validator: validateEmail, message: "Correo electrónico inválido." } },
    dni: { type: String, unique: true, validate: { validator: validateDNI, message: "Formato de DNI inválido." } },
    nie: { type: String, unique: true, validate: { validator: validateNIE, message: "Formato de NIE inválido." } },
    foto: { type: String },
  },
  { timestamps: true }
);

export const validUserPropertiesUser: string[] = ["nombre", "apellido", "segundo_apellido", "telefono", "email", "dni", "nie"];

export const User = mongoose.model<IUser>("User", userSchema);
