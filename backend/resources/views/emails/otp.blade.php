<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de vérification OTP</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            padding: 20px;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 40px 20px;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        
        .content h2 {
            color: #1a202c;
            font-size: 24px;
            margin-bottom: 20px;
        }
        
        .content p {
            color: #4a5568;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        
        .otp-container {
            background: #f7fafc;
            border: 2px dashed #cbd5e0;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        
        .otp-label {
            font-size: 14px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            font-family: 'Courier New', monospace;
            letter-spacing: 8px;
            display: block;
        }
        
        .warning {
            background: #fed7d7;
            color: #9b2c2c;
            padding: 15px;
            border-radius: 8px;
            font-size: 14px;
            margin: 20px 0;
        }
        
        .footer {
            background: #edf2f7;
            padding: 30px;
            text-align: center;
            color: #718096;
            font-size: 14px;
        }
        
        .footer p {
            margin-bottom: 10px;
        }
        
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        
        .security-tips {
            background: #e6fffa;
            border-left: 4px solid #38b2ac;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .security-tips h3 {
            color: #285e61;
            font-size: 16px;
            margin-bottom: 10px;
        }
        
        .security-tips ul {
            text-align: left;
            color: #2d3748;
            font-size: 14px;
            padding-left: 20px;
        }
        
        .security-tips li {
            margin-bottom: 5px;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .header {
                padding: 30px 15px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .otp-code {
                font-size: 28px;
                letter-spacing: 4px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- En-tête -->
        <div class="header">
            <h1>🔐 Code de Vérification</h1>
            <p>{{ $appName ?? 'Notre Application' }}</p>
        </div>
        
        <!-- Contenu principal -->
        <div class="content">
            <h2>Vérifiez votre compte</h2>
            <p>Nous avons reçu une demande de vérification pour votre compte. Utilisez le code ci-dessous pour continuer :</p>
            
            <!-- Code OTP -->
            <div class="otp-container">
                <div class="otp-label">Votre code de vérification</div>
                <span class="otp-code">{{ $otpCode }}</span>
            </div>
            
            <!-- Avertissement -->
            <div class="warning">
                <strong>⏰ Important :</strong> Ce code expire dans 15 minutes pour votre sécurité.
            </div>
            
            <!-- Conseils de sécurité -->
            <div class="security-tips">
                <h3>🛡️ Conseils de sécurité</h3>
                <ul>
                    <li>Ne partagez jamais ce code avec personne</li>
                    <li>Notre équipe ne vous demandera jamais ce code par téléphone</li>
                    <li>Si vous n'avez pas demandé ce code, ignorez cet email</li>
                    <li>Utilisez ce code uniquement sur notre site officiel</li>
                </ul>
            </div>
            
            <p>Si vous rencontrez des difficultés, n'hésitez pas à nous contacter.</p>
        </div>
        
        <!-- Pied de page -->
        <div class="footer">
            <p><strong>{{ $appName ?? 'Notre Application' }}</strong></p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas répondre.</p>
            <p>© {{ date('Y') }} {{ $appName ?? 'Notre Application' }}. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>