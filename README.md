# 🛡️ Portal Orc

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deploy-success?style=for-the-badge&logo=github)](https://seu-usuario.github.io/Portal-Orc/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](#)

> Repositório central de documentação, diretrizes de governança e artefatos de Engenharia de Software do projeto **Portal Orc**, desenvolvido pela Orc'estra Gamificação.

Este repositório visa centralizar toda a base de conhecimento, estratégias de engenharia e gestão do projeto, garantindo transparência, rastreabilidade e padronização para a equipe de desenvolvimento. O artefato principal deste repositório é a sua [Documentação via GitHub Pages](https://diprojorcestra.github.io/Portal-Orc/).

---

## 📑 Índice

* [Estrutura de Documentação](#-estrutura-de-documentação)
* [Acesso à Documentação (GitHub Pages)](#-acesso-à-documentação-github-pages)
* [Execução Local](#-execução-local)
* [Padrões e Contribuição](#-padrões-e-contribuição)
* [Equipe](#-equipe--ciclo-atual)
* [Licença](#-licença)

---

## 📂 Estrutura de Documentação

A documentação está modularizada dentro do diretório `/docs`, dividida nas seguintes categorias essenciais da Engenharia de Software:

* **📈 Acompanhamento (`/docs/acompanhamento`)**
  * `atas.html`: Registro formal das reuniões e decisões arquiteturais.
  * `cronograma.html`: Planejamento temporal e marcos (milestones) do projeto.
  * `relatos.html`: Relatos de progresso e feedbacks.

* **🎯 Estratégias (`/docs/estrategias`)**
  * `engenharia-requisitos.html`: Abordagem adotada para levantamento e elicitação.
  * `estrategia-engenharia.html`: Visão geral da arquitetura e engenharia do produto.
  * `dor-dod.html`: Critérios de *Definition of Ready* (DoR) e *Definition of Done* (DoD).

* **📊 Gestão (`/docs/gestao`)**
  * `escopo.html`: Definição e limites do produto (In/Out).
  * `priorizacao.html`: Técnicas utilizadas para ordenação do Backlog.
  * `requisitos.html`: Documento detalhado de requisitos funcionais e não-funcionais.

* **📐 Padrões (`/docs/padroes`)**
  * `casos.html`: Padrão de documentação para Casos de Uso.
  * `commits.html`: Convenção rigorosa de versionamento semântico.
  * `issues.html`: Templates e fluxos para abertura de *Issues*.
  * `pullrequest.html`: Critérios obrigatórios para revisão de código e merge.

---

## 🌐 Acesso à Documentação (GitHub Pages)

A documentação estática é construída puramente com HTML, CSS e JavaScript e está hospedada de forma contínua através do GitHub Pages.

**Acesse aqui:** https://diprojorcestra.github.io/Portal-Orc/

---

## 💻 Execução Local

Caso precise rodar a documentação localmente para testar alterações estruturais ou de estilo, basta clonar o repositório e abrir o arquivo index no seu navegador:

```bash
# 1. Clone o repositório
git clone https://github.com/DiProjOrcestra/Portal-Orc.git

# 2. Acesse o diretório do projeto
cd Portal-Orc/docs

# 3. Abra o arquivo principal no navegador de sua preferência
# (No Linux/Ubuntu)
xdg-open index.html

# (Ou utilize uma extensão como Live Server no VSCode)

```


## 🤝 Padrões e Contribuição

O rigor técnico é a base deste projeto. Para contribuir, é imperativo a leitura e o cumprimento estrito das nossas diretrizes de desenvolvimento:

1. **Issues:** Nenhuma linha de código ou documentação deve ser alterada sem uma *Issue* rastreável correspondente. Leia nosso [Padrão de Issues](https://diprojorcestra.github.io/Portal-Orc/padroes/issues.html).
2. **Commits:** Utilizamos *Conventional Commits*. Commits fora do padrão serão rejeitados. Leia nosso [Padrão de Commits](https://diprojorcestra.github.io/Portal-Orc/padroes/commits.html).
3. **Pull Requests:** Todo código deve passar por code review. O PR deve seguir o [Template de Pull Request](https://diprojorcestra.github.io/Portal-Orc/padroes/pullrequest.html) e atender à nossa [Definition of Done](https://diprojorcestra.github.io/Portal-Orc/estrategias/dor-dod.html).

---

<h2 align="center">👥 Equipe — Ciclo Atual</h2>

O Portal Orc adota uma governança de rotatividade baseada em **Ciclos**. A equipe é dividida em frentes específicas do projeto, permitindo sobreposição de papéis para otimizar a entrega técnica e a disseminação de conhecimento.

> 📜 **Histórico:** Para consultar a composição de membros de ciclos anteriores, acesse nosso [Registro de Ciclos Passados](./docs/gestao/historico-equipes.html).

<h3 align="center">🎯 Gestão & Liderança</h3>
<div align="center">
  <table>
    <tr>
      <!-- Acompanhante -->
      <td align="center">
        <a href="https://github.com/FabioVieira05" style="text-decoration: none;">
          <img src="https://github.com/FabioVieira05.png" width="100px;" alt="Foto do Fábio"/><br>
          <sub><b>Fábio Alessandro</b></sub><br>
          <sub>Acompanhante</sub>
        </a>
      </td>
      <!-- Gerente -->
      <td align="center">
        <a href="https://github.com/eii-yahs" style="text-decoration: none;">
          <img src="https://github.com/eii-yahs.png" width="100px;" alt="Foto da Yasmim"/><br>
          <sub><b>Yasmim de Souza</b></sub><br>
          <sub>Gerente</sub>
        </a>
      </td>
    </tr>
  </table>
</div>

<h3 align="center">🎨 Design (Figma)</h3>
<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/eii-yahs" style="text-decoration: none;">
          <img src="https://github.com/eii-yahs.png" width="100px;" alt="Foto da Yasmim"/><br>
          <sub><b>Yasmim de Souza</b></sub><br>
          <sub>Design / Figma</sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/juliaamandasl" style="text-decoration: none;">
          <img src="https://github.com/juliaamandasl.png" width="100px;" alt="Foto da Julinha"/><br>
          <sub><b>Julia Amanda</b></sub><br>
          <sub>Design / Figma</sub>
        </a>
      </td>
    </tr>
  </table>
</div>

<h3 align="center">💻 Front-end</h3>
<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/eii-yahs" style="text-decoration: none;">
          <img src="https://github.com/eii-yahs.png" width="100px;" alt="Foto da Yasmim"/><br>
          <sub><b>Yasmim de Souza</b></sub><br>
          <sub>Front-end</sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Hadex-JM" style="text-decoration: none;">
          <img src="https://github.com/Hadex-JM.png" width="100px;" alt="Foto do Marquinhos"/><br>
          <sub><b>João Marcos</b></sub><br>
          <sub>Front-end</sub>
        </a>
      </td>
    </tr>
  </table>
</div>

<h3 align="center">⚙️ Back-end</h3>
<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/OliveiraThiago14" style="text-decoration: none;">
          <img src="https://github.com/OliveiraThiago14.png" width="100px;" alt="Foto do Thiago"/><br>
          <sub><b>Thiago Alencar</b></sub><br>
          <sub>Back-end</sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Natan8643" style="text-decoration: none;">
          <img src="https://github.com/Natan8643.png" width="100px;" alt="Foto do Natan"/><br>
          <sub><b>Natan José</b></sub><br>
          <sub>Back-end</sub>
        </a>
      </td>
    </tr>
  </table>
</div>

<h3 align="center">🚀 DevOps</h3>
<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/grazi-alves" style="text-decoration: none;">
          <img src="https://github.com/grazi-alves.png" width="100px;" alt="Foto da Grazi"/><br>
          <sub><b>Graziele Alves</b></sub><br>
          <sub>DevOps</sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/bernardoccs1" style="text-decoration: none;">
          <img src="https://github.com/bernardoccs1.png" width="100px;" alt="Foto do Bernardo"/><br>
          <sub><b>Bernardo Campos</b></sub><br>
          <sub>DevOps</sub>
        </a>
      </td>
    </tr>
  </table>
</div>

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.