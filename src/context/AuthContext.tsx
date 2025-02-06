import React, {createContext, useState, useContext} from 'react';

interface AuthContextType {
  isFlipped: boolean;
  setIsFlipped: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <AuthContext.Provider value={{isFlipped, setIsFlipped}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 