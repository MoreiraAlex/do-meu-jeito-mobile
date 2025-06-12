# DO MEU JEITO - MOBILE

Aplicativo mobile que permite a criação e participação em mini-jogos com diversos propósitos, como estudo, entretenimento e outros.
Nele, o usuário pode criar seus próprios mini-jogos, que podem ser privados — para jogar apenas com amigos — ou públicos, disponíveis para todos. Também é possível explorar e participar de mini-jogos criados por outros usuários.

## Como configurar o ambiente

1. **Clonar o repositório**  
   Clone este repositório para sua máquina local utilizando o comando:
   ```bash
   git clone https://github.com/MoreiraAlex/do-meu-jeito-mobile.git
   ```

2. **Instalar dependências**  
   Execute o comando abaixo para instalar as dependências do projeto:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**  
   Crie um arquivo .env na raiz do projeto com as seguintes informações:
    ```bash
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=colocar sua chave publica do Clerk
    EXPO_PUBLIC_URL_API=https://do-meu-jeito-api.onrender.com
    ```
4. **Configurar ESLint**  
   Certifique-se de que a extensão **ESLint** está ativa no seu editor.

5. **Configurar o arquivo `settings.json`**  
   No VS Code, abra as configurações do usuário no formato JSON (pressione `F1` e procure por `Open User Settings (JSON)`) e adicione o seguinte conteúdo:
   ```json
   "editor.codeActionsOnSave": {
       "source.fixAll.eslint": "always"
   }
   ```

## Como executar o projeto
1. **Iniciar o projeto**  
    No terminal, execute o seguinte comando para iniciar a aplicação:
   ```bash
   npm run start
   ```

2. **Acessar o aplicativo**  
   Instale o aplicativo Expo Go no seu celular.
   Em seguida, abra o app e escaneie o QR Code exibido no terminal para visualizar o projeto no dispositivo.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).