# Kuzola Mukucala - Gerador de Fotos com Moldura

Este é o site oficial do **Kuzola Mukucala (Acampamento Juvenil)** para gerar fotos com molduras comemorativas personalizadas.

O projeto é full-stack, feito com **React (Vite) + TypeScript + Tailwind CSS** no frontend, e um servidor **Node.js (Express)** no backend que salva de forma permanente as molduras enviadas pelos administradores diretamente na pasta do servidor, servindo-as como oficiais.

## 🚀 Funcionalidades

- **Molduras Oficiais Permanentes**: As molduras são salvas na pasta `public/frames/` do servidor de hospedagem.
- **Moldura Vertical (4:5)**: Proporção recomendada de 1200x1500 pixels.
- **Moldura Horizontal Quadrada (1:1)**: Proporção oficial atualizada para 1080x1080 pixels.
- **Ajustes Avançados de Imagem**: Rotação, zoom (escala), arrastar para reposicionar livremente, controles finos de brilho, contraste e saturação.
- **Alta Resolução**: O download renderiza a foto final em alta resolução com a moldura sobreposta perfeitamente.
- **Layout Responsivo**: Totalmente otimizado para dispositivos móveis (Android e iOS) com botões e interações de toque de no mínimo 48px.

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado na versão 18 ou superior.

### 1. Instalar as Dependências
Instale todos os pacotes necessários rodando:
```bash
npm install
```

### 2. Rodar em Modo de Desenvolvimento
Para rodar o servidor backend integrado com o frontend em tempo real (Vite dev middleware):
```bash
npm run dev
```
O projeto estará disponível no endereço: `http://localhost:3000`

### 3. Compilar para Produção (Build)
Para compilar o frontend estático e empacotar o servidor backend Node.js em um único arquivo otimizado:
```bash
npm run build
```
Este comando criará:
- A pasta `dist/` com todos os recursos do frontend estático.
- O arquivo compilado do servidor backend em `dist/server.cjs`.

### 4. Rodar em Produção
Depois de buildar, você pode iniciar o servidor de produção rodando:
```bash
npm run start
```

---

## 📂 Estrutura de Pastas Úteis

- `/public/frames/`: Pasta onde o servidor armazena os arquivos oficiais das molduras (`vertical.png` e `horizontal.png`).
- `/src/components/DefaultFrames.ts`: Contém os designs originais em SVG caso não haja molduras personalizadas salvas.
- `/src/components/AdminModal.tsx`: Painel de administração para alterar as molduras.
- `/src/components/PhotoEditor.tsx`: Editor interativo de fotos.

---

## ⚙️ Configuração para Hospedagem no GitHub / VPS

Para colocar no GitHub e hospedar (ex: VPS, Heroku, Render, Railway, Cloud Run):
1. **Repositório**: Dê um `git init`, adicione os arquivos (`git add .`), commit (`git commit -m "feat: site oficial kuzola"`) e faça o push para seu repositório no GitHub.
2. **Ignorar Builds**: O arquivo `.gitignore` já está configurado para ignorar o `node_modules/` e a pasta de build `dist/`.
3. **Persistência de Molduras**: Certifique-se de que o servidor de hospedagem que você escolher possui armazenamento persistente se você deseja manter as molduras enviadas pelo painel de admin vivos após reinicializações do container (por exemplo, usando Volumes de Armazenamento no Render/Railway, ou simplesmente hospedando em uma VPS tradicional).
