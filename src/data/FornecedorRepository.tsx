import { sp, ItemAddResult } from '@pnp/sp';
import Fornecedor from '../domain/models/Fornecedor';
import Constants from '../domain/util/Constants';

export default class FornecedorRepository {

    public async ObterFornecedorPorId(idFornecedor: number): Promise<Fornecedor> {
        let fornecedor: Fornecedor;

        await sp.web.lists
          .getByTitle(Constants.listaFornecedores)
          .items
          .getById(idFornecedor)
          .select("ID, Title, Pais/Title, Pais/ID, EmpresaParceira/Title, EmpresaParceira/ID, CNPJ, Telefone, Email, Ativo")
          .expand("Pais","EmpresaParceira")
          .get()
          .then(item => {
            fornecedor = item;
          })
          .catch(e => {
            console.log("erro", e);
          });

        return fornecedor;
    }

    public async ObterFornecedorPorCNPJ(cnpj: string): Promise<Fornecedor> {
      let fornecedor: Fornecedor;

      await sp.web.lists
        .getByTitle(Constants.listaFornecedores)
        .items
        .select("ID, Title")
        .filter(`CNPJ eq '${cnpj}'`)
        .get()
        .then(item => {
          fornecedor = item[0];
        })
        .catch(e => {
          console.log("erro", e);
        });

      return fornecedor;
  }

    public async ObterTodosFornecedores(): Promise<Fornecedor[]> {
        let fornecedores: Fornecedor[] = [];

        await sp.web.lists
          .getByTitle(Constants.listaFornecedores)
          .items.top(5000)
          .select("ID, Title")
          .filter(`Ativo eq 1`)
          .get()
          .then(items => {
            fornecedores = items;
          })
          .catch(e => {
            console.log("erro", e);
          });

        return fornecedores;
    }

    public async InserirFornecedor(fornecedor: Fornecedor) {

      var inseriu: number = 0;

      await sp.web.lists.getByTitle(Constants.listaFornecedores).items.add({
          Title: fornecedor.Title,
          PaisId: fornecedor.PaisID,
          EmpresaParceiraId : fornecedor.EmpresaParceiraID,
          CNPJ: fornecedor.CNPJ,
          Telefone: fornecedor.Telefone,
          Email: fornecedor.Email,
          Ativo: fornecedor.Ativo

      }).then((iar: ItemAddResult) => {
          inseriu = iar.data.ID;
      })
      .catch(e => {
          console.log("erro", e);
      });

      return inseriu;
  }

  public async AtualizarFornecedor(fornecedor: Fornecedor) {

      var atualizou: boolean = false;
      await sp.web.lists
          .getByTitle(Constants.listaFornecedores)
          .items
          .getById(fornecedor.ID)
          .update({
            Title: fornecedor.Title,
            PaisId: fornecedor.PaisID,
            EmpresaParceiraId: fornecedor.EmpresaParceiraID,
            CNPJ: fornecedor.CNPJ,
            Telefone: fornecedor.Telefone,
            Email: fornecedor.Email,
            Ativo: fornecedor.Ativo
          }).then(() => {
              atualizou = true;
          },
          (err) => {
              console.log(err);
          });

      return atualizou;

  }

  public async ExcluirFornecedor(idFornecedor: number) {
      var apagou: boolean = false;

      await sp.web.lists
          .getByTitle(Constants.listaFornecedores)
          .items.getById(idFornecedor)
          .delete()
          .then(() => {
              apagou = true;
          });

      return apagou;
  }

}
