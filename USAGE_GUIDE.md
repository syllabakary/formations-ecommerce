# Guide pour organiser et utiliser les images dans une application React avec Vite

## 1. Organisation des fichiers d’images

- Placez toutes vos images statiques dans le dossier `public` à la racine du projet.
- Par exemple, créez un dossier `public/assets/logos` pour y mettre vos logos.
- Évitez les espaces et caractères spéciaux dans les noms de dossiers et fichiers.
- Utilisez des noms en minuscules et des tirets pour séparer les mots, par exemple: `logo-ef-3.jpg`.

## 2. Renommage des fichiers

- Renommez les fichiers pour enlever les espaces et caractères spéciaux.
- Exemple: `LOGO EF - 3.jpg` devient `logo-ef-3.jpg`.

## 3. Utilisation des images dans les composants React

### 3.1 Utilisation avec la balise `<img />`

- Pour les images dans le dossier `public`, utilisez un chemin relatif à la racine du site.
- Exemple:

```jsx
<img src="/assets/logos/logo-ef-3.jpg" alt="Logo EF" />
```

### 3.2 Importer les images dans les composants

- Pour importer une image dans un composant React (utile si l’image est dans `src`), faites:

```jsx
import logo from '../assets/logos/logo-ef-3.jpg';

function Component() {
  return <img src={logo} alt="Logo EF" />;
}
```

- Note: Les images dans `public` ne doivent pas être importées, mais référencées par leur chemin.

## 4. Correction du code existant

- Assurez-vous que les chemins dans vos composants correspondent à la structure et aux noms des fichiers.
- Exemple corrigé dans `Navbar.tsx`:

```tsx
<img
  src="/assets/logos/logo-ef-3.jpg"
  alt="Empower Formation"
  className="h-12 w-auto object-contain"
/>
```

## 5. Résolution des erreurs `NS_BINDING_ABORTED`

- Ces erreurs sont souvent dues à des chemins incorrects ou à des noms de fichiers avec espaces ou caractères spéciaux.
- En suivant les bonnes pratiques ci-dessus, vous évitez ces erreurs.

---

En résumé, organisez vos images dans `public/assets`, renommez-les sans espaces, et utilisez des chemins corrects dans vos composants React.
