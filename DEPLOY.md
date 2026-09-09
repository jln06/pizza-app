# Déployer Pizza Assistant sur un serveur

L'appli est 100 % statique : pas de backend, pas de base de données. Tout
tourne dans le navigateur (le moteur de calcul en JS, les sessions dans
`localStorage`). Il suffit donc de servir le contenu du dossier `www/`.

Trois façons de le faire, du plus proche de ton setup actuel au plus simple.

## Option A — Docker (self-host, ex. ton serveur maison)

C'est le chemin recommandé si tu veux la garder chez toi, à côté de tes
autres services Docker.

```bash
cd pizza-assistant-app
docker compose up -d --build
```

L'appli est alors sur `http://<ton-serveur>:8090`. Le port se change dans
`docker-compose.yml` (`"8090:80"`).

Pour la mettre derrière un nom de domaine / HTTPS, passe-la derrière ton
reverse proxy habituel (nginx-proxy, Traefik, Caddy…) en pointant vers le
port interne `80` du conteneur — rien de spécifique à cette appli, c'est un
site statique comme un autre.

Pour mettre à jour après une modification :
```bash
docker compose up -d --build
```

## Option B — Hébergement statique gratuit (Netlify / Vercel / GitHub Pages)

Aucun serveur à gérer. Sur Netlify ou Vercel : dépose (ou connecte le repo
et pointe) le dossier `www/` comme racine de publication — il n'y a pas de
build, "Build command" reste vide et "Publish directory" = `www`.

Sur GitHub Pages : pousse le contenu de `www/` sur la branche `gh-pages`
(ou active Pages sur le dossier `www/` de la branche principale).

## Option C — nginx "à la main" / n'importe quel serveur de fichiers statiques

Copie le contenu de `www/` là où ton serveur web sert ses fichiers
(ex. `/var/www/pizza-assistant/`), et utilise `nginx.conf` comme modèle de
configuration (ou adapte-le à Apache/Caddy — c'est juste un `try_files`
classique en SPA).

## Après un changement dans www/

Si tu modifies `www/app.js`, `www/style.css`, etc., pense aussi à
resynchroniser l'appli Android (voir `MOBILE.md`) :
```bash
npm run sync
```
