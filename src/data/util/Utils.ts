import { sp, FileAddResult } from '@pnp/sp';
import * as $ from 'jquery';

import UsuarioSP from '../../domain/models/UsuarioSP';

export default class Utils {

    public _urlSite: string;
    public _urlRelativa: string;

    constructor(urlSite: string, urlRelativa: string) {
        this._urlSite = urlSite;
        this._urlRelativa = urlRelativa;
    }

    public async UploadArquivo(idInputFile: string, nomeBiblioteca: string){

        let dataFile: FileAddResult;
        let input = <HTMLInputElement>document.getElementById(idInputFile);
        let file = input.files[0];

        if (file != null) {

            //Upload a file to the SharePoint Library
            await sp.web.getFolderByServerRelativeUrl(nomeBiblioteca).files.add(file.name, file, true)
                .then((data) => {
                    dataFile = data;
                },
                (err) => {
                    console.log(err);
                });
        }

        return dataFile;
    }

    public async CriarFolder(nomeBiblioteca: string, nomeFolder: string) {
        await sp.web.lists.getByTitle(nomeBiblioteca).rootFolder.serverRelativeUrl.get()
            .then(response => {
                sp.web
                    .getFolderByServerRelativeUrl(response)
                    .folders.add(nomeFolder);
            },
            (err) => {
                console.log(err);
            });
    }

    public async ObterDadosUsuarioLogado() : Promise<UsuarioSP> {
        let usuarioSharePoint: UsuarioSP;
        await $.ajax({
            url: `${this._urlSite}/_api/SP.UserProfiles.PeopleManager/GetMyProperties?$select=Email,DisplayName,Title,AccountName`,
            method: 'GET',
            async: false,
            headers: {
                Accept: 'application/json; odata=verbose'
            },
            success: (data) => {
                usuarioSharePoint = data.d;
            },
            error: (errorCode, errorMessage) => {
                console.log('Erro ao recuperar o total de itens. \nError: ' + errorCode + '\nStackTrace: ' + errorMessage);
            }
        });

        return usuarioSharePoint;
    }

    public async ListarArquivosPasta(caminhoArquivo: string) {
        await sp.web.getFolderByServerRelativeUrl(`${this._urlRelativa}/${caminhoArquivo}`).files.get().then(files => {
            for (var i = 0; i < files.length; i++) {
                let file = files[i];
                console.log(file);
            }
        },
        (err) => {
            console.log(err);
        });
    }

}
