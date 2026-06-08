# BCB – Big Chat Brasil · Back-end

API REST do sistema BCB, desenvolvida com NestJS + TypeScript + PostgreSQL via Prisma 7.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | NestJS (Node.js) |
| Linguagem | TypeScript |
| ORM | Prisma 7 |
| Banco de dados | PostgreSQL 16 |
| Documentação | Swagger / OpenAPI |
| Validação | class-validator / class-transformer |

## Arquitetura

O projeto segue o padrão **Use Case por operação**, com separação clara entre:

```
src/
├── auth/               # Autenticação via token de sessão
├── clients/            # Cadastro de clientes (PF/PJ)
├── conversations/      # Conversas e histórico de mensagens
├── messages/           # Envio de mensagens + fila de prioridade
│   └── queue/          # MessageQueueService + MessageWorkerService
└── prisma/             # PrismaService (global)
```

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose

## Executando o projeto

### 1. Suba o banco de dados

```bash
cd Docker
docker-compose up -d
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do `back-end/`:

```env
DATABASE_URL="postgresql://root:123mudar@localhost:5432/bcb"
PORT=3000
```

### 3. Instale dependências e rode as migrations

```bash
npm install
npx prisma migrate deploy
```

### 4. Inicie o servidor

```bash
# desenvolvimento
npm run start:dev

# produção
npm run start:prod
```

A API estará disponível em `http://localhost:3000`.  
Documentação Swagger: `http://localhost:3000/api`.

## Fluxo principal

```
POST /auth                         → login com CPF/CNPJ → retorna token
GET  /conversations                → lista conversas do cliente autenticado
POST /conversations                → cria nova conversa com um destinatário
GET  /conversations/:id/messages   → histórico de mensagens de uma conversa
POST /messages                     → envia mensagem (enfileira + debita saldo)
```

Todos os endpoints (exceto `POST /auth` e `POST /clients`) exigem o header:

```
Authorization: Bearer <token>
```

## Planos de pagamento

| Plano | Comportamento |
|---|---|
| **Pré-pago** | Verifica saldo → debita custo → enfileira mensagem |
| **Pós-pago** | Verifica consumo mensal vs. limite → acumula consumo → enfileira mensagem |

Custos: mensagem normal **R$ 0,25** · mensagem urgente **R$ 0,50**.

## Fila de mensagens

Implementada em memória (`MessageQueueService`) com **array ordenado por prioridade e timestamp**:

- Mensagens urgentes são sempre processadas antes das normais
- Dentro da mesma prioridade, a ordem é FIFO (timestamp)
- O `MessageWorkerService` processa a fila em background com simulated delivery (~1 s)
- O worker respeita graceful shutdown via `OnModuleDestroy`

## Decisões técnicas

- **Sessões sem JWT**: autenticação simplificada via UUID de sessão persistido no banco, conforme orientação do desafio.
- **`balance` para pós-pago**: o campo `balance` armazena o consumo mensal acumulado do cliente pós-pago (começa em 0 e aumenta até o `creditLimit`). Uma coluna dedicada `monthlyUsage` seria mais semântica, mas foi mantido para simplicidade no escopo do desafio.
- **Fila em memória**: não sobrevive a reinicializações. Uma implementação com Redis/Bull seria o passo seguinte natural.
- **`unreadCount` = 0**: contagem de mensagens não lidas requer rastreamento de leitura por cliente, não implementado neste escopo.
