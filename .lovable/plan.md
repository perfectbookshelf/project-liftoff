# Aumentar a conversão do customizador

Nas últimas 2 semanas, 606 visitas resultaram em 48 e-mails (8%), 13 cliques em Checkout e 3 a 4 pedidos. A maior perda acontece antes de a pessoa ver o preço. Por isso a prioridade é mostrar valor e preço mais cedo, e só depois mexer no fim do fluxo.

## 1. Medir cada etapa (primeiro)
- Registrar quando alguém entra em cada etapa (1 a 5), abre a janela de e-mail, deixa o e-mail, aplica um cupom e clica em Checkout.
- Assim, daqui a 2 semanas, a gente sabe se as mudanças abaixo funcionaram.

## 2. Mostrar o caminho (sim)
- Barra de progresso no topo com os 5 nomes: Formato · Medidas · Prateleiras · Madeira · Orçamento. A etapa atual fica destacada e as concluídas ficam marcadas.
- Nas etapas iniciais, mostrar algo como "Faltam 2 passos para ver seu preço".

## 3. Dar uma ideia de preço antes do e-mail
- Mostrar uma faixa de preço desde a etapa 1, por exemplo "Estimativa: $2.400 – $2.900", que se atualiza conforme a pessoa escolhe.
- O preço exato e o cupom continuam aparecendo só depois do e-mail, então a captura de contatos continua.
- Nunca mostrar pés quadrados nem preço por pé quadrado.

## 4. Reviews e confiança (sim, em 3 lugares)
- **Etapa 1:** uma linha curta com estrelas, nota e quantidade de avaliações, mais uma frase de cliente.
- **Janela do e-mail:** um depoimento curto e "Sem spam, cancele quando quiser".
- **Etapa 5, perto do Checkout:** 2 ou 3 reviews com foto real, e selos de frete, prazo de produção, garantia e pagamento seguro.
- Usar somente reviews reais que você enviar ou autorizar, sem inventar nada.

## 5. Outras ideias
- **Começar por um modelo pronto:** 3 ou 4 estantes populares que a pessoa pode ajustar, em vez de começar do zero.
- **E-mail automático para quem não comprou:** quem deixou o e-mail e não pagou recebe o orçamento salvo, com um link para retomar. Hoje são cerca de 39 pessoas em 2 semanas.
- **Ajuda humana:** um botão "Falar com um especialista" (WhatsApp ou agendamento) para cantos e espaços difíceis.
- **Prazo e frete claros** na etapa 5, antes do clique em Checkout.

## Ordem sugerida
1. Medição (item 1)
2. Barra de progresso (item 2)
3. Reviews (item 4), depois de você enviar o material
4. Faixa de preço (item 3)
5. Depois, o e-mail para quem não comprou e o modelo pronto

## O que preciso de você
- Reviews reais: texto, nome, cidade, fotos autorizadas e a nota média.
- Prazo de produção, política de frete e garantia que podem ser divulgados.
- Se aprova mostrar uma faixa de preço antes do e-mail.

## Detalhes técnicos
- Eventos de etapa em uma nova tabela `funnel_events` (sessão anônima, etapa, tipo, timestamp), gravados por uma rota pública com validação e limite de envio, sem dados pessoais além do e-mail já capturado.
- Barra de progresso no `WizardShell.tsx`. A faixa de preço é calculada com `src/lib/pricing.ts`, usando a madeira mais barata e a mais cara (±).
- O e-mail para quem não comprou depende de configurar um domínio de envio. Fica para uma segunda fase.
