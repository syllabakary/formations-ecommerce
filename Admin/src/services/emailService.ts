interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface PaymentEmailData {
  userName: string;
  userEmail: string;
  formationTitle: string;
  price: number;
  paymentDate: string;
  accessCredentials: {
    username: string;
    password: string;
    loginUrl: string;
  };
}

class EmailService {
  private settings: any;

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    const savedSettings = localStorage.getItem('appSettings');
    this.settings = savedSettings ? JSON.parse(savedSettings) : null;
  }

  private generateAccessCredentials(userEmail: string): { username: string; password: string; loginUrl: string } {
    // Générer des identifiants temporaires
    const username = userEmail;
    const password = this.generateRandomPassword();
    const loginUrl = `${this.settings?.general?.siteUrl || 'https://formationpro.com'}/login`;
    
    return { username, password, loginUrl };
  }

  private generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  private createPaymentConfirmationTemplate(data: PaymentEmailData): EmailTemplate {
    const subject = `Confirmation d'achat - ${data.formationTitle}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #A553C4, #6636DD); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials-box { background: #fff; border: 2px solid #A553C4; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #A553C4, #6636DD); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Félicitations ${data.userName} !</h1>
            <p>Votre achat a été confirmé avec succès</p>
          </div>
          
          <div class="content">
            <h2>Détails de votre achat</h2>
            <p><strong>Formation :</strong> ${data.formationTitle}</p>
            <p><strong>Prix payé :</strong> ${(data.price / 100).toFixed(2)}€</p>
            <p><strong>Date d'achat :</strong> ${new Date(data.paymentDate).toLocaleDateString('fr-FR')}</p>
            
            <div class="credentials-box">
              <h3>🔐 Vos identifiants d'accès</h3>
              <p><strong>Nom d'utilisateur :</strong> ${data.accessCredentials.username}</p>
              <p><strong>Mot de passe :</strong> ${data.accessCredentials.password}</p>
              <p><strong>URL de connexion :</strong> <a href="${data.accessCredentials.loginUrl}">${data.accessCredentials.loginUrl}</a></p>
              
              <a href="${data.accessCredentials.loginUrl}" class="button">🚀 Accéder à ma formation</a>
            </div>
            
            <h3>📚 Prochaines étapes</h3>
            <ol>
              <li>Connectez-vous avec vos identifiants ci-dessus</li>
              <li>Accédez à votre espace personnel</li>
              <li>Commencez votre formation immédiatement</li>
              <li>Suivez votre progression en temps réel</li>
            </ol>
            
            <p><strong>💡 Conseil :</strong> Nous vous recommandons de changer votre mot de passe lors de votre première connexion.</p>
          </div>
          
          <div class="footer">
            <p>Merci de votre confiance ! 🙏</p>
            <p>L'équipe ${this.settings?.general?.siteName || 'FormationPro'}</p>
            <p>📧 ${this.settings?.general?.contactEmail || 'contact@formationpro.com'} | 📞 ${this.settings?.general?.contactPhone || '+33 1 23 45 67 89'}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Félicitations ${data.userName} !

Votre achat a été confirmé avec succès.

Détails de votre achat :
- Formation : ${data.formationTitle}
- Prix payé : ${(data.price / 100).toFixed(2)}€
- Date d'achat : ${new Date(data.paymentDate).toLocaleDateString('fr-FR')}

Vos identifiants d'accès :
- Nom d'utilisateur : ${data.accessCredentials.username}
- Mot de passe : ${data.accessCredentials.password}
- URL de connexion : ${data.accessCredentials.loginUrl}

Prochaines étapes :
1. Connectez-vous avec vos identifiants ci-dessus
2. Accédez à votre espace personnel
3. Commencez votre formation immédiatement
4. Suivez votre progression en temps réel

Conseil : Nous vous recommandons de changer votre mot de passe lors de votre première connexion.

Merci de votre confiance !
L'équipe ${this.settings?.general?.siteName || 'FormationPro'}
    `;

    return { subject, html, text };
  }

  async sendPaymentConfirmation(paymentData: Omit<PaymentEmailData, 'accessCredentials'>): Promise<boolean> {
    try {
      this.loadSettings();
      
      // Générer les identifiants d'accès
      const accessCredentials = this.generateAccessCredentials(paymentData.userEmail);
      
      const emailData: PaymentEmailData = {
        ...paymentData,
        accessCredentials
      };

      // Créer le template d'email
      const emailTemplate = this.createPaymentConfirmationTemplate(emailData);

      // Simuler l'envoi d'email (en production, utiliser un vrai service SMTP)
      console.log('📧 Envoi d\'email de confirmation...');
      console.log('To:', paymentData.userEmail);
      console.log('Subject:', emailTemplate.subject);
      console.log('Credentials generated:', accessCredentials);

      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Sauvegarder les identifiants dans le localStorage pour simulation
      const existingCredentials = JSON.parse(localStorage.getItem('userCredentials') || '[]');
      existingCredentials.push({
        email: paymentData.userEmail,
        credentials: accessCredentials,
        formationTitle: paymentData.formationTitle,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('userCredentials', JSON.stringify(existingCredentials));

      // Ajouter une notification dans le système
      this.addSystemNotification({
        type: 'success',
        title: 'Email envoyé',
        message: `Email de confirmation envoyé à ${paymentData.userEmail}`,
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      
      this.addSystemNotification({
        type: 'error',
        title: 'Erreur d\'envoi',
        message: `Impossible d'envoyer l'email à ${paymentData.userEmail}`,
        timestamp: new Date().toISOString()
      });
      
      return false;
    }
  }

  private addSystemNotification(notification: any) {
    const existingNotifications = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
    existingNotifications.unshift({
      id: Date.now(),
      ...notification
    });
    localStorage.setItem('systemNotifications', JSON.stringify(existingNotifications.slice(0, 50)));
  }

  async testEmailConnection(): Promise<boolean> {
    try {
      this.loadSettings();
      
      if (!this.settings?.email?.smtpHost) {
        throw new Error('Configuration SMTP manquante');
      }

      console.log('🔧 Test de connexion SMTP...');
      console.log('Host:', this.settings.email.smtpHost);
      console.log('Port:', this.settings.email.smtpPort);
      console.log('User:', this.settings.email.smtpUser);

      // Simuler le test de connexion
      await new Promise(resolve => setTimeout(resolve, 3000));

      this.addSystemNotification({
        type: 'success',
        title: 'Test de connexion',
        message: 'Connexion SMTP testée avec succès',
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Erreur de test SMTP:', error);
      
      this.addSystemNotification({
        type: 'error',
        title: 'Test de connexion',
        message: 'Échec du test de connexion SMTP',
        timestamp: new Date().toISOString()
      });
      
      return false;
    }
  }
}

export const emailService = new EmailService();