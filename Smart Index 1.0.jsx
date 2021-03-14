/*************************************************************************************************
 * Author : Ivan J. Borchardt      - linkedin.com/in/ivan-borchardt/
 *                                 - github.com/Ivan-J-Borchardt
 * 
 * Description :  --  Smart Index  --
 *                This Script creates a personalized image index and includes the following functions:
 *                 - Image optimization for WEB and PDF with resolution selector and JPG compression degree
 *                 - SEO optimization: inclusion of metadata from XML file and function "Rename File"
 *                 - Execute Action: Allows you to execute a Custom Action before or after image optimization
 *                 - Create Index: includes options to plot File number, Rating, Comments, Check Box and generate PDF in A4
 * 
 *                Este Script cria um index de imagens personalizado e contempla as seguintes funções:
 *                 - Otimização de imagem para WEB e PDF com seletor de resolução e grau de compactação JPG
 *                 - Ações de SEO: inclusão de metadados a partir de arquivo XML  e função Renomear Arquivo 
 *                 - Executar Action: Permite executar uma Action Personalizada antes ou depois da otimização da imagem 
 *                 - Criar Index: contempla opções de plotar Número de arquivo, Rating, Comentários, Check Box e gerar PDF em A4 
 *
 * Date        : 03.06.2017  
 * 
 * Change History:
 *               Version 0.1  -  03.06.2017   - Script Creation
 *               Version 1.0  -  19.07.2017   - Version consolidation 
 * 
 * Backlog: 
 *     - Message on the end of the Script announcing that the processing is finished
 *     - Add header and footer data (logo, date, page number, etc.)
 *     - Add support for multiple languages
 ************************************************************************************************/
// Requisitos: 
//                Script - Photoshop - Compativel com versão CS2 ou Superiores.  
//                 Instalação prévia do Action Set: :'Smart Index Action Set'
//                 Instalação prévia da pasta "~/Documents/Smart Index"
//
//

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// in case we double clicked the file
//app.bringToFront();

// get a reference to the current (active) document and store it in a variable named "doc"
//doc = app.activeDocument;  

//Reading the Config File 
var ConfigFile = "~/Documents/Smart Index/ArquivoConfiguracao.txt"; //C:\Users\<user>

//Inicialização padrão das configurações
//Default initialization of the config variables 
var config = {
    edPathSource: "",
    edPathTarget: "",
    edLongestEdge: "",
    sldrQuality: 0,
    edQuality: "",
    radOtimWeb: false,
    radOtimPDF: false,
    chkSeo: false,
    edPathMeta: "",
    edAuthor: "",
    edKeywords: "",
    chkRename: false,
    edNamePrefix: "",
    drpSufix: 0,
    chkAction: false,
    edGroupAction: "",
    edAction: "",
    radPreExec: false,
    radPostExec: false,
    chkFileNum: false,
    chkRating: false,
    chkComment: false,
    chkCheckbox: false,
    chkPDF: false,
    edCountImagesLine: "",
    returnAction: 0
};

//Create the user interface                   
config = createUI();


//Processamento dos arquivos de imagem
//Processing each image file
try {
    if (config.returnAction == 1 && config.edPathSource != null && config.edPathTarget != null) {

        //Prepara as fotos para o uso no index
        //Prepare the images to the use in the index
        optimizeFiles();

        //cria Index em PDF A4
        //creates Index in PDF A4
        if (config.chkPDF == true) {
            createPDF();
        }
    }
} catch (e) {
    alert("Erro: " + e.message)
}

/**
 * Prepara as fotos para o uso no index
 * Prepare the images to the index
 */
function optimizeFiles() {
    var listOfFiles = Folder(config.edPathSource).getFiles();

    for (var i = 0; i < listOfFiles.length; i++) {
        if (listOfFiles[i] instanceof File && listOfFiles[i].hidden == false) {

            var docRef = open(listOfFiles[i]);

            //Executa Action quando a opção Pre Executar esta selecionada
            //Executes Action when Pre Execute option is selected
            if (config.chkAction == true && config.radPreExec == true) {
                app.doAction(config.edAction, config.edGroupAction);
            }

            if (config.chkFileNum == true || config.chkRating == true || config.chkComment == true || config.chkCheckbox == true) {

                //Se a action nao estiver aberta no Photoshop 
                if (!File("Smart Index Action Set.ATN").exists) {
                    //app.load(File("~/Documents/Smart Index/Smart Index Action Set.ATN")); //Carrega arquivo de Actions 
                }
                //Se a action nao estiver aberta no Photoshop 
                if (File("~/Documents/Smart Index/Smart Index Action Set.ATN").exists) {
                    // app.load(File("~/Documents/Smart Index/Smart Index Action Set.ATN")); //Carrega arquivo de Actions 
                }



                //prepara a foto para criar index
                //prepares the photo to create index
                if (docRef.height > docRef.width) {  //Foto na Vertical  - Portrait Photo
                    var ratio = docRef.height / docRef.width;
                    var photoOrientation = 0;
                    if (ratio <= 1.33334) {
                        app.doAction("Prepare to Index V 1.33", "Smart Index Action Set.ATN");
                        photoOrientation = 1;
                    } else {
                        app.doAction("Prepare to Index V 1.5", "Smart Index Action Set.ATN");
                        photoOrientation = 2;
                    }
                } else { //Foto na Horizontal - Landscape Photo
                    var ratio = docRef.width / docRef.height;
                    if (ratio <= 1.33334) {
                        app.doAction("Prepare to Index H 1.33", "Smart Index Action Set.ATN");
                        photoOrientation = 3;
                    } else {
                        app.doAction("Prepare to Index H 1.5", "Smart Index Action Set.ATN");
                        photoOrientation = 4;
                    }
                }

                //saveAs(); 
                //docRef.close(SaveOptions.DONOTSAVECHANGES);
                //var fileRef = new File("~/Documents/Smart Index/temp.jpg"); 
                //docRef = open(fileRef );


                var fileAux;
                var docAux;
                //Adiciona estrelas do Rating 
                //Add Rating Stars
                if (config.chkRating == true) {

                    if (getRating() == 0) {
                        fileAux = new File("~/Documents/Smart Index/Star Rating 0.png");
                        docAux = open(fileAux);
                    }
                    if (getRating() == 1) {
                        fileAux = new File("~/Documents/Smart Index/Star Rating 1.png");
                        docAux = open(fileAux);
                    }
                    if (getRating() == 2) {
                        fileAux = new File("~/Documents/Smart Index/Star Rating 2.png");
                        docAux = open(fileAux);
                    }
                    if (getRating() == 3) {
                        fileAux = new File("~/Documents/Smart Index/Star Rating 3.png");
                        docAux = open(fileAux);
                    }
                    if (getRating() == 4) {
                        fileAux = new File("~/Documents/Smart Index/Star Rating 4.png");
                        docAux = open(fileAux);
                    }
                    if (getRating() == 5) {
                        fileAux = new File("~/Documents/Smart Index/Star Rating 5.png");
                        docAux = open(fileAux);
                    }


                    switch (photoOrientation) {
                        case 1:
                            app.doAction("Add Star Rating V 1.33", "Smart Index Action Set.ATN");
                            MoveLayerTo(app.activeDocument.layers.getByName("Layer 1"), 35, 2730);
                            break;

                        case 2:
                            app.doAction("Add Star Rating V 1.5", "Smart Index Action Set.ATN");
                            MoveLayerTo(app.activeDocument.layers.getByName("Layer 1"), 35, 2720);
                            break;

                        case 3:
                            app.doAction("Add Star Rating H 1.33", "Smart Index Action Set.ATN");
                            MoveLayerTo(app.activeDocument.layers.getByName("Layer 1"), 35, 2020);
                            break;

                        case 4:
                            app.doAction("Add Star Rating H 1.5", "Smart Index Action Set.ATN");
                            MoveLayerTo(app.activeDocument.layers.getByName("Layer 1"), 35, 1780);
                            break;

                        default:
                            alert("Ouve uma falha ao detectar a proporção da foto \n Verifique a proporção da foto " + docRef.name);
                            break;
                    }
                    //Fecha o Arquivo auxiliar 
                    //Closes the auxiliary file
                    docAux.close(SaveOptions.DONOTSAVECHANGES);
                }

                //Adiciona Check Box
                //Add Checkbox
                if (config.chkCheckbox == true) {
                    app.activeDocument.mergeVisibleLayers(); //merge Layers

                    fileAux = new File("~/Documents/Smart Index/Check Box.png");
                    docAux = open(fileAux);

                    app.doAction("Add Check Box", "Smart Index Action Set.ATN");
                    switch (photoOrientation) {
                        case 1:

                            MoveLayerTo(app.activeDocument.layers.getByName("Layer 1"), 35, 2830);
                            break;

                        case 2:

                            MoveLayerTo(app.activeDocument.layers.getByName("Layer 1"), 35, 2830);
                            break;

                        case 3:

                            MoveLayerTo(app.activeDocument.layers.getByName("Layer 1"), 35, 2120);
                            break;

                        case 4:

                            MoveLayerTo(app.activeDocument.layers.getByName("Layer 1"), 35, 1888);
                            break;

                        default:
                            alert("Ouve uma falha ao detectar a proporção da foto \n Verifique a proporção da foto " + docRef.name);
                            break;
                    }
                    //Fecha o Arquivo auxiliar 
                    //Closes the auxiliary file
                    docAux.close(SaveOptions.DONOTSAVECHANGES);
                }

                //Plota os comentarios 
                //Plot the comments
                if (config.chkComment == true) {
                    createText("Arial", 10, 0, 0, 0, getComment(docRef), (app.activeDocument.width / 2), app.activeDocument.height - 170);
                    activeDocument.activeLayer.name = "Text";
                    activeDocument.activeLayer.textItem.justification = Justification.CENTER;
                }

                //Renomeia a foto
                //Rename the Picture
                var newFileName = docRef.name;
                if (config.chkRename == true) {
                    if (config.drpSufix == 0) {
                        newFileName = config.edNamePrefix + i + ".jpg";
                    } else {
                        newFileName = config.edNamePrefix + docRef.name;
                    }
                }

                //Plota nome do arquivo
                //Plot the File Name
                if (config.chkFileNum == true) {
                    createText("Arial-BoldMT", 16, 0, 0, 0, newFileName, (app.activeDocument.width - 35), app.activeDocument.height - 170);
                    activeDocument.activeLayer.name = "Text";
                    activeDocument.activeLayer.textItem.justification = Justification.RIGHT;
                }


            }



            //Adiciona Metadata a partir de arquivo XML   e campos Autor e Palavras Chave da tela      
            //Adds Author, Keywords fields and Metadata from the XML file.           
            if (config.chkSeo == true) {
                addXMPMetaData(config.edPathMeta);
                //   if(config.edAuthor != "" && config.edAuthor != undefined){
                //         docRef.info.author = config.edAuthor; 
                //   }

                //  if(config.edKeywords != "" && config.edKeywords != undefined){
                //       docRef.info.keywords= config.edKeywords; 
                // }                    
                docRef.info.copyrighted = CopyrightedType.COPYRIGHTEDWORK

            }




            //Otimização da imagem 
            //Image optimization
            if (config.radOtimWeb == true) {
                var dpi = 96;
            } else {
                var dpi = 600;  //config.radOtimPDF == "true"
            }


            //redimensionamento da imagem 
            //image resizing
            var longestEdge = UnitValue(config.edLongestEdge, "px");

            if (docRef.height > docRef.width) {
                docRef.resizeImage(null, longestEdge, dpi, ResampleMethod.BICUBIC);
            } else {
                docRef.resizeImage(longestEdge, null, dpi, ResampleMethod.BICUBIC);
            }





            //Executa Action quando a opção Pos Executar esta selecionada
            //Executes Action when After Exec option is selected
            if (config.chkAction == true && config.radPostExec == true) {
                app.doAction(config.edAction, config.edGroupAction);
            }



            //Salva o arquivo na pasta de destino
            //Saves the file to the destination folder
            /*
            var newFileName = docRef.name;
          
            if (config.chkRename == true) {
                if (config.drpSufix == 0) {
                    newFileName = config.edNamePrefix + i + ".jpg";
                } else {
                    newFileName = config.edNamePrefix + docRef.name;
                }
            }
            */

            saveFile = new File(config.edPathTarget + "/" + newFileName);
            saveFile.resize;
            saveOptions = new JPEGSaveOptions();
            saveOptions.embedColorProfile = true;
            saveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
            saveOptions.matte = MatteType.NONE;
            saveOptions.quality = config.sldrQuality; //Qualidade do JPG - nível de compactacao/ JPG quality - compression level

            app.activeDocument.saveAs(saveFile, saveOptions, true, Extension.LOWERCASE);

            //Fecha o Arquivo 
            //Closes the file
            docRef.close(SaveOptions.DONOTSAVECHANGES);


        }
    }
}


/**
 * Cria o index em PDF A4
 * Create index in PDF File size A4
 */
function createPDF() {

    var newLongestEdge = 2280 / config.edCountImagesLine; //Parametro para redimensionar as imgens / Parameter to resize the images
    newLongestEdge = UnitValue(newLongestEdge, "px");
    var leftMargin = 100; //100 pixels de margem  / 100 margin pixels
    var topMargin = 300;// 300 pixels de cabecalho / 300 header pixels
    var x = leftMargin;
    var y = topMargin;
    var x1 = 0;
    var y1 = 0;

    //Abre Documento auxiliar
    //Opens auxiliary file
    var fileAux = new File("~/Documents/Smart Index/A4 em branco.png");
    var docAux = open(fileAux);

    //Busca todos os arquivos
    //Get all files
    listOfFiles = Folder(config.edPathTarget).getFiles();

    //Cria uma pasta chamada index dentro da pasta de destino
    //Creates a folder called index within the destination folder
    var folder1 = Folder(config.edPathTarget + "/index");
    //Check if it exist, if not create it.
    if (!folder1.exists) folder1.create();

    var pagePDF = 0;
    var layer = 0;
    for (var i = 0; i < listOfFiles.length; i++) {
        if (listOfFiles[i] instanceof File && listOfFiles[i].hidden == false) {
            var docRef = open(listOfFiles[i]);

            //Otimização da imagem  / Image optimization
            var dpi = 300;  //config.radOtimPDF == "true"

            //redimensionamento da imagem  / image resizing
            if (docRef.height > docRef.width) {
                docRef.resizeImage(null, newLongestEdge, dpi, ResampleMethod.BICUBIC);
            } else {
                docRef.resizeImage(newLongestEdge, null, dpi, ResampleMethod.BICUBIC);
            }

            //Copia imagem para o layout A4 / Copy image to A4 layout
            app.doAction("Copy Image to A4 Layout", "Smart Index Action Set.ATN");

            //paramatro para posicionar a imagem no meio da coluna 
            //parameter to position the image in the middle of the column
            x1 = (newLongestEdge - docRef.width) / 2;

            //parametro para alinhar as imagens
            //parameter to align the images
            y1 = (newLongestEdge - docRef.height);

            layer = layer + 1;
            MoveLayerTo2(app.activeDocument.layers.getByName("Layer " + layer), x, y, x1, y1);

            x = x + newLongestEdge;
            if (x == 2280 || x > 2280) { //ja foi descontato 200 pixels das margens / 200 pixels of margins have already been discounted
                x = leftMargin;
                y = y + newLongestEdge;

                if (y == 3208 || (y + newLongestEdge) > 3208) { //Ja foi descontado 400 pixels das margens / 400 pixels of the margins have already been discounted
                    pagePDF = pagePDF + 1;
                    // salva PDF / save PDF
                    var lowResOpts = new PDFSaveOptions();
                    var lowResFile = new File(config.edPathTarget + "/index/index " + pagePDF + ".pdf");
                    docAux.saveAs(lowResFile, lowResOpts);

                    //Fecha docAux e reabre folha em branco
                    //Close docAux and reopen blank sheet
                    docAux.close(SaveOptions.DONOTSAVECHANGES);
                    fileAux = new File("~/Documents/Smart Index/A4 em branco.png");
                    docAux = open(fileAux);
                    x = leftMargin;
                    y = topMargin;
                    x1 = 0;
                    y1 = 0;
                    layer = 0;
                }

            }

            //Fecha o Arquivo 
            //Closes the file
            docRef.close(SaveOptions.DONOTSAVECHANGES);

        }
    }

    //se ainda houver uma pagina em aberto   
    //if there is still an open page         
    if (app.documents.length != 0) {
        pagePDF = pagePDF + 1;
        // salva PDF / save PDF
        var lowResOpts = new PDFSaveOptions();
        var lowResFile = new File(config.edPathTarget + "/index/index " + pagePDF + ".pdf");
        docAux.saveAs(lowResFile, lowResOpts);

        //Fecha docAux e reabre folha em branco
        //Close docAux and reopen blank sheet
        docAux.close(SaveOptions.DONOTSAVECHANGES);
    }
}


/**
 * Move a layer para a posicao indicada por X e Y
 * Moves the layer to the position indicated by X and Y
 */
function MoveLayerTo(fLayer, fX, fY) {

    //altera as preferências do Photoshop para trabalhar em pixels
    //changes Photoshop preferences to work in pixels
    preferences.rulerUnits = Units.PIXELS
    preferences.typeUnits = TypeUnits.PIXELS

    //Movimenta a layer
    //Move the layer
    var Position = fLayer.bounds;


    Position[0] = fX - Position[0];
    Position[1] = fY - Position[1];


    fLayer.translate(-Position[0], -Position[1]);
}

/**
 * Move a layer para a posicao indicada por X e Y
 * Moves the layer to the position indicated by X and Y
 */
function MoveLayerTo2(fLayer, fX, fY, x1, y1) {

    //altera as preferencias do Photoshop para trabalhar em pixels
    //changes Photoshop preferences to work in pixels
    preferences.rulerUnits = Units.PIXELS
    preferences.typeUnits = TypeUnits.PIXELS

    //Movimenta a layer
    //Move the layer
    var Position = fLayer.bounds;

    Position[0] = Position[0] - fX - x1;
    Position[1] = Position[1] - fY - y1;

    fLayer.translate(-Position[0], -Position[1]);
}

/**
 *  Cria Text Layer 
 *  Creates Text Layer
 */
function createText(fface, size, colR, colG, colB, content, tX, tY) {

    // Add a new layer in the new document
    var artLayerRef = app.activeDocument.artLayers.add()

    // Specify that the layer is a text layer
    artLayerRef.kind = LayerKind.TEXT

    //This section defines the color of the hello world text
    textColor = new SolidColor();
    textColor.rgb.red = colR;
    textColor.rgb.green = colG;
    textColor.rgb.blue = colB;

    //Get a reference to the text item so that we can add the text and format it a bit
    textItemRef = artLayerRef.textItem
    textItemRef.font = fface;
    textItemRef.contents = content;
    textItemRef.color = textColor;
    textItemRef.size = size
    textItemRef.position = new Array(tX, tY) //pixels from the left, pixels from the top
}

//-----------------------------------------------------------------------------------------------------------------------------
/**
 *   Cria Tela do programa  
 *   Creates the user interface
 */
function createUI() {


    config = ReadConfig();

    var win = new Window("dialog", "Smart Index"); //cria a janela / create the window
    win.alignment = "left";
    // win.margins = [0,0,0,0];

    //---------------- Panel Pastas / Panel Folders ----------------------------------
    var pnlPath = win.add('panel', undefined, 'Pastas', { borderStyle: 'gray' });
    pnlPath.size = [600, 100, 600, 100];
    pnlPath.alignChildren = "top";
    pnlPath.alignment = "left";
    //pnlOtim.orientation = "row";      

    var grpPath1 = pnlPath.add("group");
    grpPath1.alignChildren = "top";
    grpPath1.alignment = "left";

    grpPath1.add("statictext", undefined, "Pasta de Origem: ");
    var edPathSource = grpPath1.add("edittext", undefined, config.edPathSource);
    edPathSource.characters = 50;
    //edPathSource.active = true;   

    var btBrowse1 = grpPath1.add("button", undefined, "Browse");

    btBrowse1.onClick = function () {  //captura o caminho da pasta de origem / captures the source folder path
        edPathSource.text = Folder.selectDialog().fsName;
    }

    var grpPath2 = pnlPath.add("group");
    grpPath2.alignChildren = "top";
    grpPath2.alignment = "left";

    grpPath2.add("statictext", undefined, "Pasta de Destino:");
    var edPathTarget = grpPath2.add("edittext", undefined, config.edPathTarget);
    edPathTarget.characters = 50;

    var btBrowse1 = grpPath2.add("button", undefined, "Browse");

    btBrowse1.onClick = function () {  //captura o caminho da pasta de destino / captures the destination folder path
        edPathTarget.text = Folder.selectDialog().fsName;
    }


    //------------------ Panel Otimização de Imagem / Image Optimization Panel --------------------------------
    var pnlOtim = win.add('panel', undefined, 'Otimizacão de Imagem', { borderStyle: 'gray' });
    pnlOtim.size = [600, 100, 600, 100];
    pnlOtim.alignChildren = "top";
    pnlOtim.alignment = "left";
    //pnlOtim.orientation = "row";

    var grp1 = pnlOtim.add("group");
    grp1.alignChildren = "top";
    grp1.alignment = "left";

    grp1.add("statictext", undefined, "Aresta Longa (px): ");
    var edLongestEdge = grp1.add("edittext", undefined, config.edLongestEdge);
    edLongestEdge.characters = 8;

    var grp2 = pnlOtim.add("group");
    grp2.alignChildren = "top";
    grp2.alignment = "left";


    grp2.add("statictext", undefined, "Qualidade: ");
    var sldrQuality = grp2.add("slider", undefined, config.sldrQuality, 1, 12);
    var edQuality = grp2.add("edittext", undefined, config.edQuality);
    edQuality.characters = 4;
    grp2.add("statictext", undefined, "%");
    sldrQuality.onChanging = function () { edQuality.text = sldrQuality.value; }


    var grp3 = pnlOtim.add("group");
    grp3.alignChildren = "top";
    grp3.alignment = "left";

    var radOtimWeb = grp3.add("radiobutton", undefined, "Otimizar para web");
    var radOtimPDF = grp3.add("radiobutton", undefined, "Otimizar para PDF");
    radOtimWeb.value = config.radOtimWeb;
    radOtimPDF.value = config.radOtimPDF;

    //----------------------- Panel SEO -------------------------------------------------
    var pnlSEO = win.add('panel', undefined, 'SEO', { borderStyle: 'gray' });
    pnlSEO.size = [600, 130, 600, 130];
    pnlSEO.alignChildren = "top";
    pnlSEO.alignment = "left";
    //pnlSEO.orientation = "row";        

    var grpSeo1 = pnlSEO.add("group");
    grpSeo1.alignChildren = "top";
    grpSeo1.alignment = "left";

    var chkSeo = grpSeo1.add("checkbox", undefined, "Inserir Metadados");
    chkSeo.value = config.chkSeo;

    var grpSeo2 = pnlSEO.add("group");
    grpSeo2.alignChildren = "top";
    grpSeo2.alignment = "left";

    grpSeo2.add("statictext", undefined, "Arquivo XML: ");
    var edPathMeta = grpSeo2.add("edittext", undefined, config.edPathMeta);
    edPathMeta.characters = 50;

    var btBrowse1 = grpSeo2.add("button", undefined, "Browse");

    btBrowse1.onClick = function () {  //captura o caminho da pasta de origem / captures the source folder path
        edPathMeta.text = File.openDialog().fsName;
    }


    /*  var grpSeo3 = pnlSEO.add ("group");
     grpSeo3.alignChildren = "top";
     grpSeo3.alignment = "left";          
     
     grpSeo3.add("statictext", undefined, "Autor: ");
     
     var  edAuthor = grpSeo3.add("edittext", undefined, config.edAuthor);
     edAuthor.characters = 40 ;         
     
      var grpSeo4 = pnlSEO.add ("group");
     grpSeo4.alignChildren = "top";
     grpSeo4.alignment = "left";          
     
     grpSeo4.add("statictext", undefined, "Mais Palavras Chave: ");
     
     var  edKeywords = grpSeo4.add("edittext", undefined, config.edKeywords);
     edKeywords.characters = 60 ;      */

    var edAuthor = "ainda nao implementado";
    var edKeywords = "ainda nao implementado";

    var grpSeo5 = pnlSEO.add("group");
    grpSeo5.alignChildren = "top";
    grpSeo5.alignment = "left";

    var chkRename = grpSeo5.add("checkbox", undefined, "Renomear Arquivos");
    chkRename.value = config.chkRename;

    var grpSeo6 = pnlSEO.add("group");
    grpSeo6.alignChildren = "top";
    grpSeo6.alignment = "left";

    grpSeo6.add("statictext", undefined, "Prefixo: ");

    var edNamePrefix = grpSeo6.add("edittext", undefined, config.edNamePrefix);
    edNamePrefix.characters = 30;

    grpSeo6.add("statictext", undefined, "Sufixo: ");
    var drpSufix = grpSeo6.add("dropdownlist", undefined, ["Num. Sequencial", "Num. Arq. Original"]);
    drpSufix.selection = config.drpSufix;

    //----------------------------- Panel Action ----------------------------------------------------------
    var pnlAction = win.add('panel', undefined, 'Action', { borderStyle: 'gray' });
    pnlAction.size = [600, 130, 600, 130];
    pnlAction.alignChildren = "top";
    pnlAction.alignment = "left";
    //pnlAction.orientation = "row";      

    var grpAction0 = pnlAction.add("group");
    grpAction0.alignChildren = "top";
    grpAction0.alignment = "left";

    var chkAction = grpAction0.add("checkbox", undefined, "Executar Action");
    chkAction.value = config.chkAction;


    var grpAction1 = pnlAction.add("group");
    grpAction1.alignChildren = "top";
    grpAction1.alignment = "left";

    grpAction1.add("statictext", undefined, "Grupo da Action: ");
    var edGroupAction = grpAction1.add("edittext", undefined, config.edGroupAction);
    edGroupAction.characters = 25;

    var grpAction2 = pnlAction.add("group");
    grpAction2.alignChildren = "top";
    grpAction2.alignment = "left";

    grpAction2.add("statictext", undefined, "Action: ");
    var edAction = grpAction2.add("edittext", undefined, config.edAction);
    edAction.characters = 25;

    var grpAction3 = pnlAction.add("group");
    grpAction3.alignChildren = "top";
    grpAction3.alignment = "left";

    var radPreExec = grpAction3.add("radiobutton", undefined, "Pré-Executada");
    var radPostExec = grpAction3.add("radiobutton", undefined, "Pós-Executada");
    radPreExec.value = config.radPreExec;
    radPostExec.value = config.radPostExec;

    //----------------------- Panel Index -------------------------------------------------
    var pnlIndex = win.add('panel', undefined, 'Index', { borderStyle: 'gray' });
    pnlIndex.size = [600, 100, 600, 100];
    pnlIndex.alignChildren = "top";
    pnlIndex.alignment = "left";
    //pnlIndex.orientation = "row";     

    var grpIndex1 = pnlIndex.add("group");
    grpIndex1.alignChildren = "top";
    grpIndex1.alignment = "left";
    //grpIndex1.orientation = "collumn";       

    var chkFileNum = grpIndex1.add("checkbox", undefined, "Plotar Número Arquivo");
    chkFileNum.value = config.chkFileNum;
    var chkRating = grpIndex1.add("checkbox", undefined, "Plotar Rating");
    chkRating.value = config.chkRating;
    var chkComment = grpIndex1.add("checkbox", undefined, "Plotar Comentários");
    chkComment.value = config.chkComment;
    var chkCheckbox = grpIndex1.add("checkbox", undefined, "Plotar Checkbox");
    chkCheckbox.value = config.chkCheckbox;

    var grpIndex2 = pnlIndex.add("group");
    grpIndex2.alignChildren = "top";
    grpIndex2.alignment = "left";

    var chkPDF = grpIndex2.add("checkbox", undefined, "Criar PDF A4");
    chkPDF.value = config.chkPDF;

    grpIndex2.add("statictext", undefined, "Qtd. Imagens por linha: ");
    var edCountImagesLine = grpIndex2.add("edittext", undefined, config.edCountImagesLine);
    edCountImagesLine.characters = 8;

    //---------------------------- Group Buttons ---------------------------------------
    var grpButton = win.add("group");
    grpButton.alignment = "right";
    grpButton.add("button", undefined, "OK");
    grpButton.add("button", undefined, "Cancel");



    var returnAction = win.show(); //1 = OK/Enter; 2 = Cancel/Esc


    //Save the current State of all variables on the Screen     
    SaveCurrentConfig(edPathSource,
        edPathTarget,
        edLongestEdge,
        sldrQuality,
        edQuality,
        radOtimWeb,
        radOtimPDF,
        chkSeo,
        edPathMeta,
        edAuthor,
        edKeywords,
        chkRename,
        edNamePrefix,
        drpSufix,
        chkAction,
        edGroupAction,
        edAction,
        radPreExec,
        radPostExec,
        chkFileNum,
        chkRating,
        chkComment,
        chkCheckbox,
        chkPDF,
        edCountImagesLine,
        returnAction);



    config = ReadConfig();


    return config;

}


//------------------------------------------------------------ Manipula Arquivo de configuração  -----------------------------------------------------------------

/**
 * Salva o Arquivo de Configuração 
 * Save the configuration file
 */
function SaveCurrentConfig(edPathSource,
    edPathTarget,
    edLongestEdge,
    sldrQuality,
    edQuality,
    radOtimWeb,
    radOtimPDF,
    chkSeo,
    edPathMeta,
    edAuthor,
    edKeywords,
    chkRename,
    edNamePrefix,
    drpSufix,
    chkAction,
    edGroupAction,
    edAction,
    radPreExec,
    radPostExec,
    chkFileNum,
    chkRating,
    chkComment,
    chkCheckbox,
    chkPDF,
    edCountImagesLine,
    returnAction) {
    var F = new File(ConfigFile);
    //alert(" configuration file \"" + F.fsName  + "\"");

    if (!F.open("w")) {
        if (ReportErrors)
            alert("couldn't create configuration file \"" + ConfigFile + "\"");
        return false; // no such file
    }
    F.write("#    User configuraiton file for Smart Index Script\n");
    F.write("#    www.lunartec.com.br\n\n\n");

    F.write("# written " + (new Date) + "\n");
    F.write("[edPathSource.text=" + edPathSource.text + "]\n");
    F.write("[edPathTarget.text=" + edPathTarget.text + "]\n");
    F.write("[edLongestEdge.text=" + edLongestEdge.text + "]\n");
    F.write("[sldrQuality.value=" + sldrQuality.value + "]\n");
    F.write("[edQuality.text=" + edQuality.text + "]\n");
    F.write("[radOtimWeb.value=" + radOtimWeb.value + "]\n");
    F.write("[radOtimPDF.value=" + radOtimPDF.value + "]\n");
    F.write("[chkSeo.value=" + chkSeo.value + "]\n");
    F.write("[edPathMeta.text=" + edPathMeta.text + "]\n");
    F.write("[edAuthor.text=" + edAuthor.text + "]\n");
    F.write("[edKeywords.text=" + edKeywords.text + "]\n");
    F.write("[chkRename.value=" + chkRename.value + "]\n");
    F.write("[edNamePrefix.text=" + edNamePrefix.text + "]\n");
    F.write("[drpSufix.selection=" + drpSufix.selection + "]\n");
    F.write("[chkAction.value=" + chkAction.value + "]\n");
    F.write("[edGroupAction.text=" + edGroupAction.text + "]\n");
    F.write("[edAction.text=" + edAction.text + "]\n");
    F.write("[radPreExec.value=" + radPreExec.value + "]\n");
    F.write("[radPostExec.value=" + radPostExec.value + "]\n");
    F.write("[chkFileNum.value=" + chkFileNum.value + "]\n");
    F.write("[chkRating.value=" + chkRating.value + "]\n");
    F.write("[chkComment.value=" + chkComment.value + "]\n");
    F.write("[chkCheckbox.value=" + chkCheckbox.value + "]\n");
    F.write("[chkPDF.value=" + chkPDF.value + "]\n");
    F.write("[edCountImagesLine.text=" + edCountImagesLine.text + "]\n");
    F.write("[returnAction.value=" + returnAction + "]\n");

    F.close();
}

/**
 * Lê o Arquivo de Configuração 
 * Reads the Configuration File
 */
function ReadConfig() {

    var config = {
        edPathSource: "",
        edPathTarget: "",
        edLongestEdge: "",
        sldrQuality: 0,
        edQuality: "",
        radOtimWeb: false,
        radOtimPDF: false,
        chkSeo: false,
        edPathMeta: "",
        edAuthor: "",
        edKeywords: "",
        chkRename: false,
        edNamePrefix: "",
        drpSufix: 0,
        chkAction: false,
        edGroupAction: "",
        edAction: "",
        radPreExec: false,
        radPostExec: false,
        chkFileNum: false,
        chkRating: false,
        chkComment: false,
        chkCheckbox: false,
        chkPDF: false,
        edCountImagesLine: "",
        returnAction: 0
    };

    var F = new File(ConfigFile);
    if (!F.open("r")) {
        if (ReportErrors)
            alert("Couldn't open annotation file \"" + name + "\"");

        return false; // no such file
    }

    // var ConfigStack = new Array();

    var linenum = 0;
    do {
        var line = F.readln();

        if (line.match(/^\s*#/))
            continue; // skip lines beginning with #

        if (line.match(/^\s*$/))
            continue; // skip empty lines


        if (line.match(/^\s*\[/)) {
            if (line.match(/(\w*\.\w*)=(.*)(\])/)) {
                var key = RegExp.$1;
                var val = RegExp.$2;

                //alert(" line : " + line+ " key: " + key + " val: " + val);
            }

            if (key == 'edPathSource.text') {
                config.edPathSource = val;
            }

            if (key == 'edPathTarget.text') {
                config.edPathTarget = val;
            }

            if (key == 'edLongestEdge.text') {
                config.edLongestEdge = val;
            }

            if (key == 'sldrQuality.value') {
                config.sldrQuality = val;
            }

            if (key == 'edQuality.text') {
                config.edQuality = val;
            }

            if (key == 'radOtimWeb.value') {
                if (val == 'true') {
                    config.radOtimWeb = true;
                } else {
                    config.radOtimWeb = false;
                }
            }

            if (key == 'radOtimPDF.value') {
                if (val == 'true') {
                    config.radOtimPDF = true;
                } else {
                    config.radOtimPDF = false;
                }
            }

            if (key == 'chkSeo.value') {
                if (val == 'true') {
                    config.chkSeo = true;
                } else {
                    config.chkSeo = false;
                }

            }

            if (key == 'edPathMeta.text') {
                config.edPathMeta = val;
            }

            if (key == 'edAuthor.text') {
                config.edAuthor = val;
            }

            if (key == 'edKeywords.text') {
                config.edKeywords = val;
            }

            if (key == 'chkRename.value') {
                if (val == 'true') {
                    config.chkRename = true;
                } else {
                    config.chkRename = false;
                }
            }

            if (key == 'edNamePrefix.text') {
                config.edNamePrefix = val;
            }

            if (key == 'drpSufix.selection') {
                config.drpSufix = val;
            }

            if (key == 'chkAction.value') {
                if (val == 'true') {
                    config.chkAction = true;
                } else {
                    config.chkAction = false;
                }
            }

            if (key == 'edGroupAction.text') {
                config.edGroupAction = val;
            }

            if (key == 'edAction.text') {
                config.edAction = val;
            }

            if (key == 'radPreExec.value') {
                if (val == 'true') {
                    config.radPreExec = true;
                } else {
                    config.radPreExec = false;
                }
            }

            if (key == 'radPostExec.value') {
                if (val == 'true') {
                    config.radPostExec = true;
                } else {
                    config.radPostExec = false;
                }
            }

            if (key == 'chkFileNum.value') {
                if (val == 'true') {
                    config.chkFileNum = true;
                } else {
                    config.chkFileNum = false;
                }
            }

            if (key == 'chkRating.value') {
                if (val == 'true') {
                    config.chkRating = true;
                } else {
                    config.chkRating = false;
                }
            }

            if (key == 'chkComment.value') {
                if (val == 'true') {
                    config.chkComment = true;
                } else {
                    config.chkComment = false;
                }
            }

            if (key == 'chkCheckbox.value') {
                if (val == 'true') {
                    config.chkCheckbox = true;
                } else {
                    config.chkCheckbox = false;
                }
            }

            if (key == 'chkPDF.value') {
                if (val == 'true') {
                    config.chkPDF = true;
                } else {
                    config.chkPDF = false;
                }
            }

            if (key == 'edCountImagesLine.text') {
                config.edCountImagesLine = val;
            }

            if (key == 'returnAction.value') {
                config.returnAction = val;
            }

        }
        //  alert(" \"" + line+ "\"");
        linenum++;
    } while (!F.eof);

    return config;
}


//---------------------------------------------------------------------------------------------------------------------------
/**
 * Add Metadados XMP
 * Add XMP Metadata
 */
function addXMPMetaData(edPathMeta) {
    var f = new File(edPathMeta);
    f.open('r');
    var xml = new XML(f.read());
    f.close();

    activeDocument.xmpMetadata.rawData = xml;
}


//----------------------------------------Ler Metadados XMP / Read XMP Metadata-------------------------------------------------------------------
/**
 *  Get Rating
 */
function getRating() {


    if (app.activeDocument || !loadXMPLibrary()) {

        loadXMPLibrary();
        //xmp = new XMPMeta(activeDocument.xmpMetadata.rawData);  

        var xmpData = new XMPMeta(activeDocument.xmpMetadata.rawData);
        //xmpData.appendArrayItem(XMPConst.NS_DC, "myProperty", "test", 0,XMPConst.ARRAY_IS_ORDERED)  
        //activeDocument.xmpMetadata.rawData = xmpData.serialize();  

        //var myCreatorTool = xmpData.getProperty(XMPConst.NS_DC,"myProperty");
        //var flagPastaEntrada = confirm("myProperty  \n" + myCreatorTool);
        var myRating = xmpData.getProperty(XMPConst.NS_XMP, "Rating");

        if (myRating == undefined) {
            myRating = 0;
        }

        unloadXMPLibrary();

        return myRating;

    }
}


/**
 * Get Comment
 */
function getComment(docRef) {


    if (app.activeDocument) {
        var comment = docRef.info.caption;
        if (comment == undefined) {
            comment = "";
        }


        return comment;

    }
}


//First, we are going to load ‘AdobeXMPScript’ through ‘External Object’.
function loadXMPLibrary() {
    if (!ExternalObject.AdobeXMPScript) {
        try {
            ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
        } catch (e) {
            alert('Unable to load the AdobeXMPScript library!');
            return false;
        }
    }
    return true;
}


//Also, if you want to unload ‘AdobeXMPScript’ at the end, you can do it like this:
function unloadXMPLibrary() {
    if (ExternalObject.AdobeXMPScript) {
        try {
            ExternalObject.AdobeXMPScript.unload();
            ExternalObject.AdobeXMPScript = undefined;
        } catch (e) {
            alert('Unable to unload the AdobeXMPScript library!');
        }
    }
}



//--------------------------------------  --------------------------------------------------------
/**
 * Cria nova layer
 * Create a new layer below current active layer
 */
function createLayerBelowCurrent(astring) {

    var currentActivelayer = app.activeDocument.activeLayer;
    var idx = getLayerIndex(currentActivelayer);

    // Get a reference to the active layer
    var layerRef = app.activeDocument.layers[idx];


    // Create a new Art Layer, by default at the top of the document
    var newLayerRef = app.activeDocument.artLayers.add();

    // Move the new layer set to after the previously first layer
    newLayerRef.move(layerRef, ElementPlacement.PLACEAFTER);
}

/**
 *  Pega Indice da layer 
 *  Get Layer Index
 */
function getLayerIndex(ref) {
    // return the idex of ALL layers
    var numOfLayers = app.activeDocument.layers.length;

    // work from the top of the stack down!
    for (var i = numOfLayers - 1; i >= 0; i--) {
        var tempLayer = app.activeDocument.layers[i];
        if (tempLayer == ref) return i

        if (tempLayer.typename == "LayerSet") {
            var subDoc = app.activeDocument.layers[i];
            for (var j = numOfSubLayers - 1; j >= 0; j--) {
                var tempSubLayer = subDoc.layers[j]
                if (tempSubLayer == ref) return j
            }
        }
    }
}

/**
 * Preenchimento da Layer 
 * fill layer 
 */
function fillLayer(sColor) {
    app.activeDocument.selection.selectAll();
    app.activeDocument.selection.fill(sColor, undefined, undefined, true);
    app.activeDocument.selection.deselect();

}


//---------------------------------- ---------------------------------------------------------------
//exemplo de redimensionamento de imagem (nao esta sendo usado)
// Sample of Image Resize Routine (is not in Use)
function ResizeImage() {
    var MedWidth = UnitValue(300, "px");
    var MedHeight = UnitValue(225, "px");
    activeDocument.resizeImage(MedWidth, null, null, ResampleMethod.BICUBIC);
    activeDocument.resizeCanvas(MedWidth, MedHeight, AnchorPosition.MIDDLECENTER);
}

  //                      app.activeDocument.activeLayer.duplicate();
 //                       app.activeDocument.activeLayer = app.activeDocument.layers.getByName("Background copy");

 //                       createLayerBelowCurrent();



  //                      var sColor =  new SolidColor;  
  //                      sColor.rgb.hexValue = '9f13a8';  
  //                      app.activeDocument.activeLayer = app.activeDocument.layers.getByName("Layer 1");
  //                      app.activeDocument.selection.selectAll();  
  //                      app.activeDocument.selection.fill( sColor, undefined, undefined, true);  
  //                      app.activeDocument.selection.deselect();                


                       // alert("entrou aqui");
