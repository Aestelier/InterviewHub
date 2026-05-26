# Aestelier Consentement

Application web sobre et privacy-first pour presenter l'entretien de recherche
Aestelier et generer un formulaire de consentement depuis un template LaTeX fixe.

## Installation

```bash
npm install
npm run dev
```

Le site sera disponible sur `http://localhost:3000`.

## Generation PDF

La page `/formulaire` permet de :

- previsualiser le fichier `.tex` genere ;
- telecharger le `.tex` ;
- compiler un PDF via la route locale `/api/pdf`.

La compilation PDF utilise `pdflatex`, sans `shell-escape`, dans un dossier
temporaire supprime apres generation. Cette route est pensee pour un usage
local ou de developpement. Pour une mise en ligne publique, eviter d'exposer une
compilation LaTeX serveur sans isolation forte, quotas, journalisation de
securite et revue dediee.

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
- Aucune base de donnees.
- Aucune donnee utilisateur stockee cote serveur.
- Aucune donnee envoyee a un service tiers.
- Le template LaTeX est fixe.
- Les champs utilisateur sont echappes avant injection LaTeX.
- Aucune entree LaTeX arbitraire n'est acceptee depuis le formulaire.

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
