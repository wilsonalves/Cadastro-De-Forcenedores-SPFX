import Fornecedor from '../domain/models/Fornecedor';
import FornecedorRepository from '../data/FornecedorRepository';

export default class FornecedorService {


  public async SalvarFornecedor(fornecedor: Fornecedor) : Promise<number> {

    let fornecedorExiste: Fornecedor = await new FornecedorRepository().ObterFornecedorPorCNPJ(fornecedor.CNPJ);
    if(fornecedorExiste)
      throw "Fornecedor já cadastrado!";

    let idFornecedor = await new FornecedorRepository().InserirFornecedor(fornecedor);
    return idFornecedor;
  }

  public async AtualizarFornecedor(fornecedor: Fornecedor) : Promise<boolean> {

    let atualizou: boolean = await new FornecedorRepository().AtualizarFornecedor(fornecedor);
    return atualizou;
  }

  public async ExcluirFornecedor(idFornecedor: number) : Promise<boolean> {

    let excluir: boolean = await new FornecedorRepository().ExcluirFornecedor(idFornecedor);
    return excluir;
  }

  public async ObterFornecedorPorId(idFornecedor: number) : Promise<Fornecedor> {

    let fornecedor: Fornecedor = await new FornecedorRepository().ObterFornecedorPorId(idFornecedor);
    if(!fornecedor)
      throw "Fornecedor não localizado!";

    return fornecedor;
  }
}
