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
- [ ] O fluxo principal é executado com sucesso.
- [ ] Os fluxos alternativos funcionam conforme esperado.
- [ ] As regras de negócio são respeitadas.
- [ ] Os testes automatizados foram adicionados ou atualizados.