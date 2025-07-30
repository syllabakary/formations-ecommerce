import React, { useState } from 'react';
import { Book, Search, ChevronRight, ChevronDown, ExternalLink, Copy, Check, Play, Code, Users, Settings, BarChart3, BookOpen } from 'lucide-react';

const Documentation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const documentationSections = [
    {
      id: 'getting-started',
      title: 'Démarrage Rapide',
      icon: Play,
      items: [
        {
          id: 'introduction',
          title: 'Introduction',
          content: `
# Bienvenue sur FormationPro Admin

FormationPro est une plateforme complète de gestion de formations en ligne. Ce dashboard vous permet de gérer efficacement votre plateforme éducative.

## Fonctionnalités principales

- Gestion des formations : Créez, modifiez et organisez vos cours
- **Gestion des utilisateurs** : Administrez étudiants, instructeurs et admins
- **Statistiques avancées** : Suivez les performances de votre plateforme
- **Système de paiement** : Gérez les transactions et envoyez les accès automatiquement
- **Notifications** : Restez informé des activités importantes

## Navigation

Utilisez la sidebar à gauche pour naviguer entre les différentes sections :
- **Dashboard** : Vue d'ensemble des statistiques
- **Formations** : Gestion des cours
- **Utilisateurs** : Administration des comptes
- **Statistiques** : Analytics détaillées
- **Paramètres** : Configuration de la plateforme
          `
        },
        {
          id: 'first-steps',
          title: 'Premiers Pas',
          content: `
# Premiers Pas avec FormationPro

## 1. Configuration Initiale

Avant de commencer, configurez votre plateforme dans **Paramètres** :

### Informations Générales
- Nom de votre plateforme
- URL du site
- Informations de contact

### Configuration Email
Pour l'envoi automatique des accès aux formations :
\`\`\`
Serveur SMTP : smtp.gmail.com
Port : 587
Authentification : Votre email et mot de passe
\`\`\`

## 2. Créer Votre Première Formation

1. Allez dans **Formations**
2. Cliquez sur **"Nouvelle Formation"**
3. Remplissez les informations :
   - Titre et description
   - Catégorie et niveau
   - Prix et durée
   - Compétences enseignées

## 3. Ajouter des Utilisateurs

1. Accédez à **Utilisateurs**
2. Cliquez sur **"Nouvel Utilisateur"**
3. Définissez le rôle (Étudiant, Instructeur, Admin)
          `
        }
      ]
    },
    {
      id: 'formations',
      title: 'Gestion des Formations',
      icon: BookOpen,
      items: [
        {
          id: 'create-formation',
          title: 'Créer une Formation',
          content: `
# Créer une Formation

## Informations Requises

### Informations de Base
- **Titre** : Nom de votre formation
- **Catégorie** : Design, Développement, Marketing, etc.
- **Niveau** : Débutant, Intermédiaire, Avancé
- **Description** : Présentation détaillée du contenu

### Tarification
- **Prix** : En centimes (ex: 41750 = 417.50€)
- **Prix original** : Pour afficher les promotions
- **Durée** : Temps estimé de formation

### Contenu Pédagogique
- **Nombre de modules** : Structure du cours
- **Compétences** : Ce que les étudiants apprendront
- **Difficulté** : Facile, Moyen, Difficile

## Code Exemple

\`\`\`javascript
const formation = {
  title: "Design UX/UI Moderne",
  category: "Design",
  level: "Débutant",
  price: 41750, // 417.50€
  duration: "28h",
  modules: 9,
  skills: ["Figma", "Prototypage", "Design System"]
};
\`\`\`
          `
        },
        {
          id: 'manage-formations',
          title: 'Gérer les Formations',
          content: `
# Gérer les Formations

## Actions Disponibles

### Modifier une Formation
1. Cliquez sur l'icône **crayon** sur la carte de formation
2. Modifiez les informations nécessaires
3. Sauvegardez les changements

### Supprimer une Formation
1. Cliquez sur l'icône **poubelle**
2. Confirmez la suppression dans le dialog
3. ⚠️ **Attention** : Cette action est irréversible

### Filtrer et Rechercher
- **Barre de recherche** : Recherche par titre ou instructeur
- **Filtre par catégorie** : Design, Développement, Marketing, etc.
- **Statut** : Publié, Brouillon, Archivé

## Statuts des Formations

- **📝 Brouillon** : Formation en cours de création
- **✅ Publié** : Visible et achetable par les utilisateurs
- **📦 Archivé** : Formation retirée de la vente
          `
        }
      ]
    },
    {
      id: 'users',
      title: 'Gestion des Utilisateurs',
      icon: Users,
      items: [
        {
          id: 'user-roles',
          title: 'Rôles et Permissions',
          content: `
# Rôles et Permissions

## Types d'Utilisateurs

### 👨‍🎓 Étudiant
- Accès aux formations achetées
- Suivi de progression
- Évaluations et certificats

### 👨‍🏫 Instructeur
- Création de formations
- Gestion du contenu pédagogique
- Suivi des étudiants

### 👨‍💼 Admin
- Accès complet au dashboard
- Gestion des utilisateurs
- Configuration de la plateforme
- Accès aux statistiques

## Gestion des Comptes

### Créer un Utilisateur
\`\`\`javascript
const user = {
  name: "Marie Dubois",
  email: "marie.dubois@email.com",
  role: "Étudiant",
  status: "Actif"
};
\`\`\`

### Modifier les Permissions
1. Sélectionnez l'utilisateur
2. Changez le rôle si nécessaire
3. Activez/désactivez le compte
          `
        },
        {
          id: 'user-management',
          title: 'Administration des Comptes',
          content: `
# Administration des Comptes

## Actions Administratives

### Suspendre un Compte
- Changez le statut à "Suspendu"
- L'utilisateur ne pourra plus se connecter
- Ses données restent conservées

### Réactiver un Compte
- Changez le statut à "Actif"
- L'utilisateur retrouve l'accès

### Supprimer un Compte
⚠️ **Attention** : Suppression définitive
- Toutes les données utilisateur sont perdues
- Les formations achetées deviennent inaccessibles

## Statistiques Utilisateurs

### Métriques Importantes
- **Utilisateurs actifs** : Connectés récemment
- **Taux d'engagement** : Participation aux formations
- **Progression moyenne** : Avancement dans les cours
          `
        }
      ]
    },
    {
      id: 'payments',
      title: 'Système de Paiement',
      icon: Code,
      items: [
        {
          id: 'payment-process',
          title: 'Processus de Paiement',
          content: `
# Système de Paiement

## Flux de Paiement

### 1. Sélection de Formation
L'utilisateur choisit une formation et clique sur "Acheter"

### 2. Formulaire de Paiement
- Informations personnelles
- Détails de carte bancaire
- Acceptation des conditions

### 3. Traitement Automatique
\`\`\`javascript
// Processus automatisé
const paymentProcess = {
  1: "Validation du paiement",
  2: "Génération des identifiants",
  3: "Envoi de l'email d'accès",
  4: "Mise à jour des statistiques"
};
\`\`\`

### 4. Email Automatique
- **Identifiants de connexion** générés automatiquement
- **Lien d'accès direct** à la formation
- **Instructions** pour commencer

## Configuration Email

Pour que les emails fonctionnent, configurez dans **Paramètres > Email** :
- Serveur SMTP
- Authentification
- Email expéditeur
          `
        }
      ]
    },
    {
      id: 'statistics',
      title: 'Statistiques et Analytics',
      icon: BarChart3,
      items: [
        {
          id: 'dashboard-metrics',
          title: 'Métriques du Dashboard',
          content: `
# Statistiques et Analytics

## Métriques Principales

### 💰 Revenus
- **Revenus du jour** : Ventes de la journée
- **Évolution mensuelle** : Comparaison avec le mois précédent
- **Revenus par formation** : Performance individuelle

### 👥 Utilisateurs
- **Utilisateurs actifs** : Connectés récemment
- **Nouvelles inscriptions** : Croissance de la base utilisateur
- **Taux de rétention** : Fidélité des utilisateurs

### 📚 Formations
- **Formations vendues** : Nombre total d'achats
- **Taux de complétion** : Pourcentage de formations terminées
- **Formations populaires** : Top des meilleures ventes

## Graphiques Interactifs

### Évolution des Revenus
Graphique en barres montrant l'évolution mensuelle

### Inscriptions Utilisateurs
Courbe de croissance des nouveaux utilisateurs

### Performance des Formations
Classement des formations par popularité
          `
        }
      ]
    },
    {
      id: 'settings',
      title: 'Configuration',
      icon: Settings,
      items: [
        {
          id: 'general-settings',
          title: 'Paramètres Généraux',
          content: `
# Configuration de la Plateforme

## Paramètres Généraux

### Informations de Base
- **Nom de la plateforme** : Affiché dans l'interface
- **URL du site** : Adresse de votre plateforme
- **Description** : Présentation de votre service
- **Contact** : Email et téléphone de support

## Notifications

### Types de Notifications
- **Nouvelles inscriptions** : Alert pour chaque nouveau utilisateur
- **Commentaires et avis** : Notifications des retours
- **Paiements** : Alertes de transactions
- **Rapports hebdomadaires** : Résumé des performances

## Sécurité

### Authentification à Deux Facteurs
- **Activation** : Renforce la sécurité des comptes admin
- **Configuration** : Via application mobile

### Paramètres de Mot de Passe
- **Longueur minimale** : 8 caractères recommandés
- **Caractères spéciaux** : Obligatoires pour plus de sécurité
- **Timeout de session** : Déconnexion automatique

## Apparence

### Thèmes
- **Mode clair** : Interface lumineuse
- **Mode sombre** : Interface sombre pour le confort visuel

### Couleurs Personnalisées
- **Primaire** : #A553C4
- **Secondaire** : #6636DD  
- **Accent** : #2D139B
          `
        }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredSections = documentationSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.items.some(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderContent = (content: string, itemId: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentCodeBlock = '';
    let inCodeBlock = false;
    let codeLanguage = '';

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // Fin du bloc de code
          elements.push(
            <div key={`code-${index}`} className="relative bg-gray-900 rounded-lg p-4 my-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 uppercase">{codeLanguage}</span>
                <button
                  onClick={() => copyCode(currentCodeBlock, `${itemId}-${index}`)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-white text-xs"
                >
                  {copiedCode === `${itemId}-${index}` ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copié!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="text-green-400 text-sm overflow-x-auto">
                <code>{currentCodeBlock}</code>
              </pre>
            </div>
          );
          currentCodeBlock = '';
          inCodeBlock = false;
          codeLanguage = '';
        } else {
          // Début du bloc de code
          codeLanguage = line.replace('```', '');
          inCodeBlock = true;
        }
      } else if (inCodeBlock) {
        currentCodeBlock += line + '\n';
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-2xl font-bold text-gray-800 mb-4 mt-6">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-xl font-semibold text-gray-800 mb-3 mt-5">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-lg font-medium text-gray-800 mb-2 mt-4">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="text-gray-600 mb-1 ml-4">
            {line.replace('- ', '')}
          </li>
        );
      } else if (line.includes('**') && line.includes('**')) {
        const parts = line.split('**');
        elements.push(
          <p key={index} className="text-gray-600 mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-800">{part}</strong> : part
            )}
          </p>
        );
      } else if (line.includes('`') && !line.startsWith('```')) {
        const parts = line.split('`');
        elements.push(
          <p key={index} className="text-gray-600 mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? 
                <code key={i} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{part}</code> : 
                part
            )}
          </p>
        );
      } else if (line.trim() !== '') {
        elements.push(
          <p key={index} className="text-gray-600 mb-2">
            {line}
          </p>
        );
      }
    });

    return <div>{elements}</div>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Documentation</h1>
          <p className="text-gray-600">Guide complet d'utilisation de FormationPro Admin</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="https://github.com/formationpro/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-600 hover:text-[#A553C4] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher dans la documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-4">
            <h3 className="font-semibold text-gray-800 mb-4">Sommaire</h3>
            <nav className="space-y-2">
              {filteredSections.map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedSections.includes(section.id);
                
                return (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-[#A553C4]" />
                        <span className="font-medium text-gray-700">{section.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="ml-6 mt-2 space-y-1">
                        {section.items.map((item) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="block p-2 text-sm text-gray-600 hover:text-[#A553C4] hover:bg-gray-50 rounded transition-colors"
                          >
                            {item.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="space-y-8">
            {filteredSections.map((section) => (
              <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <section.icon className="w-6 h-6 text-[#A553C4]" />
                  <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                </div>
                
                <div className="space-y-8">
                  {section.items.map((item) => (
                    <div key={item.id} id={item.id} className="scroll-mt-4">
                      <div className="prose prose-gray max-w-none">
                        {renderContent(item.content, item.id)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-r from-[#A553C4] to-[#6636DD] rounded-2xl p-8 text-white">
        <h3 className="text-xl font-bold mb-4">Liens Utiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="#getting-started" className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <Play className="w-5 h-5" />
            <span>Démarrage Rapide</span>
          </a>
          <a href="#formations" className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <BookOpen className="w-5 h-5" />
            <span>Gestion Formations</span>
          </a>
          <a href="#settings" className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <Settings className="w-5 h-5" />
            <span>Configuration</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Documentation;