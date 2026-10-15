# Foto realista com apoio no chão, gerador atualizado e acesso na etapa 4

## Minha recomendação

Fazer as três mudanças juntas. A etapa 4 é o lugar certo para a foto: o cliente já definiu as medidas e pode visualizar a madeira antes de ir ao resumo e ao pagamento. A geração continua opcional, iniciada por clique, sem bloquear a compra.

## O que foi confirmado

- A imagem enviada mostra a estante suspensa, sem contato com o piso.
- As instruções atuais já exigem apoio no chão. Repetir essa exigência, sozinho, não é uma correção suficiente.
- A captura atual copia a cena 3D exibida. Em Bookshelf/Horizontal, o modelo está elevado em relação à sombra no chão. Isso pode incentivar o resultado flutuante; ainda não comprova a causa única.
- O código usa `google/gemini-2.5-flash-image-preview`. O catálogo atual identifica a família Gemini 2.5 Flash Image como descontinuada para novos usos.
- A consulta autenticada confirmou disponibilidade de GPT Image 2.5 Sunburst e Gemini 3 Pro Image para este projeto. Ainda não foi feita uma comparação de fotos geradas.
- O botão de geração está no resumo da etapa 5, apenas para Bookshelf, Horizontal e Cathedral.

## 1. Corrigir a estante flutuando

- Preparar uma captura específica para a foto, com a base apoiada num piso visível e sombras de contato coerentes.
- Preservar tamanho, posição e comportamento da visualização 3D que o cliente já usa; corrigir a referência exportada, não desfazer os ajustes anteriores de enquadramento.
- Separar claramente nas instruções o que pode mudar — ambiente, iluminação e realismo dos materiais — do que deve permanecer: desenho, divisões, medidas, madeira e acabamentos.
- Não adicionar pés, pedestal ou novas peças para justificar o apoio.
- Conferir fotos reais geradas antes de considerar o problema resolvido. IA não garante fidelidade absoluta; a visualização 3D continua sendo a referência do desenho.

## 2. Atualizar o gerador

- Usar **GPT Image 2.5 Sunburst**, opção atual voltada à qualidade, com a captura 3D como imagem de referência.
- Comparar o resultado com a imagem problemática e verificar apoio no piso, proporções, divisões e materiais. A disponibilidade está confirmada; a melhora visual precisa ser demonstrada pelo teste.
- Preservar os acabamentos em duas cores, incluindo White Oak / White: carvalho na estrutura e branco nas baguetes.
- A opção de maior qualidade pode custar mais e demorar mais por foto. Não gerar automaticamente a cada troca de madeira e não prometer o prazo atual de 10–20 segundos sem medir.

## 3. Mover a geração para a etapa 4

- Colocar a área inteira clicável de geração abaixo das opções de madeira.
- Retirar a geração da etapa 5, deixando o resumo e o checkout mais diretos.
- Manter a foto ampliada, download, nova geração e mensagens de carregamento/erro.
- Invalidar a foto ao mudar madeira, medidas, prateleiras ou tipo. Uma resposta atrasada não pode aparecer como se fosse da nova configuração.
- Manter os mesmos três tipos atendidos; não incluir Corner ou U-Surround neste trabalho.
- Não alterar coleta de e-mail, preços, cupons ou envio ao checkout.

## Detalhes técnicos

- Adaptar a chamada de imagem ao contrato de edição do modelo escolhido: `POST /v1/images/edits`, com a referência enviada como arquivo e a credencial mantida apenas no servidor.
- Preservar o fluxo atual sem introduzir streaming ou controles extras desnecessários à troca de modelo.
- Identificar cada geração pela configuração que a originou, descartando resultados obsoletos.
- Cobrir captura apoiada no chão, exibição apenas na etapa 4 e invalidação da foto com testes automatizados adequados.

## Verificação antes de concluir

- Gerar e inspecionar fotos de Bookshelf, Horizontal e Cathedral, incluindo um acabamento em duas cores.
- Confirmar base no piso, ausência de peças inventadas e correspondência com a configuração.
- Percorrer etapas 3 → 4 → 5, gerar a foto, trocar a madeira e confirmar que a foto anterior não é reutilizada.
- Conferir disposição em telas estreitas e largas e ausência de erros.
- Verificar que o checkout continua acessível sem gerar foto; qualquer teste de pedido deve parar antes do pagamento e ter seus registros de teste removidos.
- Publicação não está incluída; primeiro validar a mudança na prévia.