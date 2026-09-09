# Pizza Assistant

Wizard qui calcule le protocole, la recette et le planning inversé d'une
session de pizza napolitaine (direct, biga, poolish, levain, pâte
fermentée), puis suit la session en direct avec des rappels par étape.

Un seul code (`www/`) sert deux usages :

- **Site web**, déployable sur un serveur → voir [`DEPLOY.md`](DEPLOY.md).
- **Appli Android**, installable sur ton téléphone → voir [`MOBILE.md`](MOBILE.md).

## Structure du projet

```
www/                 le code de l'appli — c'est ici qu'on modifie
  index.html
  app.js             wizard + moteur de calcul (pâte, planning, recommandations)
  notify.js          notifications : natif (Android) ou navigateur (web), au choix automatique
  style.css          design system "Modernist" (Archivo, rouge/monochrome)
  manifest.json      pour l'installer comme appli depuis un navigateur (PWA)
  icons/

android/             projet Android généré par Capacitor (voir MOBILE.md)
assets/              images sources de l'icône et du splash screen
Dockerfile, nginx.conf, docker-compose.yml   déploiement serveur (voir DEPLOY.md)
capacitor.config.ts  configuration Capacitor (nom, id d'appli, notifications)
```

## Modifier l'appli

Tout le contenu et la logique sont dans `www/`. Après une modification :

- **Web** : redéploie (voir DEPLOY.md) — rien d'autre à faire.
- **Android** : `npm run sync` puis rebuild dans Android Studio (voir MOBILE.md).

## Notes de conception

- Le moteur de calcul (méthodes de pâte, hydratation, levure, planning) est
  porté depuis le prototype de design fourni, formule pour formule.
- Rayon des cartes/boutons à 6px (comme le prototype) — variable CSS unique
  `--radius` dans `style.css` si tu veux repasser à 0px (Modernist strict).
- Les sessions et les réglages en cours sont sauvegardés en local
  (`localStorage` / stockage de l'appli) — rien n'est envoyé à un serveur.
