import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    // Vérifiez que l'utilisateur est authentifié
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, firstName, birthDate, address, phoneNumber } = req.body;

    // Mettez à jour les informations de l'utilisateur dans votre base de données ici

    // Exemple fictif : mettez à jour l'utilisateur dans req.user
    req.user.displayName = name;
    req.user.name.givenName = firstName;
    req.user.birthDate = birthDate;
    req.user.address = address;
    req.user.phoneNumber = phoneNumber;

    return res.status(200).json({ message: 'User updated successfully' });
  }

  res.setHeader('Allow', ['PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
