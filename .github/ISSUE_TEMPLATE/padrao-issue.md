---
name: "Padrão de Caso de Uso"
about: "Template baseado na documentação oficial para criação de issues de Casos de Uso."
title: "UC-XX: Nome do caso de uso"
labels: ""
assignees: ""
---

## Objetivo
Descreva o que o usuário deseja realizar.

## Ator
- [ ] Usuário
- [ ] Administrador
- [ ] Sistema
- [ ] Outro: _________

## Pré-condições
As condições que devem ser satisfeitas antes da execução do caso de uso.

**Exemplo:**
- [ ] O usuário está autenticado.
- [ ] Possui as permissões necessárias.
- [ ] Os dados obrigatórios já existem.

## Fluxo Principal
Passos para a execução do caso de uso:
1. O ator acessa a funcionalidade.
2. O sistema apresenta as opções disponíveis.
3. O ator realiza a ação.
4. O sistema valida os dados.
5. O sistema executa a operação.
6. O sistema apresenta o resultado.

## Fluxos Alternativos

### FA-X: Validação falhou
1. O sistema informa os erros.
2. O ator corrige os dados.

### FA-X: Permissão insuficiente
1. O sistema bloqueia a operação.
2. Exibe mensagem de acesso negado.

## Pós-condições
- [ ] Os dados foram persistidos.
- [ ] O usuário visualiza o resultado atualizado.

## Regras de Negócio
- **RN01:** ...
- **RN02:** ...

## DoR (Definition of Ready)

**Dimensão de Clareza**
- [ ] Ator e objetivo de negócio estão descritos e são compreendidos de forma inequívoca por toda a equipe.
- [ ] Os termos utilizados na descrição do item estão em conformidade com o glossário do projeto.
- [ ] Prioridade classificada segundo o método MoSCoW e registrada no template do requisito.

**Dimensão de Viabilidade**
- [ ] Todas as regras de negócio relacionadas ao item estão catalogadas e vinculadas ao requisito correspondente.
- [ ] Dependências técnicas (APIs, integrações, banco de dados) e impedimentos de infraestrutura (acessos, ambientes) foram identificados e não bloqueiam o início do desenvolvimento.

**Dimensão de Estimabilidade**
- [ ] Fluxo principal, alternativos e de exceção do caso de uso estão descritos com profundidade suficiente para estimar esforço e complexidade.

**Dimensão de Escopo (INVEST)**
- [ ] **Independente** — o item pode ser desenvolvido, testado e entregue sem depender de outro item ainda não concluído.
- [ ] **Negociável** — a descrição não é um contrato fechado; detalhes de solução podem ser discutidos entre equipe e cliente até a entrega.
- [ ] **Valiosa** — entrega valor claro e perceptível para o cliente ou para o negócio.
- [ ] **Estimável** — a equipe possui informação suficiente para estimar o esforço com razoável confiança.
- [ ] **Pequena (Small)** — o item é pequeno o bastante para ser planejado e concluído dentro de uma única iteração.
- [ ] **Testável** — possui critérios de aceitação claros, que permitem verificar objetivamente se foi implementado corretamente.