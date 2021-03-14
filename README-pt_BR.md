[English](./README.md) | Português | [German](./README-de_DE.md)

---

# Smart Index

 O Smart Index é um Script desenvolvido para rodar dentro do Photoshop, trata-se de uma ferramenta desenvolvida para fotógrafos profissionais, para automatizar a criação de índices fotográficos. 
 
 Uma das formas mais tradicionais de apresentar os resultados de um trabalho fotográfico é através de índices 
 fotográficos, que consistem em montar pequenas provas fotográficas dispostas lado a lado em folhas de papel fotográfico, normalmente em tamanho A4. 
 Nas formas mais comuns os índices fotográficos apenas relacionam as imagens e seus respectivos números de identificação. A proposta do Smart Index é enriquecer os índices com algumas informações adicionais, préviamente setadas pelo fotógrafo com o objetivo de direcionar e tornar a escolha do cliente mais acertiva.  

 

[![Badge](https://img.shields.io/static/v1?label=&message=Photoshop&color=blue&style=<STYLE>&logo=adobe-photoshop)](https://www.adobe.com/devnet/photoshop/scripting.html)
[![GitHub](https://img.shields.io/github/license/ivan-j-borchardt/ExemplosCursoVanillaJS)](./LICENSE.md)


## Status do Projeto
### Funcionalidades 

 - [x] Otimização de imagem para WEB e PDF com seletor de resolução e grau de compactação JPG
 - [x] Ações de SEO: inclusão de metadados a partir de arquivo XML  e função Renomear Arquivo 
 - [x] Executar Action: Permite executar uma Action Personalizada antes ou depois da otimização da imagem 
 - [x] Criar Index: contempla opções de plotar Número de arquivo, Rating, Comentários, Check Box e gerar PDF em A4 
 - [ ] Adicionar dados de cabeçalho e rodapé (Logo, Data, Número da página, Dados de contato do estúdio, etc)
 - [ ] Adicionar Suporte Multi-idioma

 - [ ] Adicionar Geo-Referenciamento às fotos (arquivo do Spot, Photo Track e app próprio pelo celular) 
 
 - [ ] Message on the end of the Script announcing that the processing is finished


## Pré-requisitos
- **Photoshop - Versão CS2 ou Superiores**  

- **Instalação da pasta Smart Index**
1. Clone o repositório 
    
    $ git clone <https://github.com/Ivan-J-Borchardt/SmartIndex>

2. Crie o diretório "~/Documents/Smart Index"
3. Copie todo o conteúdo do repositório clonado para o diretório criado no passo anterior. 

- **Instalação do Action Set**

1. Abra o Photoshop
2. Habilite a aba Actions
 
   Photoshop>Window>Actions
3. Nas opções da aba Actions selecione "Load Action"
4. Navegue até a pasta do projeto e selecione o Action Set "Smart Index Action Set.ant"




## Rodando a Aplicação

1. Abra o Photoshop
2. Execute o Script "Smart Index"

    Photoshop>File>Scripts>Browse, 
     e selecione o caminho até o Script. 

3. Configure o Smart Index de acordo com suas preferencias e clique "OK"

![Smart Index](./img/Screen.png)


### Tecnologias

- Photoshop
- JavaScript

### Autor
Ivan J. Borchardt

[![Linkedin Badge](https://img.shields.io/badge/-Ivan-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/ivan-borchardt/)](https://www.linkedin.com/in/ivan-borchardt/) 
[![Gmail Badge](https://img.shields.io/badge/-ivan.borchardt.cobol@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:ivan.borchardt.cobol@gmail.com)](mailto:ivan.borchardt.cobol@gmail.com)

### Licença
Este projeto esta sob a licença MIT.
