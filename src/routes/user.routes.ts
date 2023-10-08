import { Router, Request, Response, NextFunction } from "express";
import { Repository } from "typeorm";
import { User } from "../models/User";
import { AppDataSource } from "../database/typeorm-datasource";
import { generateToken } from "../utils/token";
import { isAuth } from "../middlewares/auth.middleware";

const authEmail: string = process.env.AUTH_EMAIL as string;
const authPassword: string = process.env.AUTH_PASSWORD as string;

const userRepository: Repository<User> = AppDataSource.getRepository(User);

const userRouter = Router();

// -------------------------------- CRUD: CREATE --------------------------------

userRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = new User();
    Object.assign(newUser, req.body);

    const existingEmailUser = await userRepository.findOne({
      where: { email: req.body.email },
    });

    const existingDniUser = await userRepository.findOne({
      where: { dni: req.body.dni },
    });

    const existingPhone = await userRepository.findOne({
      where: { telefono: req.body.telefono },
    });

    if (existingEmailUser || existingDniUser || existingPhone) {
      return res.status(400).json({ error: "Usuario existente" });
    }

    if (req.body.nombre) {
      try {
        newUser.validateNombre(req.body.nombre);
      } catch (error) {
        return res.status(400).json({ error: "Nombre inválido" });
      }
    }

    if (req.body.apellido) {
      try {
        newUser.validateApellido(req.body.apellido);
      } catch (error) {
        return res.status(400).json({ error: "Apellido inválido" });
      }
    }

    if (req.body.segundo_apellido) {
      try {
        newUser.validateSegundoApellido(req.body.segundo_apellido);
      } catch (error) {
        return res.status(400).json({ error: "Segundo apellido inválido" });
      }
    }

    if (req.body.email) {
      try {
        newUser.validateEmail(req.body.email);
      } catch (error) {
        return res.status(400).json({ error: "Email inválido" });
      }
    }

    if (req.body.dni) {
      try {
        newUser.validateDni(req.body.dni);
      } catch (error) {
        return res.status(400).json({ error: "DNI inválido" });
      }
    }

    if (req.body.telefono) {
      try {
        newUser.validatePhoneNumber(req.body.telefono);
      } catch (error) {
        return res.status(400).json({ error: "Número de teléfono inválido" });
      }
    }

    const userSaved = await userRepository.save(newUser);
    res.status(201).json(userSaved);
  } catch (error) {
    next(error);
  }
});

// -------------------------------- CRUD: READ --------------------------------

userRouter.get("/", isAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.email === authEmail && req.password === authPassword) {
      const users: User[] = await userRepository.find();
      if (!users) {
        return res.status(404).json({ error: "No existen usuarios." });
      }
      res.json(users);
    } else {
      throw new Error("No tienes autorización para realizar esta operación");
    }
  } catch (error) {
    next(error);
  }
});

// -------------------------- Endpoint de LOGIN de Usuarios --------------------------------

userRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Se deben especificar los campos email y password" });
    }

    const match = email === authEmail && password === authPassword;

    if (!match) {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }

    const jwtToken = generateToken(email, password);
    console.log(`Usuario ${email} logado correctamente`);
    return res.status(200).json({ token: jwtToken });
  } catch (error) {
    next(error);
  }
});

// --------------------------- Endpoint para obtener Usuarios por ID --------------------------------

userRouter.get("/:id", isAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.email === authEmail && req.password === authPassword) {
      const idReceivedInParams = parseInt(req.params.id);

      const user = await userRepository.findOne({
        where: {
          id: idReceivedInParams,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json(user);
    } else {
      throw new Error("No tienes autorización para realizar esta operación");
    }
  } catch (error) {
    next(error);
  }
});

// -------------------------------- CRUD: UPDATE --------------------------------

userRouter.put("/:id", isAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.email === authEmail && req.password === authPassword) {
      const idReceivedInParams = parseInt(req.params.id);
      const userToUpdate = await userRepository.findOne({
        where: {
          id: idReceivedInParams,
        },
      });

      if (!userToUpdate) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (req.body.nombre !== undefined) {
        try {
          userToUpdate.validateNombre(req.body.nombre);
          userToUpdate.nombre = req.body.nombre;
        } catch (error) {
          return res.status(400).json({ error: "Nombre inválido" });
        }
      }

      if (req.body.apellido !== undefined) {
        try {
          userToUpdate.validateApellido(req.body.apellido);
          userToUpdate.apellido = req.body.apellido;
        } catch (error) {
          return res.status(400).json({ error: "Apellido inválido" });
        }
      }

      if (req.body.segundo_apellido !== undefined) {
        try {
          userToUpdate.validateSegundoApellido(req.body.segundo_apellido);
          userToUpdate.segundo_apellido = req.body.segundo_apellido;
        } catch (error) {
          return res.status(400).json({ error: "Segundo apellido inválido" });
        }
      }

      if (req.body.email !== undefined) {
        try {
          userToUpdate.validateEmail(req.body.email);
          userToUpdate.email = req.body.email;
        } catch (error) {
          return res.status(400).json({ error: "Email inválido" });
        }
      }

      if (req.body.dni !== undefined) {
        try {
          userToUpdate.validateDni(req.body.dni);
          userToUpdate.dni = req.body.dni;
        } catch (error) {
          return res.status(400).json({ error: "DNI inválido" });
        }
      }

      if (req.body.telefono !== undefined) {
        try {
          userToUpdate.validatePhoneNumber(req.body.telefono);
          userToUpdate.telefono = req.body.telefono;
        } catch (error) {
          return res.status(400).json({ error: "Número de teléfono inválido" });
        }
      }

      const updatedUser = await userRepository.save(userToUpdate);

      res.status(200).json(updatedUser);
    } else {
      throw new Error("No tienes autorización para realizar esta operación");
    }
  } catch (error) {
    next(error);
  }
});

// -------------------------------- CRUD: DELETE por Id --------------------------------

userRouter.delete("/:id", isAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.email === authEmail && req.password === authPassword) {
      const idReceivedInParams = parseInt(req.params.id);

      const userToRemove = await userRepository.findOne({
        where: {
          id: idReceivedInParams,
        },
      });

      if (!userToRemove) {
        res.status(404).json({ error: "Usuario no encontrado" });
      } else {
        await userRepository.remove(userToRemove);
        res.json(userToRemove);
      }
    } else {
      throw new Error("No tienes autorización para realizar esta operación");
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
