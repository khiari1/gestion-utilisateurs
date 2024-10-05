// pages/index.js

import { useState } from 'react';

export default function Home() {
    const [address, setAddress] = useState('');
    const [result, setResult] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch('/api/validateAddress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address }),
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Erreur lors de la vérification de l'adresse :", error);
        }
    };

    return (
        <div>
            <h1>Vérification de Distance</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Adresse :
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </label>
                <button type="submit">Vérifier</button>
            </form>
            
            {result && (
                <div>
                    {result.isValid
                        ? `L'adresse est située à ${result.distance.toFixed(2)} km de Paris, ce qui est valide.`
                        : `L'adresse est située à ${result.distance.toFixed(2)} km de Paris, ce qui n'est pas valide.`}
                </div>
            )}
        </div>
    );
}
