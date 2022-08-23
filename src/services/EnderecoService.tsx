import Endereco from '../domain/models/Endereco';
import EnderecoRepository from '../data/EnderecoRepository';

export default class EnderecoService {

  public async SalvarEndereco(endereco: Endereco) : Promise<number> {
    let idEndereco = await new EnderecoRepository().InserirEndereco(endereco);
    return idEndereco;
  }

  public async ObterEnderecoPorFornecedorId(idFornecedor: number) : Promise<Endereco> {
    let endereco: Endereco = await new EnderecoRepository().ObterEnderecoPorFornecedorId(idFornecedor);
    return endereco;
  }

  public async AtualizarEndereco(endereco: Endereco) : Promise<boolean> {

    let atualizou: boolean = await new EnderecoRepository().AtualizarEndereco(endereco);
    return atualizou;
  }

  public async ExcluirEndereco(idFornecedor: number) : Promise<boolean> {
    let excluir: boolean = await new EnderecoRepository().ExcluirEndereco(idFornecedor);
    return excluir;
  }

}
