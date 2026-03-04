import type { CardValue } from "@/types/game";

// Each card is an individual unit with its own principles, nao_confundimos_com, and pergunta_reflexao.
// There are 8 cards total (2 per principle category).
export const CARD_VALUES: CardValue[] = [
  {
    title: "Impacto para o cliente",
    principles: [
      "Priorizamos o que move métricas de valor, não vaidade",
      "Preferimos progresso e aprendizado à perfeição",
    ],
    ao_adotar: [],
    nao_confundimos_com: [
      "Entregar com falhas e erros (baixa qualidade)",
      '"Cliente pediu = fazemos" sem contexto de impacto',
    ],
    pergunta_reflexao:
      "Conte uma situação em que você entregou algo que, na sua visão, não estava perfeito, mas atendeu ao que o cliente esperava. Como foi?",
  },
  {
    title: "Impacto para o cliente",
    principles: [
      "Entendemos profundamente a dor do cliente e do mercado antes de construir",
      "Removemos fricções e criamos soluções que o cliente usa e defende",
    ],
    ao_adotar: [],
    nao_confundimos_com: [
      "Focar em tarefas sem clareza do resultado real que elas geram",
    ],
    pergunta_reflexao:
      "Você já precisou mudar um processo interno em que acreditava para atender melhor o cliente? Qual foi o resultado?",
  },
  {
    title: "Donos do problema",
    principles: [
      "Atacamos a causa raiz, não o sintoma",
      "Executamos com autonomia responsável: resolvemos > aprendemos > estruturamos",
    ],
    ao_adotar: [],
    nao_confundimos_com: [
      "Transferir o problema sem contextualização adequada",
      'Confundir "ser dono(a) do problema" com sobrecarga de trabalho',
    ],
    pergunta_reflexao:
      "Você já resolveu um problema, mas percebeu depois que ele voltou a acontecer? O que faltou aprender ou estruturar naquela vez?",
  },
  {
    title: "Donos do problema",
    principles: [
      "Entendemos que problema visto vira problema assumido (com responsável claro)",
      "Erramos rápido e evitamos reincidência",
    ],
    ao_adotar: [],
    nao_confundimos_com: ["Resolver tudo sozinho / heroísmo"],
    pergunta_reflexao:
      'Conte um problema que você assumiu mesmo não sendo "oficialmente" sua responsabilidade. Como você trouxe a solução?',
  },
  {
    title: "Clareza que constrói",
    principles: [
      "Nos comunicamos de forma direta e objetiva",
      "Pedimos e aplicamos feedback como prática, não evento",
    ],
    ao_adotar: [],
    nao_confundimos_com: [
      "Falta de empatia ou agressividade na comunicação",
    ],
    pergunta_reflexao:
      "Você já teve uma conversa difícil que trouxe desconforto no início, mas melhorou o resultado depois?",
  },
  {
    title: "Clareza que constrói",
    principles: [
      "Explicamos o porquê das decisões e os trade-offs",
      "Mantemos alinhamento frequente (especialmente em times distribuídos)",
    ],
    ao_adotar: [],
    nao_confundimos_com: [
      "Excesso de transparência (não entender o que, para quem e como comunicar)",
    ],
    pergunta_reflexao:
      "Conte uma situação em que a falta de clareza gerou confusão ou retrabalho. O que teria sido diferente com clareza desde o início?",
  },
  {
    title: "Construímos juntos",
    principles: [
      "Colaboramos de forma ativa entre áreas, sem silos",
      "Reconhecemos resultados como conquista do time",
    ],
    ao_adotar: [],
    nao_confundimos_com: [
      "Delegar sem contexto",
      "Colaborar só quando há interesse individual envolvido",
    ],
    pergunta_reflexao:
      "Conte uma situação na qual o trabalho em time trouxe um resultado melhor do que tentar garantir tudo sozinho. Qual foi o aprendizado?",
  },
  {
    title: "Construímos juntos",
    principles: [
      "Tomamos decisões com autonomia, mesmo ouvindo diferentes perspectivas",
    ],
    ao_adotar: [],
    nao_confundimos_com: [
      "Só tomar decisão se tiver consenso entre todos",
    ],
    pergunta_reflexao:
      "Você já discordou de alguém de outra área e, ainda assim, conseguiram construir algo melhor juntos? Como foi?",
  },
];
