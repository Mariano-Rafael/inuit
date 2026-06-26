import Fastify from 'fastify';
import cors from '@fastify/cors';
import { FlowNode } from '@inuit/types';

// Inicializa o motor do Fastify com logger ativado para debug
const fastify = Fastify({ logger: true });

// Registra o CORS para permitir requisições do front-end Vite depois
fastify.register(cors, { origin: '*' });

// Rota de teste consumindo o pacote interno do monorepo
fastify.get('/test', async (request, reply) => {

    // Se o TypeScript não reclamar aqui, o contrato está perfeito
    const dummyNode: FlowNode = {
        id: 'node_001',
        type: 'trigger',
        label: 'Início da Conversa'
    };

    return reply.send({
        message: 'Monorepo comunicando com sucesso!',
        node: dummyNode
    });
});

// Função de inicialização do servidor
const start = async () => {
    try {
        // Escutando na porta 3333
        await fastify.listen({ port: 3333, host: '0.0.0.0' });
        console.log('🚀 API do Inuit rodando em http://localhost:3333');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();