CREATE TABLE estados (
    id SERIAL PRIMARY KEY,
    uf VARCHAR(2) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL
);

INSERT INTO estados (uf, nome) VALUES ('AC', 'Acre');
INSERT INTO estados (uf, nome) VALUES ('AL', 'Alagoas');
INSERT INTO estados (uf, nome) VALUES ('AP', 'Amapá');
INSERT INTO estados (uf, nome) VALUES ('AM', 'Amazonas');
INSERT INTO estados (uf, nome) VALUES ('BA', 'Bahia');
INSERT INTO estados (uf, nome) VALUES ('CE', 'Ceará');
INSERT INTO estados (uf, nome) VALUES ('DF', 'Distrito Federal');
INSERT INTO estados (uf, nome) VALUES ('ES', 'Espírito Santo');
INSERT INTO estados (uf, nome) VALUES ('GO', 'Goiás');
INSERT INTO estados (uf, nome) VALUES ('MA', 'Maranhão');
INSERT INTO estados (uf, nome) VALUES ('MT', 'Mato Grosso');
INSERT INTO estados (uf, nome) VALUES ('MS', 'Mato Grosso do Sul');
INSERT INTO estados (uf, nome) VALUES ('MG', 'Minas Gerais');
INSERT INTO estados (uf, nome) VALUES ('PA', 'Pará');
INSERT INTO estados (uf, nome) VALUES ('PB', 'Paraíba');
INSERT INTO estados (uf, nome) VALUES ('PR', 'Paraná');
INSERT INTO estados (uf, nome) VALUES ('PE', 'Pernambuco');
INSERT INTO estados (uf, nome) VALUES ('PI', 'Piauí');
INSERT INTO estados (uf, nome) VALUES ('RJ', 'Rio de Janeiro');
INSERT INTO estados (uf, nome) VALUES ('RN', 'Rio Grande do Norte');
INSERT INTO estados (uf, nome) VALUES ('RS', 'Rio Grande do Sul');
INSERT INTO estados (uf, nome) VALUES ('RO', 'Rondônia');
INSERT INTO estados (uf, nome) VALUES ('RR', 'Roraima');
INSERT INTO estados (uf, nome) VALUES ('SC', 'Santa Catarina');
INSERT INTO estados (uf, nome) VALUES ('SP', 'São Paulo');
INSERT INTO estados (uf, nome) VALUES ('SE', 'Sergipe');
INSERT INTO estados (uf, nome) VALUES ('TO', 'Tocantins');
