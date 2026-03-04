export interface CardValue {
  title: string;
  principles: string[];
  ao_adotar: string[];
  nao_confundimos_com: string[];
  pergunta_reflexao: string;
}

export interface Card {
  id: string;
  value: CardValue;
  revealed: boolean;
}

export interface RoomState {
  code: string;
  cards: Card[];
  createdAt: number;
}

// Grouped principle for the final summary (4 unique principles)
export interface GroupedPrinciple {
  title: string;
  principles: string[];
  ao_adotar: string[];
  nao_confundimos_com: string[];
  perguntas_reflexao: string[];
}
