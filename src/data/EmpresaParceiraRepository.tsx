import { sp } from '@pnp/sp';
import EmpresaParceira from '../domain/models/EmpresaParceira';
import Constants from '../domain/util/Constants';

export default class EmpresaParceiraRepository {

    public async ObterTodosEmpresaParceira(): Promise<EmpresaParceira[]> {
        let empresasParceiras: EmpresaParceira[] = [];

        await sp.web.lists
          .getByTitle(Constants.listaEmpresaParceira)
          .items.top(5000)
          .select("ID, Title")

          .orderBy("Title", true)
          .get()
          .then(items => {
            empresasParceiras = items;
          })
          .catch(e => {
            console.log("erro", e);
          });

        return empresasParceiras;
    }
}
