INSERT INTO public.solicitacoes_concierge (
    id, supermercado_id, atendente_id, titulo, status, sla_definido_horas, prioridade_score, complexidade, plano_cliente, data_criacao, data_inicio_processamento, lock_at, url_arquivo_original, observacoes
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222',
    NULL,
    'Listagem de Ofertas de Fim de Ano (Excel)',
    'PENDENTE',
    2,
    87.5000,
    3,
    'Premium',
    now() - INTERVAL '1 hour',
    NULL,
    NULL,
    'http://localhost:8080/smartmarket-concierge/fake-excel-fim-de-ano.xlsx',
    'Favor cadastrar todas as ofertas de carnes e bebidas para o encarte especial do feriado.'
), (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111114',
    'Novas Ofertas de Hortifruti (Excel)',
    'EM_PROCESSAMENTO',
    3,
    55.2000,
    1,
    'Pro',
    now() - INTERVAL '30 minutes',
    now(),
    now(),
    'http://localhost:8080/smartmarket-concierge/fake-excel-hortifruti.xlsx',
    'Apenas ajustar os preços das frutas da estação.'
), (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '22222222-2222-2222-2222-222222222222',
    NULL,
    'Reposição de Estoque Mercearia',
    'PENDENTE',
    6,
    22.0000,
    2,
    'Básico',
    now() - INTERVAL '15 minutes',
    NULL,
    NULL,
    'http://localhost:8080/smartmarket-concierge/fake-excel-mercearia.xlsx',
    'Carregar preços para os novos fornecedores de mercearia.'
) ON CONFLICT (id) DO NOTHING;
