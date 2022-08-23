import Pais from '../domain/models/Pais';
import PaisRepository from '../data/PaisRepository';

export default class PaisService {

  public async ObterTodosPaises() : Promise<Pais[]> {
    let paises: Pais[];
    paises = await new PaisRepository().ObterTodosPaises();
    return paises;
  }

}
