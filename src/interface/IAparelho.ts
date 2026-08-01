export interface IAparelho{
    id?: number;
    nome: string;
    tipo: 'console' | 'desktop' | 'playstation';
    status: 'ok' | 'precisa manutencao' | 'estragado';
    precisa_manutencao?: Boolean;
    observacao?: string;
    ultima_manutencao?: string;
    uso_hoje?: number;
    created_at?: string;
}
