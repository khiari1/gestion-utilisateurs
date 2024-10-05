import React from 'react';
import { GetServerSidePropsContext } from 'next';

interface User {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string; // Ajoutez les nouveaux champs
  address: string;
  phoneNumber: string;
}

const HomePage = ({ user }: { user: User | null }) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Bienvenue, {user.name} !</h1>
      <p>Email: {user.email}</p>
      <p>Prénom: {user.firstName}</p>
      <p>Nom: {user.lastName}</p>
      <p>Date de naissance: {user.birthDate}</p>
      <p>Adresse: {user.address}</p>
      <p>Numéro de téléphone: {user.phoneNumber}</p>
      <a href="/auth/logout">Se déconnecter</a>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;

  if (req.isAuthenticated()) {
    const user = {
      name: req.user.displayName,
      email: req.user.emails[0].value,
      firstName: req.user.name.givenName,
      lastName: req.user.name.familyName,
      birthDate: req.user.birthDate || '',
      address: req.user.address || '',
      phoneNumber: req.user.phoneNumber || '',
    };
    return { props: { user } };
  }

  return { props: { user: null } };
}

export default HomePage;
