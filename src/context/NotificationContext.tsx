import { createContext, useContext, type ReactNode } from 'react';

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const showSuccess = (message: string) => {
    alert(`Éxito: ${message}`);
  };

  const showError = (message: string) => {
    alert(`Error: ${message}`);
  };

  return (
    <NotificationContext.Provider value={{ showSuccess, showError }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};