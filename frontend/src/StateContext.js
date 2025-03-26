import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [characters, setCharacters] = useState([]);

  const addCampaign = (campaign) => {
    console.log('Adding campaign to state:', campaign);
    setCampaigns((prevCampaigns) => {
      const updatedCampaigns = [...prevCampaigns, campaign];
      console.log('Updated campaigns state:', updatedCampaigns);
      return updatedCampaigns;
    });
  };

  const addCharacter = (character) => {
    console.log('Adding character to state:', character);
    setCharacters((prevCharacters) => [...prevCharacters, character]);
  };

  return (
    <StateContext.Provider value={{ campaigns, setCampaigns, characters, setCharacters, addCampaign, addCharacter }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
