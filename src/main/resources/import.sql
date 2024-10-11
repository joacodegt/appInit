INSERT INTO maquina(id, nombre,tipo) values (50,'D02000','Alzadoras'); 
ALTER SEQUENCE maquina_seq RESTART WITH 51;

INSERT INTO Frente(id, nombre) values (51,'Frente1'); 
ALTER SEQUENCE Frente_seq RESTART WITH 52;

INSERT INTO Operador(id, nombre,codigoEmpleado) values (53,'joaquin','1234'); 
ALTER SEQUENCE Operador_seq RESTART WITH 54;