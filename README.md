# Testes E2E do SauceDemo com Cypress

Suíte de testes automatizados de front-end (end-to-end) para o site de
demonstração de e-commerce **[SauceDemo](https://www.saucedemo.com)**,
desenvolvida com **[Cypress](https://www.cypress.io/)**.

Trabalho da disciplina de **Teste de Software** (UTFPR).

> O código e os identificadores estão em inglês; a documentação está em
> português.

---

## 📋 Sobre o projeto

O [SauceDemo](https://www.saucedemo.com) é um site de e-commerce fictício, muito
usado para praticar automação de testes. Ele oferece login, catálogo de
produtos, carrinho de compras e um fluxo completo de checkout — além de
**usuários especiais** que reproduzem propositalmente bugs e comportamentos
anômalos, ótimos para exercitar testes.

Esta suíte cobre os principais fluxos do site com **30 casos de teste**
distribuídos em 6 arquivos.

## 🛠️ Tecnologias

- [Node.js](https://nodejs.org/) (testado com a versão 22)
- [Cypress](https://www.cypress.io/) 13
- [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter)
  para o relatório em HTML

## 🚀 Como executar

### 1. Pré-requisitos

- Node.js 18 ou superior instalado.

### 2. Instalar as dependências

```bash
npm install
```

### 3. Executar os testes

**Modo headless (linha de comando)** — executa toda a suíte e gera o relatório:

```bash
npm run cy:run
```

**Modo interativo (interface gráfica)** — abre o Cypress para rodar/depurar
testes individualmente:

```bash
npm run cy:open
```

**Executar um único arquivo de teste:**

```bash
npx cypress run --spec cypress/e2e/01-login.cy.js
```

## 📊 Relatório de resultados

Após `npm run cy:run`, é gerado um relatório HTML em:

```
cypress/reports/index.html
```

Basta abrir esse arquivo no navegador para ver o resumo dos testes, gráficos,
tempos de execução e capturas de tela de eventuais falhas.

Uma análise detalhada (cenários, resultados, erros encontrados e propostas de
melhoria) está em **[RELATORIO.md](./RELATORIO.md)**.

## 🔐 Credenciais de teste

Todos os usuários usam a senha `secret_sauce`. Os nomes de usuário ficam em
`cypress/fixtures/users.json`:

| Usuário                   | Comportamento                                            |
| ------------------------- | -------------------------------------------------------- |
| `standard_user`           | Usuário normal, funciona sem problemas                   |
| `locked_out_user`         | Bloqueado: o login retorna mensagem de erro              |
| `problem_user`            | Possui bugs visuais (ex.: todas as imagens iguais)       |
| `performance_glitch_user` | Funciona, porém com lentidão proposital                  |
| `error_user`              | Apresenta erros em alguns fluxos                         |
| `visual_user`             | Possui inconsistências visuais                           |

## 📁 Estrutura do projeto

```
cypress.config.js              # configuração (baseUrl, viewport, reporter)
cypress/
  e2e/                         # arquivos de teste (specs)
    01-login.cy.js             # login (sucesso, falha e validações)
    02-inventory.cy.js         # listagem, detalhe e ordenação de produtos
    03-cart.cy.js              # adicionar/remover itens e carrinho
    04-checkout.cy.js          # fluxo de compra, totais e validações
    05-navigation.cy.js        # menu, logout, reset e proteção de rota
    06-user-behaviors.cy.js    # usuários especiais
  fixtures/users.json          # usuários e senha
  support/
    commands.js                # comandos customizados
    e2e.js                     # hooks globais
  reports/                     # relatório gerado (não versionado)
```

## 🧪 Cenários testados

1. **Login** — login bem-sucedido, usuário bloqueado, senha inválida e
   validação de campos obrigatórios.
2. **Produtos** — exibição dos 6 produtos, página de detalhe e ordenação
   (nome A–Z/Z–A, preço crescente/decrescente).
3. **Carrinho** — adicionar e remover itens, contador (badge) e página do
   carrinho.
4. **Checkout** — fluxo completo de compra, cálculo do subtotal, validação do
   formulário e cancelamento.
5. **Navegação** — menu lateral, logout, *reset* do estado, proteção de rota
   sem autenticação e links de rodapé.
6. **Usuários especiais** — verificação dos comportamentos de
   `performance_glitch_user`, `problem_user`, `error_user` e `visual_user`.

## ⚠️ Observação técnica

O SauceDemo registra um *service worker* que faz cache das páginas e, após
algumas navegações, deixa de disparar o evento `load` esperado pelo Cypress,
causando falhas intermitentes de `timedOutWaitingForPageLoad`. A suíte contorna
isso removendo o *service worker* antes de cada carregamento de página
(`cypress/support/e2e.js`) e usando um parâmetro *cache-busting* em
`cy.visitFresh`. Detalhes em [RELATORIO.md](./RELATORIO.md).
