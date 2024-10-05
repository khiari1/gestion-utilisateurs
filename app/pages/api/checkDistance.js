// pages/api/validateAddress.js

import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { address } = req.body;
    const parisLat = 48.8566;
    const parisLon = 2.3522;
    const distanceLimit = 50; // en km

    try {
        // Appel à l'API adresse.data.gouv.fr pour géocoder l'adresse de l'utilisateur
        const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`);
        
        if (response.data.features.length === 0) {
            return res.status(404).json({ error: "Adresse introuvable" });
        }

        const userCoords = response.data.features[0].geometry.coordinates;
        const userLon = userCoords[0];
        const userLat = userCoords[1];

        // Calcul de la distance entre l'adresse de l'utilisateur et Paris
        const distance = haversine(userLat, userLon, parisLat, parisLon);

        // Validation de la distance
        if (distance <= distanceLimit) {
            res.status(200).json({ isValid: true, distance });
        } else {
            res.status(200).json({ isValid: false, distance });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'appel à l'API d'adresse" });
    }
}

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c; // Retourne la distance en km
}
