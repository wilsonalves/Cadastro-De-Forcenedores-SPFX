import EmpresaParceira from '../domain/models/EmpresaParceira';
import EmpresaParceiraRepository from '../data/EmpresaParceiraRepository';

export default class EmpresaParceiraService {

  public async ObterTodosEmpresasParceiras() : Promise<EmpresaParceira[]> {
    let empresas: EmpresaParceira[];
    empresas = await new EmpresaParceiraRepository().ObterTodosEmpresaParceira();
    return empresas;
  }

}
