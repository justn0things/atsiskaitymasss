import React, { createContext, useContext, useState } from 'react';

interface Card {
  id: number;
  title: string;
  imageUrl: string;
}

interface CardContextType {
  cards: Card[];
  addCard: (card: Card) => void;
  deleteCard: (id: number) => void;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);

  const addCard = (card: Card) => {
    setCards((prevCards) => [...prevCards, card]);
  };

  const deleteCard = (id: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  return (
    <CardContext.Provider value={{ cards, addCard, deleteCard }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
};
