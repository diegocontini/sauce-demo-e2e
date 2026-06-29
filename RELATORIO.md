# Relatório de Testes Automatizados de Front-end com Cypress

**Disciplina:** Teste de Software — UTFPR
**Ferramenta:** Cypress 13
**Site sob teste:** https://www.saucedemo.com

---

## 1. Objetivo

Aplicar testes automatizados de front-end (end-to-end) em um site real,
utilizando o Cypress para verificar a **funcionalidade** e a **aparência
visual** da aplicação. O exercício envolve identificar cenários testáveis,
escrever e executar os scripts de teste e documentar os resultados.

## 2. Site escolhido

Foi escolhido o **[SauceDemo](https://www.saucedemo.com)**, uma aplicação de
e-commerce de demonstração mantida pela Sauce Labs. Motivos da escolha:

- Possui fluxos clássicos de comércio eletrônico (login, catálogo, carrinho,
  checkout), cobrindo um conjunto variado de funcionalidades.
- Usa atributos `data-test` nos elementos, o que favorece seletores estáveis.
- Oferece **usuários especiais** que simulam propositalmente bugs e problemas de
  desempenho/visuais — excelentes para demonstrar a detecção de defeitos.

### Credenciais

Todos os usuários usam a senha `secret_sauce`:

| Usuário                   | Comportamento esperado                              |
| ------------------------- | --------------------------------------------------- |
| `standard_user`           | Funciona normalmente                                |
| `locked_out_user`         | Login bloqueado (mensagem de erro)                  |
| `problem_user`            | Bugs visuais (imagens, ordenação, etc.)             |
| `performance_glitch_user` | Funciona, porém com lentidão proposital             |
| `error_user`              | Erros em determinados fluxos                        |
| `visual_user`             | Inconsistências visuais                             |

## 3. Cenários de teste identificados

Foram definidos 6 grupos de cenários, totalizando **30 casos de teste**:

| #  | Grupo (arquivo)                | Cenários                                                                                  |
| -- | ------------------------------ | ----------------------------------------------------------------------------------------- |
| 01 | Login (`01-login.cy.js`)       | Login com sucesso; usuário bloqueado; senha inválida; usuário obrigatório; senha obrigatória |
| 02 | Produtos (`02-inventory.cy.js`)| Listagem dos 6 produtos; página de detalhe; ordenação por nome Z–A; preço crescente; preço decrescente |
| 03 | Carrinho (`03-cart.cy.js`)     | Adicionar 1 item; adicionar vários; remover na listagem; listar no carrinho; remover no carrinho; continuar comprando |
| 04 | Checkout (`04-checkout.cy.js`) | Compra completa; cálculo do subtotal; nome obrigatório; CEP obrigatório; cancelar checkout |
| 05 | Navegação (`05-navigation.cy.js`) | Logout pelo menu; reset do estado; item "All Items"; bloqueio de rota sem login; links do rodapé |
| 06 | Usuários especiais (`06-user-behaviors.cy.js`) | Lentidão do `performance_glitch_user`; bug de imagem do `problem_user`; `error_user` no carrinho; `visual_user` no catálogo |

## 4. Configuração do ambiente

1. **Inicialização do projeto** com `npm`, declarando o Cypress e o reporter
   como dependências de desenvolvimento (`package.json`).
2. **`cypress.config.js`** define:
   - `baseUrl: https://www.saucedemo.com` (URLs relativas nos testes);
   - viewport de 1280×720;
   - `defaultCommandTimeout` de 10s (acomoda o `performance_glitch_user`);
   - o **cypress-mochawesome-reporter** para gerar o relatório HTML.
3. **Comandos customizados** (`cypress/support/commands.js`) reduzem
   duplicação: `login`, `loginAsStandard`, `visitFresh`, `addProductToCart` e
   `cartCount`.
4. **Fixture** (`cypress/fixtures/users.json`) centraliza usuários e senha.

Para executar:

```bash
npm install
npm run cy:run     # headless + gera o relatório
npm run cy:open    # modo interativo
```

## 5. Execução dos testes — Resultados

Execução headless (`npm run cy:run`) no Electron (navegador padrão do Cypress):

| Arquivo                  | Testes | Passou | Falhou | Tempo  |
| ------------------------ | :----: | :----: | :----: | :----: |
| 01-login.cy.js           |   5    |   5    |   0    | ~03s   |
| 02-inventory.cy.js       |   5    |   5    |   0    | ~05s   |
| 03-cart.cy.js            |   6    |   6    |   0    | ~06s   |
| 04-checkout.cy.js        |   5    |   5    |   0    | ~09s   |
| 05-navigation.cy.js      |   5    |   5    |   0    | ~06s   |
| 06-user-behaviors.cy.js  |   4    |   4    |   0    | ~08s   |
| **Total**                | **30** | **30** | **0**  | **~40s** |

✅ **Resultado final: 30/30 testes aprovados (100%).**

O relatório detalhado, com gráficos e capturas de tela de eventuais falhas, é
gerado em **`cypress/reports/index.html`** (abrir no navegador). As capturas de
tela de falhas, quando ocorrem, ficam em `cypress/screenshots/`.

## 6. Erros e problemas encontrados

Durante o desenvolvimento, um ponto relevante foi identificado:

### 6.1. Bug visual do `problem_user` (defeito do site)

O `problem_user` renderiza **todos os 6 produtos com a mesma imagem** (uma
imagem quebrada). O teste em `06-user-behaviors.cy.js` documenta e *verifica*
esse defeito, garantindo que exista exatamente 1 imagem distinta — ou seja, o
teste comprova a presença do bug:

```js
const sources = [...$imgs].map((img) => img.getAttribute('src'))
expect(new Set(sources).size).to.equal(1)  // bug conhecido
```

Outros usuários especiais também foram exercitados: o `performance_glitch_user`
exigiu tolerância maior de tempo (absorvida pelo `defaultCommandTimeout`).

## 7. Melhorias e otimizações

**Já aplicadas neste projeto:**

- **Comandos customizados** (`cy.login`, `cy.addProductToCart`, etc.) eliminam
  repetição e tornam os testes mais legíveis.
- **Fixture de usuários** centraliza credenciais, evitando *strings* mágicas.
- **Seletores `data-test`** em vez de classes/CSS frágeis, reduzindo a
  manutenção quando o layout muda.
- **Relatório HTML automático** com capturas de tela embutidas.

**Propostas de evolução futura:**

1. **`cy.session`** para cachear o login entre testes e reduzir ainda mais o
   tempo de execução.
2. **Page Objects** para encapsular seletores e ações por página, melhorando a
   organização à medida que a suíte cresce.
3. **Testes de regressão visual** (ex.: `cypress-image-snapshot`) para capturar
   automaticamente as inconsistências do `visual_user` e do `problem_user`.
4. **Integração contínua (CI)** com GitHub Actions, publicando o relatório a
   cada *push*.
5. **Cobertura entre navegadores** executando a suíte também no Chrome/Firefox.
6. **Massa de dados parametrizada** para rodar o mesmo fluxo com vários usuários
   via `forEach`.

## 8. Conclusão

A suíte cobre os principais fluxos do SauceDemo (login, catálogo, carrinho,
checkout, navegação e usuários especiais) com 30 casos automatizados, todos
aprovados. O exercício demonstrou não só a escrita de scripts Cypress, mas
também a **detecção documentada de um defeito do site** (imagens do
`problem_user`), cumprindo os objetivos propostos.

---

## Anexo — Como reproduzir

```bash
git clone git@github.com:diegocontini/sauce-demo-e2e.git
cd cypress-proj
npm install
npm run cy:run
# abrir cypress/reports/index.html no navegador
```
