<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\ProviderTokenController;
class RefreshToken extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'facebook:refresh';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Facebook Refresh Token for Auto Refresh Users';
    protected $providerTokenController;

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->providerTokenController = new ProviderTokenController();
        $this->providerTokenController->refreshTokenJob();
    }
}
