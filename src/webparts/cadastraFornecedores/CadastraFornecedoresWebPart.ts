import { Version, UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import * as strings from 'CadastraFornecedoresWebPartStrings';

import { sp } from "@pnp/sp";
import * as $ from "jquery";
import "bootstrap";

//css customizados
require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
require('../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css');
require('../../stylelibrary/css/padrao.css');
require('../../stylelibrary/css/toastr.min.css');






import toastr from '../../stylelibrary/js/toast/toastr.min.js';
import sweet2 from '../../stylelibrary/js/sweetalert2.js';
//const toastr = require('module-name');

require('../../stylelibrary/js/jquery.inputmask.js');

//classes services e models
import Fornecedor from '../../domain/models/Fornecedor';
import FornecedorService from '../../services/FornecedorService';
import Pais from '../../domain/models/Pais';
import PaisService from '../../services/PaisService';
import Endereco from '../../domain/models/Endereco';
import EnderecoService from '../../services/EnderecoService';
import EmpresaParceiraService from '../../services/EmpresaParceiraService';
import EmpresaParceira from '../../domain/models/EmpresaParceira';

import UtilDomain from '../../domain/util/Utils';

export interface ICadastraFornecedoresWebPartProps {
  description: string;
}

export default class CadastraFornecedoresWebPart extends BaseClientSideWebPart<ICadastraFornecedoresWebPartProps> {

  private _utilDomain: UtilDomain;
  private _idFornecedor: string;

  //metodo que é disparado ao iniciar a webpart
  public onInit(): Promise<void> {

    this._utilDomain = new UtilDomain(this.context.pageContext.web.absoluteUrl,
      this.context.pageContext.web.serverRelativeUrl);

    //configura o contexto do PNP
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {

    //carrego o template do layout
    this.domElement.innerHTML = require("./template.html");

    document
      .getElementById("btnSalvar")
      .addEventListener("click", () => this.SalvarFornecedor());

    document
      .getElementById("btnExcluir")
      .addEventListener("click", () => this.ExcluirFornecedor());

    //defino o bind das tabs
    $('a[data-toggle="tab"]').on(
      "shown.bs.tab", (e: Event) =>
        this.loadTab(e.target["attributes"]["data-target"].value)
    );

    //adicionado as mascaras
    (<any>$("#txtCNPJ")).inputmask(("99.999.999/9999-99"));
    (<any>$("#txtTelefone")).inputmask(("(99) 99999-9999"));

    //leio a querystring para verificar se é edicao
    var queryParms = new UrlQueryParameterCollection(window.location.href);
    this._idFornecedor = queryParms.getValue("idFornecedor");

    //simulo pageLoad para determinar se é cadastro ou edição
    this.PageLoad(this._idFornecedor);

  }

  private async PageLoad(idFornecedor: string): Promise<void> {

    //obter todos os paises aqui
    await this.ObterTodosPaises();
    await this.ObterTodasEmpresasParceiras();

    if (this._idFornecedor !== undefined) {
      $("#btnExcluir").show();
      await this.CarregarFornecedor(Number(idFornecedor));
      await this.CarregarEndereco(Number(idFornecedor));
    }
    else {
      $("#btnExcluir").hide();
    }

  }

  public async CarregarFornecedor(idFornecedor: number) {

    let fornecedor: Fornecedor = await new FornecedorService().ObterFornecedorPorId(idFornecedor);

    $(`#ddlPaises option[value=${fornecedor.Pais.ID}]`).attr('selected', 'selected');
    $(`#ddlEmpresa option[value=${fornecedor.EmpresaParceira.ID}]`).attr('selected', 'selected');
    $("#txtRazaoSocial").val(fornecedor.Title);
    $("#txtCNPJ").val(fornecedor.CNPJ);
    $("#txtTelefone").val(fornecedor.Telefone);
    $("#txtEmail").val(fornecedor.Email);

  }

  protected async ObterTodosPaises() {
    let montahtmlPaises = "";
    let paises: Pais[];
    paises = await new PaisService().ObterTodosPaises();

    montahtmlPaises = `<option value="">Selecione</option>`;
    paises.forEach(element => {
      montahtmlPaises += `<option value="${element.ID}">${element.Title}</option>`;
    });

    $("#ddlPaises").html(montahtmlPaises);
  }

  protected async ObterTodasEmpresasParceiras() {
    let montahtmlEmpresa = "";
    let empresas: EmpresaParceira[];
    empresas = await new EmpresaParceiraService().ObterTodosEmpresasParceiras();

    montahtmlEmpresa = `<option value="">Selecione</option>`;
    empresas.forEach(element => {
      montahtmlEmpresa += `<option value="${element.ID}">${element.Title}</option>`;
    });

    $("#ddlEmpresa").html(montahtmlEmpresa);
  }

  protected async loadTab(target: string) {
    switch (target) {
      case "#Detalhes":
        break;
      case "#Endereco":
        this.CarregarEndereco(Number(this._idFornecedor));
        break;
      default:
        break;
    }
  }

  protected async CarregarEndereco(idFornecedor: number) {
    let endereco: Endereco = await new EnderecoService().ObterEnderecoPorFornecedorId(idFornecedor);
    $("#txtEndereco").val(endereco.Title);
    $("#txtCidade").val(endereco.Cidade);
    $(`#ddlEstado option[value=${endereco.Estado}]`).attr('selected', 'selected');
  }

  protected async SalvarFornecedor() {


    toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-top-center",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    let razaoSocial = $("#txtRazaoSocial").val().toString();
    let paisID = Number($("#ddlPaises option:selected").val());
    let empresaParceiraID = Number($("#ddlEmpresa option:selected").val());
    let cnpj = $("#txtCNPJ").val().toString();
    let telefone = $("#txtTelefone").val().toString();
    let email = $("#txtEmail").val().toString();

    let fornecedor: Fornecedor = {
      ID: Number(this._idFornecedor),
      Title: razaoSocial,
      PaisID: paisID,
      EmpresaParceiraID : empresaParceiraID,
      CNPJ: cnpj,
      Telefone: telefone,
      Email: email,
      Ativo: true
    };

    let enderecoFornecedor = $("#txtEndereco").val().toString();
    let estado = $("#ddlEstado option:selected").val().toString();
    let cidade = $("#txtCidade").val().toString();

    let endereco: Endereco = {
      Title: enderecoFornecedor,
      Cidade: cidade,
      Estado: estado
    };

    try {

      if (this._idFornecedor === undefined) {
        let idFornecedor = await new FornecedorService().SalvarFornecedor(fornecedor);

        endereco.IDFornecedor = idFornecedor;
        let idEndereco = await new EnderecoService().SalvarEndereco(endereco);

        if (idEndereco > 0) {
          toastr["success"]("Ação realizada com sucesso!", "Sucesso");
          setInterval(() => this._utilDomain.RedirecionarPagina("/SitePages/Cadastro-de-Fornecedores.aspx?idFornecedor=" + idFornecedor), 4000);
        }
      }
      else {
        let atualizou: boolean = await new FornecedorService().AtualizarFornecedor(fornecedor);
        if (atualizou) {

          let enderecoUpdate: Endereco = await new EnderecoService().ObterEnderecoPorFornecedorId(Number(this._idFornecedor));
          endereco.ID = enderecoUpdate.ID;
          atualizou = await new EnderecoService().AtualizarEndereco(endereco);

          if (atualizou)
            toastr["success"]("Ação realizada com sucesso!", "Sucesso");
        }
      }

    }
    catch (err) {
      console.log(err);
      if (err === "Fornecedor já cadastrado!")
        toastr["error"]("Fornecedor já cadastrado!", "Erro");
      else
        toastr["error"]("Ocorreu um erro ao realizar o cadastro.", "Erro");
    }
  }

  protected async ExcluirFornecedor() {
    sweet2.fire({
      title: 'Você deseja excluir esse item?',
      text: "Você não será capaz de reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, exclua'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let enderecoDelete: Endereco = await new EnderecoService().ObterEnderecoPorFornecedorId(Number(this._idFornecedor));

          let excluiu = await new EnderecoService().ExcluirEndereco(enderecoDelete.ID);
          if (excluiu) {
            excluiu = await new FornecedorService().ExcluirFornecedor(Number(this._idFornecedor));
            if (excluiu) {
            sweet2.fire("Excluido", "Item excluido com sucesso", "sucesso");
              setInterval(() => this._utilDomain.RedirecionarPagina("/SitePages/Cadastro-de-Fornecedores.aspx"), 4000);
            }
          }

        }
        catch (err) {
          console.log(err);
          toastr["error"]("Ocorreu um erro ao excluir o cadastro.", "Erro");
        }
      }
    });


  }



  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
