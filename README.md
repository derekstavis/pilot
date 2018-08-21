<img src="https://avatars1.githubusercontent.com/u/3846050?v=4&s=200" width="127px" height="127px" align="left"/>

# Pilot

[![Join the chat at https://gitter.im/pagarme/react-event-components](https://badges.gitter.im/pagarme/pilot.svg)](https://gitter.im/pagarme/pilot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

<br>

A próxima versão da Dashboard Pagar.me
<br>


## Índice

- [Introdução](#introdução)
- [Tecnologia utilizada](#tecnologia-utilizada)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Cockpit](#cockpit)
	- [Rodando testes no Cockpit](#rodando-testes-no-cockpit)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Contribuindo](#contribuindo)
- [Licenças](#licenças)

## Introdução 

Pilot é o codinome da nova dashboard do Pagar.me. O produto foi criado
a partir de feedbacks dos usuários, para que eles possam ter uma
experiência cada vez mais transparente de sua operação financeira no
Pagar.me, e consigam focar no seu negócio!

## Tecnologia utilizada

A stack foi escolhida com base no que empresas como Facebook, AirBnb,
e New York Times estão usando para construir suas experiências. Também foi
levado em consideração a simplicidade, curva de aprendizado e requisitos
como fácil distribuição e entrega progressiva.

Tendo isso em vista, optamos por usar [React](http://github.com/facebook/react) e [Ramda](https://github.com/ramda/ramda). 
A estrutura do projeto foi iniciada rapidamente usando o [FormerKit Dashboard](https://github.com/pagarme/react-scripts-former-kit-dashboard),
projeto que desenvolvemos baseado no Create React App para nos permitir
criar rapidamente projetos de dashboards.

## Requisitos

Este repositório é um monorepo que aloja os pacotes que compõem a Pilot.
Para instalar as dependências é necessário usar o
[Yarn](https://yarnpkg.com/en) versão 1.0 ou superior, que suporta a
funcionalidade de [Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).

## Instalação

Algumas instruções para desenvolver na Pilot:

1. **Clonando o repositório**

	```sh
	$ git clone git@github.com:pagarme/pilot.git
	```

2. **Rodando o servidor**

	Entre na pasta principal do projeto:

	```sh
	$ cd pilot
	```

	Use o Yarn para instalar as dependências:

	```sh
	$ yarn
	```

	Entre no diretório da Pilot e inicie a aplicação:

	```sh
	$ cd packages/pilot
	$ yarn start
	```

## Cockpit

![cockpit-data-flow](https://user-images.githubusercontent.com/20358128/42246516-48de3114-7ef3-11e8-8428-8b3462b7eb92.png)

O Cockpit é nossa biblioteca para efetuar requests a serviços externos, 
e devolver os dados retornados em um formato estruturado para serem 
utilizados nas páginas da Pilot. Atualmente, a principal função do 
Cockpit é fazer a comunicação com a API utilizando o [pagarme-js](https://github.com/pagarme/pagarme-js). Porém, sua estrutura permite 
interação com outros serviços, caso haja necessidade. Uma request ao 
Cockpit equivale a uma ou mais requests na API, onde o dado retornado 
será tratado para ser renderizado na Pilot.

### Rodando testes no Cockpit

Entre no diretório do Cockpit e inicie os testes:
```sh
$ cd packages/cockpit
$ yarn test
```

## Estrutura do projeto

- **`packages`**: Toda a estrutura de arquivos e pastas dos monorepos, 
seguindo a funcionalidades de [Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).

  - **`cockpit`**: Contém a estrutura de arquivos e pastas do Cockpit.
  	- **`config`**: Configurações gerais do Webpack e Jest.
  	- **`dist`**: Scripts prontos para produção.
  	- **`scripts`**: Todos os scripts usados para testes.
    - **`src`**: Código-fonte do Cockpit.

  - **`pilot`**: Contém a estrutura de arquivos e pastas do Pilot.
    - **`src`** 
      - **`components`**: Componentes pequenos, geralmente compostos de JSX
        e estilos. Não devem conter estado e devem estar aqui apenas caso
        sejam reutilizados em várias áreas distintas do app.
      - **`containers`**: Componentes grandes, compostos de outros componentes.
        Podem conter estilos e estado (desde que o estado seja irrelevante
        para o contexto da rota). Podem estar aqui para serem reutilizados
        ou por serem usados em uma rota inteira.
      - **`pages`**: Componentes grandes que contém a lógica de busca de
        dados e manutenção de estado das rotas do app. Não devem conter
        estilos e são os únicos componentes que podem ser conectados ao
        Redux.
      - **`formatters`**: Funções utilizadas para formatação dos dados da
        aplicação.
      - **`models`**: Dados estáticos que fazem parte da aplicação e mapeiam
        para dados usados ou retornados pela API.
    - **`stories`**: Nossa biblioteca de componentes, containers e páginas
      da aplicação. Utilizamos o [Storybook](https://github.com/storybooks/storybook)
      para auxiliar no desenvolvimento usando mocks e para efetuar
      validações visuais.

## Contribuindo

Para ler informações sobre contribuição, confira nosso guia 
de contribuição em [CONTRIBUTING.md](CONTRIBUTING.md).

## Licenças

Veja as licenças em [LICENSES](LICENSES.md).
