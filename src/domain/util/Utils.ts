export default class Utils {

  public _urlSite: string;
  public _urlRelativa: string;

  constructor(urlSite: string, urlRelativa: string) {
    this._urlSite = urlSite;
    this._urlRelativa = urlRelativa;
  }

  public RedirecionarPagina(pagina: string) {
    window.location.href = this._urlSite + pagina;
  }

  public AbrirJanela(link: string) {
    window.open(link);
  }

  public FormatarDataPadraoAmericano(dataVencimento: string) {
    let dataFinal = dataVencimento.toString().split("/").reverse().join("-");
    return dataFinal + " 00:00:00";
  }

  public FormatarDataPadraoAmericanoSemTempo(dataVencimento: string) {
    let dataFinal = dataVencimento.toString().split("/").reverse().join("-");
    return dataFinal;
  }

  public FormatarDataBrasil(data: string) {
    return new Date(data).toLocaleDateString();
  }

  public FormataDataExcel(data: number) {
    return this.FormatarDataPadraoAmericano(new Date((data - (25567 + 1)) * 86400 * 1000).toLocaleDateString());
  }

  public FormatarMoeda(numero: number) {
    if (numero === null)
      numero = 0;
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  public PriceToNumber(valor: string) {
    if (!valor) { return 0; }
    valor = valor.split('.').join('');
    valor = valor.split(',').join('.');
    return Number(valor.replace(/[^0-9.]/g, ""));
  }

  public RetornaMesPorExtenso(mes: number) {

    var mesExtenso = Array("Janeiro", "Fevereiro", "Março",
      "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro",
      "Outubro", "Novembro", "Dezembro");

    return mesExtenso[mes];
  }

  public ObterUltimoDiaDoMes(ano: number, mes: number): number {
    return new Date(ano, mes, 0).getDate();
  }

  public CriarChaveStorage(nomeChave: string, valoresChave: string) {
    localStorage.setItem(nomeChave, valoresChave);
  }

  public ObterChaveStorage(nomeChave: string): string {
    return localStorage.getItem(nomeChave);
  }

  public CriarChaveSession(nomeChave: string, valoresChave: string) {
    sessionStorage.setItem(nomeChave, valoresChave);
  }

  public ObterChaveSession(nomeChave: string): string {
    return sessionStorage.getItem(nomeChave);
  }

}
