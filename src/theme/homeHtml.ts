const promotion = process.env.PROMOCION_NAME as string;

export const homePageStyles = `
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-content: center;
            align-items: center;
          }
          div {
            align-selft: center;
            margin: 200px auto;
            width: 300px;
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

export const homePageContent = `
      <div>
        <h3>BIENVENIDO AL SERVIDOR DE ${promotion}.</h3>
        <p>Necesita logarse para poder tener acceso a los servicios de administrador.</p>
        <a href="/login">Acceso a Login</a>
      </div>
        
      `;
