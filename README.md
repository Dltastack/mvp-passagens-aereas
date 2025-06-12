# ✈️ Fetch Trip

O **Fetch Trip** é um projeto que consome a API de busca de voos da Amadeus para oferecer uma experiência otimizada de consulta e comparação de ofertas de passagens aéreas.

## 🚀 Objetivo

Prover uma interface intuitiva e eficiente para busca de voos com base em critérios como origem, destino, datas, número de passageiros e preferências de voo.

## 🔧 Tecnologias Utilizadas

- **API Amadeus (Flight Offers Search v2)**
- **TypeScript / JavaScript**
- **Node.js / Next.js** *(assumindo um ambiente moderno)*
- **Axios ou fetch API** para requisições HTTP
- **Swagger/OpenAPI** para documentação e validação da integração

## 📦 Funcionalidades

- Busca de voos por IATA Code (ex: GRU → LIS)
- Filtro por data de ida e volta
- Escolha de número de passageiros (adultos, crianças, bebês)
- Opção de voos diretos (non-stop)
- Retorno com informações de preços, companhias e horários

## 📄 Como usar

1. Clone o repositório:
  ```bash
     git clone https://github.com/Dltastack/fetch-trip.git
  ```
2. Instale as dependências:
  ```bash
    npm install
  ```
3. Configure a variável de ambiente com sua chave da API Amadeus:
  ```bash
    NEXT_PUBLIC_AMADEUS_API_KEY=your_key_here
    NEXT_PUBLIC_AMADEUS_API_SECRET=your_secret_here
  ```
4. Rode a aplicação
  ```bash
    npm run dev
  ```