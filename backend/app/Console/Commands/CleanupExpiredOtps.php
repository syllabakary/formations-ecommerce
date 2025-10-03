<?php

namespace App\Console\Commands;

use App\Models\Otp;
use Illuminate\Console\Command;
use Carbon\Carbon;

class CleanupExpiredOtps extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'otp:cleanup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Nettoie les codes OTP expirés de la base de données';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🧹 Nettoyage des codes OTP expirés...');

        // Compter les OTP expirés
        $expiredCount = Otp::where('expires_at', '<', Carbon::now())->count();

        if ($expiredCount === 0) {
            $this->info('✨ Aucun code OTP expiré à nettoyer.');
            return self::SUCCESS;
        }

        // Supprimer les OTP expirés
        $deletedCount = Otp::where('expires_at', '<', Carbon::now())->delete();

        $this->info("🗑️  {$deletedCount} codes OTP expirés ont été supprimés.");
        
        // Afficher les statistiques
        $remainingCount = Otp::count();
        $this->info("📊 Codes OTP restants en base : {$remainingCount}");

        return self::SUCCESS;
    }
}