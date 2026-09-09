# Installer Pizza Assistant sur ton téléphone Android

Le projet Android est déjà généré (dossier `android/`), avec l'icône, l'écran
de démarrage et les notifications natives déjà branchés. Il ne reste qu'à le
compiler — ça se fait avec Android Studio, gratuit, sur ton PC Windows.

Il n'y a pas besoin de compte développeur ni de Play Store pour installer
l'appli sur ton propre téléphone : c'est ce qu'on appelle du "sideload".

## 1. Installer Android Studio

Télécharge et installe [Android Studio](https://developer.android.com/studio)
(gratuit). Au premier lancement, laisse l'assistant télécharger le SDK
Android par défaut — c'est automatique, compte 10-15 minutes selon ta
connexion.

## 2. Ouvrir le projet

Dans Android Studio : **File → Open**, puis sélectionne le dossier
`pizza-assistant-app/android`. Laisse Gradle synchroniser (barre de
progression en bas — première fois, ça télécharge des dépendances, ça peut
prendre quelques minutes).

## 3. Installer directement sur ton téléphone (le plus simple)

1. Sur ton téléphone : Réglages → À propos du téléphone → tape 7 fois sur
   "Numéro de build" pour activer le **mode développeur**, puis Réglages →
   Options pour développeurs → active **Débogage USB**.
2. Branche le téléphone en USB à ton PC. Autorise le débogage si une
   pop-up apparaît sur le téléphone.
3. Dans Android Studio, ton téléphone apparaît dans la liste des appareils
   en haut (à côté du bouton ▶ vert). Sélectionne-le, clique sur ▶ **Run**.

L'appli s'installe et se lance directement sur ton téléphone. C'est la
méthode à privilégier tant que tu retouches l'appli.

## 4. Ou : générer un fichier APK à transférer toi-même

Si tu préfères récupérer un fichier `.apk` (pour l'envoyer par
email/Drive/USB et l'installer sans câble) :

**Build → Build App Bundle(s) / APK(s) → Build APK(s)**.

Une fois terminé, un lien "locate" apparaît (ou regarde dans
`android/app/build/outputs/apk/debug/app-debug.apk`). Transfère ce fichier
sur ton téléphone et ouvre-le pour l'installer — Android demandera
d'autoriser "l'installation depuis une source inconnue" la première fois,
c'est normal pour une appli hors Play Store.

## Les notifications d'étape, sur l'appli native

C'est le vrai gain par rapport à la version web : les alertes de chaque
étape (pétrissage, sortie du frigo, préchauffage…) sont programmées via les
notifications locales d'Android, donc elles se déclenchent même si l'appli
est fermée ou le téléphone verrouillé — contrairement à la version
web/navigateur, qui a besoin que l'onglet reste ouvert.

Au premier lancement de la session ("Lancer ma session pizza"), Android
demande l'autorisation d'envoyer des notifications — accepte-la.

## Après une modification de l'appli (www/)

Le code de l'appli (le wizard, le moteur de calcul) vit dans `www/`, partagé
entre la version web et l'appli Android. Après avoir modifié `www/app.js`,
`www/style.css`, etc., resynchronise le projet Android avant de rebuilder :

```bash
npm install     # une seule fois
npm run sync    # à chaque modification de www/
```

Puis rouvre/relance depuis Android Studio (étape 3).

## Changer l'icône ou l'écran de démarrage

Les sources sont dans `assets/` (`icon.png`, `icon-foreground.png`,
`icon-background.png`, `splash.png`). Remplace ces fichiers puis régénère
tout avec :

```bash
npx capacitor-assets generate --android
```

## Plus tard : publier sur le Play Store

Ce projet n'est pas encore préparé pour la publication (pas de clé de
signature de release, pas de fiche store). Si tu veux y aller un jour,
dis-le-moi — il faudra un compte développeur Google Play (25 $, une fois)
et je préparerai la signature et les visuels de fiche store.
