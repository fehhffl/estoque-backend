# Estoque Backend

Este é o backend do sistema de estoque, responsável por gerenciar usuários, produtos e o estoque de forma segura e eficiente.

## Funcionalidades

- Gerenciamento de produtos (CRUD)
- Upload e recuperação de imagens em formato BLOB
- Gerenciamento de usuários com senhas criptografadas

## Arquitetura do Projeto

O sistema segue o padrão arquitetural **MVC** (Model-View-Controller), garantindo separação de responsabilidades e um código mais organizado e fácil de manter.

- **Model**: Camada responsável pela interação com o banco de dados e pelas entidades.

  - Localização: `models/`
  - Exemplos: `productModel.ts` e `userModel.ts`.
- **Controller**: Camada que lida com solicitações recebidas, fazendo a ponte entre o cliente e a camada de Model.

  - Localização: `controllers/`
  - Exemplos: `productController.ts` e `userController.ts`.
- **View**: Pode ser representada pelos dados retornados ao cliente (JSON).

Ponto de entrada da aplicação, configurando rotas e inicializando o servidor:
`server.ts`.

## Instalação e Configuração

1. **Node.js**

   - Baixe e instale o [Node.js](https://nodejs.org/en/download) se ainda não tiver instalado no seu computador.
2. **Baixe e instale MySQL Server**

   - Baixe [https://dev.mysql.com/downloads/mysql](https://dev.mysql.com/downloads/mysql) de acordo com o seu sistema operacional.
   - Configure a senha do usuário `root` durante a instalação e lembre-se dela.
3. **Clone o repositório**:

   ```bash
   git clone git@github.com:fehhffl/estoque-backend.git
   cd estoque-backend
   ```

4. **Instale as dependências**:

   ```bash
   npm install
   ```

5. **Configure as variáveis de ambiente**:
   Use o arquivo `.env` **fornecido por e-mail** para o projeto `estoque-backend` e coloque-o na raiz do projeto.
   Ele possui as seguintes variáveis:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha_do_root_do_mysql
   DB_NAME=estoque
   ```

   Abra ele e modifique o valor do `DB_PASSWORD` com a senha que você configurou do usuário `root` ao instalar o `MySQL` na sua máquina
6. **Dump do Banco de Dados**:
   O arquivo `estoque_dump.sql` **na pasta raiz do projeto**, contém a estrutura e o esquema do banco de dados necessários para o funcionamento do sistema, assim como alguns produtos já preenchidos.

   - Certifique-se de que você está na pasta estoque-backend (raiz)
   - Importe o dump do banco de dados:

     ```bash
     mysql -u root -p < estoque_dump.sql
     ```

7. **Inicie o servidor**:

   ```bash
   npm start
   ```

   O servidor estará disponível em `http://localhost:8000`.

## Endpoints

### Usuários

- **POST /register**: Cadastro de um novo usuário

  - Body:

    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```

- **POST /login**: Login de usuário

  - Body:

    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

### Produtos

- **GET /products**: Retorna todos os produtos
- **POST /products/create**: Cria um novo produto

  - Body:

    ```json
    {
      "name": "string",
      "description": "string",
      "value": number,
      "quantity": number
    }
    ```

- **PUT /products/:id**: Atualiza um produto

  - Body:

    ```json
    {
      "name": "string",
      "description": "string",
      "value": number,
      "quantity": number
    }
    ```

- **DELETE /products/:id**: Remove um produto
- **GET /products/:id/image**: Retorna a imagem de um produto
- **PUT /products/:id/image**: Atualiza a imagem de um produto

  - Body:

    ```json
    {
      "image": "base64_string"
    }
    ```

## Tecnologias Utilizadas

- **Node.js** com **Express**
- **TypeScript**
- **MySQL**
- **bcrypt** para criptografia de senhas

Desenvolvido com 💻 por Felipe Forioni.
