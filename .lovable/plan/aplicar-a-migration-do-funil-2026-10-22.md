# Aplicar a migration do funil

Aplicar no banco o arquivo `supabase/migrations/20261021200000_funnel_events.sql` exatamente como está, byte a byte, sem alterar nenhum código.

O que ele cria:
- Tabela `funnel_events` (eventos anônimos do customizador, sem e-mail), com 3 índices e RLS ligado sem políticas (só o servidor acessa).
- View `funnel_daily` (sessões por dia, evento e etapa).
- View `funnel_sessions` (uma linha por sessão: etapa mais distante, e-mail, cupom, checkout, origem).

## Depois de aplicar
- Enviar um evento de teste ao endereço de registro do funil e conferir se a linha aparece na tabela e nas views; depois apagar a linha de teste.

## Ponto de atenção
O arquivo não tem `GRANT` para o papel do servidor. Se o teste falhar por permissão, eu paro e te aviso antes de qualquer correção (seria uma migration nova, só com o `GRANT`, sem mexer no arquivo original).
