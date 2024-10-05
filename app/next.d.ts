// next.d.ts
import { IncomingMessage } from 'http';

declare module 'http' {
  interface IncomingMessage {
    isAuthenticated: () => boolean; // Ajoute la méthode isAuthenticated
    user: {
      displayName: string;
      emails: { value: string }[];
      name: {
        givenName: string;
        familyName: string;
      };
      birthDate?: string; // Ajoutez cette ligne
      address?: string;    // Ajoutez cette ligne
      phoneNumber?: string; // Ajoutez cette ligne
    };
  }
}
