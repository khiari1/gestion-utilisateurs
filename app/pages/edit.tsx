import React, { useState } from 'react';
import { GetServerSidePropsContext } from 'next';

interface User {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string; // Ajoutez d'autres champs selon vos besoins
  address: string;
  phoneNumber: string;
}

const EditPage = ({ user }: { user: User | null }) => {
  const [formData, setFormData] = useState<User>(user as User);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Envoyer les données modifiées à votre API ou serveur
    await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Redirection ou affichage d'un message de succès
    alert('Informations mises à jour avec succès!');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Modifier vos informations</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nom:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Prénom:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
        </label>
        <label>
          Date de naissance:
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
        </label>
        <label>
          Adresse:
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </label>
        <label>
          Numéro de téléphone:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </label>
        <button type="submit">Enregistrer les modifications</button>
      </form>
    </div>
  );
};
interface AuthUser {
    displayName: string;
    emails: { value: string }[];
    name: { givenName: string; familyName: string };
    birthDate?: string; // Propriétés optionnelles
    address?: string;
    phoneNumber?: string;
  }
  
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req } = context;
  
    if (req.isAuthenticated()) {
      const user = req.user as AuthUser; // Cast du type
  
      const userData: User = {
        name: user.displayName,
        email: user.emails[0].value,
        firstName: user.name.givenName,
        lastName: user.name.familyName,
        birthDate: user.birthDate || '', // Assurez-vous d'utiliser une valeur par défaut
        address: user.address || '',
        phoneNumber: user.phoneNumber || '',
      };
      return { props: { user: userData } };
    }
  
    return { props: { user: null } };
  }
  

export default EditPage;
