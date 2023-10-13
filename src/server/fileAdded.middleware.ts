import multer from "multer";

export const fileAdded = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const storage = multer.memoryStorage();
    const upload = multer({ storage });
    next();
  } catch (error) {
    res.status(403).json("No tienes autorización para realizar esta operación");
  }
};
