import type { CardValue } from "@/types/game";

export const CARD_VALUES: CardValue[] = [
  {
    title: "Impacto para o cliente",
    principles: [
      "Priorizamos o que move métricas de valor, não vaidade",
      "Preferimos progresso e aprendizado à perfeição",
      "Entendemos profundamente a dor do cliente e do mercado antes de construir",
      "Removemos fricções e criamos soluções que o cliente usa e defende",
    ],
    we_adopt: [
      "Entregar valor mesmo que não esteja perfeito",
      "Focar em resultado real gerado ao cliente",
    ],
    not_confuse_with: [
      "Entregar com falhas e erros (baixa qualidade)",
      '"Cliente pediu = fazemos" sem contexto de impacto',
      "Focar em tarefas sem clareza do resultado real que elas geram",
    ],
    reflection_questions: [
      "Conte uma situação em que você entregou algo que, na sua visão, não estava perfeito, mas atendeu ao que o cliente esperava. Como foi?",
      "Você já precisou mudar um processo interno em que acreditava para atender melhor o cliente? Qual foi o resultado?",
    ],
  },
  {
    title: "Donos do problema",
    principles: [
      "Atacamos a causa raiz, não o sintoma",
      "Executamos com autonomia responsável: resolvemos > aprendemos > estruturamos",
      "Entendemos que problema visto vira problema assumido (com responsável claro)",
      "Erramos rápido e evitamos reincidência",
    ],
    we_adopt: [
      "Assumir responsabilidade clara pelos problemas",
      "Resolver, aprender e estruturar para evitar recorrência",
    ],
    not_confuse_with: [
      "Transferir o problema sem contextualização adequada",
      "Confundir 'ser dono(a) do problema' com sobrecarga de trabalho",
      "Resolver tudo sozinho / heroísmo",
    ],
    reflection_questions: [
      "Você já resolveu um problema, mas percebeu depois que ele voltou a acontecer? O que faltou aprender ou estruturar naquela vez?",
      "Conte um problema que você assumiu mesmo não sendo 'oficialmente' sua responsabilidade. Como você trouxe a solução?",
    ],
  },
  {
    title: "Clareza que constrói",
    principles: [
      "Nos comunicamos de forma direta e objetiva",
      "Pedimos e aplicamos feedback como prática, não evento",
      "Explicamos o porquê das decisões e os trade-offs",
      "Mantemos alinhamento frequente (especialmente em times distribuídos)",
    ],
    we_adopt: [
      "Comunicação clara, direta e com contexto",
      "Alinhamento contínuo entre as partes envolvidas",
    ],
    not_confuse_with: [
      "Falta de empatia ou agressividade na comunicação",
      "Excesso de transparência (não entender o que, para quem e como comunicar)",
    ],
    reflection_questions: [
      "Você já teve uma conversa difícil que trouxe desconforto no início, mas melhorou o resultado depois?",
      "Conte uma situação em que a falta de clareza gerou confusão ou retrabalho. O que teria sido diferente com clareza desde o início?",
    ],
  },
  {
    title: "Construímos juntos",
    principles: [
      "Colaboramos de forma ativa entre áreas, sem silos",
      "Reconhecemos resultados como conquista do time",
      "Tomamos decisões com autonomia, mesmo ouvindo diferentes perspectivas",
    ],
    we_adopt: [
      "Colaboração ativa e contextualizada",
      "Decisão com autonomia após ouvir diferentes pontos de vista",
    ],
    not_confuse_with: [
      "Delegar sem contexto",
      "Colaborar só quando há interesse individual envolvido",
      "Só tomar decisão se tiver consenso entre todos",
    ],
    reflection_questions: [
      "Conte uma situação na qual o trabalho em time trouxe um resultado melhor do que tentar garantir tudo sozinho. Qual foi o aprendizado?",
      "Você já discordou de alguém de outra área e, ainda assim, conseguiram construir algo melhor juntos? Como foi?",
    ],
  },
];
