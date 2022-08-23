import { sp, ItemAddResult } from '@pnp/sp';
import Endereco from '../domain/models/Endereco';
import Constants from '../domain/util/Constants';

export default class EnderecoRepository {

  public async ObterEnderecoPorFornecedorId(idFornecedor: number): Promise<Endereco> {
    let endereco: Endereco;

    await sp.web.lists
      .getByTitle(Constants.listaEnderecos)
      .items
      .select("ID, Title, Cidade, Estado")
      .filter(`IDFornecedor eq ${idFornecedor}`)
      .get()
      .then(item => {
        endereco = item[0];
      });

    return endereco;
  }
  public async InserirEndereco(endereco: Endereco) {

    var inseriu: number = 0;

    await sp.web.lists.getByTitle(Constants.listaEnderecos).items.add({
      Title: endereco.Title,
      Cidade: endereco.Cidade,
      Estado: endereco.Estado,
      IDFornecedor: endereco.IDFornecedor

    }).then((iar: ItemAddResult) => {
      inseriu = iar.data.ID;
    })
      .catch(e => {
        console.log("erro", e);
      });

    return inseriu;
  }

  public async AtualizarEndereco(endereco: Endereco) {

    var atualizou: boolean = false;
    await sp.web.lists
      .getByTitle(Constants.listaEnderecos)
      .items
      .getById(endereco.ID)
      .update({
        Title: endereco.Title,
        Cidade: endereco.Cidade,
        Estado: endereco.Estado
      }).then(() => {
        atualizou = true;
      },
        (err) => {
          console.log(err);
        });

    return atualizou;

  }

  public async ExcluirEndereco(idEndereco: number) {
    var apagou: boolean = false;

    await sp.web.lists
        .getByTitle(Constants.listaEnderecos)
        .items.getById(idEndereco)
        .delete()
        .then(() => {
            apagou = true;
        });

    return apagou;
}

}
