export interface CardValue {
  title: string;
  principles: string[];
  we_adopt: string[];
  not_confuse_with: string[];
  reflection_questions: string[];
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
