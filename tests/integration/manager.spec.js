//Subir o servidor no supertest
//Criar variavel de ambiente para rodar o teste no bd

const request = require("supertest");
const app = require("../../src/app");
const { cpf } = require("cpf-cnpj-validator");
const connection = require("../../src/database");
const truncate = require("./truncate")

describe("MANAGERS", () => {
  afterAll(() => {
    connection.close();
  });

  beforeEach(async (done) => {
    await truncate(connection.models);
    done();
  });

  it("È possivel criar um novo gerente", async () => {
    const response = await request(app).post("/managers").send({
      name: "Ricardo Lima",
      cpf: cpf.generate(),
      email: "teste@gmail.com",
      cellphone: "5511948731771",
      password: "123456",
    });

    expect(response.ok).toBeTruthy();
    expect(response.body).toHaveProperty("id");
  });

  it("Não é possível cadastrar um gerente com cpf existente", async () => {
    let cpfGerente = cpf.generate();
    let response = await request(app).post("/managers").send({
      name: "Ricardo Lima",
      cpf: cpfGerente,
      email: "teste@gmail.com",
      cellphone: "5511948731771",
      password: "123456",
    });

    response = await request(app).post("/managers").send({
      name: "Leandro",
      cpf: cpfGerente,
      email: "teste@gmail.com",
      cellphone: "5511948731771",
      password: "123456",
    });

    expect(response.ok).toBeFalsy();
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("cpf already exists")
  });
});
