export default interface Fornecedor {
  ID?: number;
  Title: string;
  PaisID: number;
  EmpresaParceiraID : number;
  CNPJ: string;
  Telefone: string;
  Email: string;
  Ativo: boolean;
  Pais?: {
    ID: number,
    Title: string
  };
  EmpresaParceira? : {
    ID: number,
    Title: string
  };

}
