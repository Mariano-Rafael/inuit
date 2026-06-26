# Especificação Arquitetural: Inuit Core Engine

## 1. Visão Geral e Princípios

O **Inuit Core Engine** é o cérebro isolado do orquestrador de conversas. Ele foi desenhado sob os princípios de Arquitetura Limpa (*Clean Architecture*) e é composto por **Funções Puras**.

* **Responsabilidade Única:** Receber a topologia do grafo (JSON), o estado atual da sessão e a entrada do usuário, para calcular e retornar o próximo estado e as ações a serem tomadas.
* **Agnóstico de Infraestrutura:** O Core Engine não possui conhecimento sobre HTTP (Fastify), Bancos de Dados (Postgres), Cache (Redis) ou Interfaces Visuais (React Flow). Toda a camada de I/O (Input/Output) deve ser injetada nele.
* **Testabilidade:** Por ser isolado de dependências externas, 100% da sua lógica pode ser validada localmente via testes unitários e *mocks* de memória.

---

## 2. Componentes Estruturais

Para evitar alto acoplamento e facilitar a manutenção, o motor é dividido em três entidades lógicas principais:

### 2.1 Context Manager (Gerenciador de Estado)

Responsável por gerenciar a "memória" de curto e longo prazo da conversa em tempo de execução.

* Armazena variáveis coletadas (ex: `cpf`, `nome`, `intent`).
* Mantém metadados do roteamento (ex: contador de *retries* ou falhas consecutivas em um mesmo nó).

### 2.2 Condition Evaluator (Motor de Regras)

O componente crítico que dita a flexibilidade estrutural do chatbot. Ele avalia as arestas (`FlowEdge`) comparando o estado/entrada com a condição mapeada no grafo.

* **Operadores Suportados:** `always` (padrão/fallback), `equals`, `contains`, `regex` e `intent`.

### 2.3 Graph Traverser (Navegador do Grafo)

O roteador matemático que navega pela matriz de dados.

* Dada uma origem (`nodeId`), busca as conexões de saída válidas.
* **Circuit Breaker:** Implementa um limite máximo de saltos lógicos (ex: 5 transições automáticas) sem exigir entrada do usuário, prevenindo *Loops Infinitos* e travamento da *Thread* do Node.js.

---

## 3. Modelo de Dados e Contratos (Shared Types)

As interfaces abaixo definem os contratos rígidos compartilhados entre o motor, o Back-end (API) e o Front-end (UI).

```typescript
// Define um passo ou ação na conversa
export interface FlowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'input';
  label: string;
}

// Define a regra para transição de um nó a outro
export interface EdgeCondition {
  type: 'always' | 'equals' | 'contains' | 'regex' | 'intent';
  variable?: string;
  value?: string;
}

// Define o caminho lógico (Aresta)
export interface FlowEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  condition: EdgeCondition;
}

// O Grafo completo em um determinado momento
export interface FlowGraph {
  nodes: FlowNode[];
  edges: FlowEdge[];
}
