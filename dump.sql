CREATE TABLE caixa (
  id SERIAL PRIMARY KEY,                 
  data_abertura TIMESTAMP NOT NULL,    
  data_fechamento TIMESTAMP,         
  valor_inicial NUMERIC(10, 2) NOT NULL,
  valor_final NUMERIC(10, 2),            
  status text DEFAULT FALSE,      
  justificativa TEXT
);

create table transacoes (
  id serial primary key,
  caixa_id integer references caixa(id),
  valor numeric(10, 2) not null,
  tipo varchar(10) not null,
  data_hora timestamp not null
);

create database gestorde_caixa