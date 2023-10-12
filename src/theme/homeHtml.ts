const database = process.env.SQL_DATABASE as string;

export const pageStyles = `
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            padding: 20px;
          }
          h3 {
            color: #333;
          }
          p {
            color: #777;
          }
          a {
            display: inline-block;
            text-decoration: none;
            color: #fff;
            background-color: #007BFF;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
            transition: background-color 0.3s;
          }
          a:hover {
            background-color: #0056b3;
          }
        </style>
      `;

export const pageContent = `
        <h3>Esta es la home de nuestra API.</h3>
        <p>Estamos utilizando la BBDD de ${database}.</p>
        <a href="/login">Acceso a Login</a>
      `;
