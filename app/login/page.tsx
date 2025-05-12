// Côté App Maître: LoginPage component
'use client';
import { useState, useEffect } from 'react'; // Import useEffect
import { signInWithEmailAndPassword } from 'firebase/auth';
import { clientAuth as auth } from '@firebase/client'; // Assurez-vous que ce chemin est correct pour l'app maître
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams(); // Pour lire les query params
  const [targetCallbackUrl, setTargetCallbackUrl] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer le callbackUrl une seule fois au montage
    const callbackUrl = searchParams.get('callbackUrl');
    if (callbackUrl) {
      setTargetCallbackUrl(decodeURIComponent(callbackUrl));
    } else {
      // Fallback si aucun callbackUrl n'est fourni (par exemple, accès direct à la page de login de l'app maître)
      // Vous pourriez rediriger vers une page par défaut de l'app maître ou l'URL de l'app cliente
      setTargetCallbackUrl('https://code-builder-git-massrework-souphianejs-projects.vercel.app'); // Ou une autre URL par défaut
    }
  }, [searchParams]);

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCred.user.getIdToken();
      
      // Appel à l'API de l'app maître pour créer le cookie de session pour l'app maître
      const sessionResponse = await fetch('/api/session/login', { // Assurez-vous que c'est l'API de l'app maître
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      if (!sessionResponse.ok) {
        // Gérer l'échec de la création du cookie de session
        console.error("Failed to create session cookie on master app");
        // Afficher une erreur à l'utilisateur
        return;
      }

      // Rediriger vers le callbackUrl (qui est l'URL de l'app cliente)
      // Le cookie de session pour l'app cliente sera défini par l'app cliente elle-même
      // après avoir vérifié le token via une API.
      if (targetCallbackUrl) {
        // IMPORTANT: L'app maître redirige vers l'app cliente.
        // L'app cliente devra alors vérifier l'état de connexion (par exemple, via un token dans l'URL ou en appelant une API de l'app maître)
        // et créer son propre cookie de session.
        // Pour l'instant, on redirige simplement.
        // Une meilleure approche serait que l'app maître redirige vers une route spécifique de l'app cliente
        // qui gère la création du cookie de session de l'app cliente.
        
        // Pour que le middleware de l'app cliente fonctionne, il faut que l'app cliente
        // ait un moyen de savoir que l'utilisateur EST connecté via l'app maître.
        // L'app maître pourrait rediriger vers l'app cliente avec le idToken dans l'URL,
        // par exemple: `${targetCallbackUrl}?idToken=${idToken}`
        // L'app cliente lirait ce token, le validerait et créerait son propre cookie.

        // Solution simplifiée pour l'instant (peut encore causer des problèmes si le cookie n'est pas inter-domaines):
        // Si le cookie de session de l'app maître est défini pour le domaine parent (si applicable)
        // et que l'app cliente est un sous-domaine, cela pourrait fonctionner.
        // Sinon, il faut un mécanisme de transfert de l'état de session.

        // Pour l'instant, on suppose que le cookie de l'app maître est accessible par l'app cliente
        // OU que l'app cliente a un autre moyen de vérifier la session.
        // La redirection actuelle est:
        window.location.href = targetCallbackUrl; // Redirige vers l'URL d'origine de l'app cliente
      } else {
        console.error("Target callback URL is not set.");
        // Gérer le cas où targetCallbackUrl n'est pas défini
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Afficher une erreur de connexion à l'utilisateur
    }
  };

  return (
    <div>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin} disabled={!targetCallbackUrl}>Connexion</button>
      {!targetCallbackUrl && <p>Chargement de la configuration de redirection...</p>}
    </div>
  );
}