# Aestelier Consentement

Application web sobre et privacy-first pour presenter l'entretien de recherche
Aestelier et generer un formulaire de consentement depuis un template LaTeX fixe.

## Installation

```bash
npm install
npm run dev
```

Le site sera disponible sur `http://localhost:3000`.

## Configuration Supabase

Copier `.env.example` vers `.env.local`, puis renseigner :

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_API_TOKEN=
```

Executer ensuite le schema SQL dans l'editeur SQL Supabase :

```text
supabase/schema.sql
```

La cle `SUPABASE_SERVICE_ROLE_KEY` doit rester uniquement cote serveur. Ne pas
l'exposer dans le navigateur.

## Acces artistes

La page `/admin` permet de :

- entrer le token admin ;
- creer un acces artiste ;
- generer un code unique ;
- copier le lien `/formulaire?code=...` ;
- lister les acces et leurs statuts.

Le formulaire charge le code public, pre-remplit la date et les informations
connues, mais ne pre-coche jamais les consentements.

## Generation PDF

La page `/formulaire` permet de :

- previsualiser le PDF dans une fenetre dediee ;
- compiler un PDF via la route locale `/api/pdf`.

La compilation PDF utilise `pdflatex`, sans `shell-escape`, dans un dossier
temporaire supprime apres generation. Cette route est pensee pour un usage
local ou de deploiement controle. Pour une mise en ligne publique, isoler le
processus LaTeX, limiter les quotas et eviter de journaliser les donnees
personnelles.

## Signature locale

Le responsable est pre-rempli :

- Guillaume Schneider
- contact@guillaumeschneider.fr

Pour ajouter une signature manuscrite locale, placer un fichier ici :

```text
private/signature.png
```

Le dossier `private/` est ignore par Git. Ne jamais publier une vraie signature
manuscrite dans un repo public. Si aucun fichier n'est present, le PDF affiche :
`Signature : Guillaume Schneider`.

## Privacy-first

- Aucun compte.
- Aucun tracking.
- Base Supabase limitee aux acces artistes, statuts et snapshots de
  consentement.
- Aucun PDF stocke par defaut.
- Le template LaTeX est fixe.
- Les champs utilisateur sont echappes avant injection LaTeX.
- Aucune entree LaTeX arbitraire n'est acceptee depuis le formulaire.
- Les fichiers temporaires de compilation sont supprimes apres generation.

## Template

Le template se trouve dans :

```text
templates/aestelier_consentement_court.tex
```

Il utilise des placeholders explicites comme `{{participant_name}}`,
`{{checkbox_participation}}` et `{{responsable_signature}}`.

## Limites juridiques

Ce site aide a produire un document de consentement clair pour des entretiens de
recherche. Il ne remplace pas un avis juridique, une revue RGPD formelle ou un
accompagnement par un professionnel du droit.
