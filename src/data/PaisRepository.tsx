import { sp } from '@pnp/sp';
import Pais from '../domain/models/Pais';
import Constants from '../domain/util/Constants';

export default class PaisRepository {

    public async ObterTodosPaises(): Promise<Pais[]> {
        let paises: Pais[] = [];

        await sp.web.lists
          .getByTitle(Constants.listaPaises)
          .items.top(5000)
          .select("ID, Title, Ativo")
          .filter(`Ativo eq 1`)
          .orderBy("Title", true)
          .get()
          .then(items => {
            paises = items;
          })
          .catch(e => {
            console.log("erro", e);
          });

        return paises;
    }
}
