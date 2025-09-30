<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Otp;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur
     */
    public function register(Request $request): JsonResponse
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|unique:users,email',
                'phone' => 'required|string|unique:users,phone',
                'password' => 'required|string|min:6',
                'name' => 'nullable|string|max:255'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Générer un OTP aléatoire
            $otp = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);

            // Créer l'utilisateur (non vérifié)
            $user = User::create([
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'name' => $request->name ?? '',
                'email_verified_at' => null, // Non vérifié par défaut
                'otp' => $otp,
                'otp_expires_at' => Carbon::now()->addMinutes(10), // Valable 10 min
                'is_verified' => false
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur créé. Veuillez saisir l\'OTP',
                'user_id' => $user->id,
                'otp' => $otp // Affiché pour dev/test
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'inscription: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Connexion d'un utilisateur
     */
    public function login(Request $request): JsonResponse
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email et mot de passe requis',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Vérifier les identifiants
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Identifiants incorrects'
                ], 401);
            }

            // Vérifier si l'email est vérifié
            if (!$user->email_verified_at) {
                // Renvoyer un OTP pour la vérification
                $otpCode = $this->generateOtp($user->email);
                $this->sendOtpEmail($user->email, $otpCode);

                return response()->json([
                    'success' => false,
                    'message' => 'Votre compte n\'est pas vérifié. Un code OTP a été envoyé à votre email.',
                    'requires_verification' => true,
                    'user_id' => $user->id,
                    'otp' => $otpCode // Pour dev/test uniquement
                ], 403);
            }

            // Générer le token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'name' => $user->name
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la connexion: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vérification du code OTP
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|integer',
                'otp' => 'required|string|size:6'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User ID et code OTP requis',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Vérifier l'utilisateur
            $user = User::find($request->user_id);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur introuvable'
                ], 404);
            }

            // Vérifier l'OTP
            if ($user->otp !== $request->otp) {
                return response()->json([
                    'success' => false,
                    'message' => 'OTP incorrect'
                ], 400);
            }

            if ($user->otp_expires_at < Carbon::now()) {
                return response()->json([
                    'success' => false,
                    'message' => 'OTP expiré'
                ], 400);
            }

            // OTP correct → activer l'utilisateur
            $user->is_verified = true;
            $user->otp = null;
            $user->otp_expires_at = null;
            $user->email_verified_at = Carbon::now();
            $user->save();

            // Générer le token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Compte vérifié avec succès',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'name' => $user->name
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Renvoyer un code OTP
     */
    public function resendOtp(Request $request): JsonResponse
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'email' => 'required|email'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email requis',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Vérifier l'utilisateur
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non trouvé'
                ], 404);
            }

            // Supprimer les anciens OTP
            Otp::where('email', $request->email)->delete();

            // Générer et envoyer un nouveau OTP
            $otpCode = $this->generateOtp($request->email);
            $this->sendOtpEmail($request->email, $otpCode);

            return response()->json([
                'success' => true,
                'message' => 'Nouveau code OTP envoyé avec succès'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Déconnexion
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Déconnexion réussie'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la déconnexion: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Informations de l'utilisateur connecté
     */
    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ], 200);
    }

    /**
     * Générer un code OTP
     */
    private function generateOtp(string $email): string
    {
        // Supprimer les anciens OTP
        Otp::where('email', $email)->delete();

        // Générer un code à 6 chiffres
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Stocker l'OTP en base (expire dans 15 minutes)
        Otp::create([
            'email' => $email,
            'code' => $code,
            'expires_at' => Carbon::now()->addMinutes(15)
        ]);

        return $code;
    }

    /**
     * Envoyer l'OTP par email
     */
    private function sendOtpEmail(string $email, string $code): void
    {
        try {
            Mail::to($email)->send(new OtpMail($code));
        } catch (\Exception $e) {
            // Log l'erreur mais ne pas faire échouer la requête
            \Log::error('Erreur envoi email OTP: ' . $e->getMessage());
        }
    }
}