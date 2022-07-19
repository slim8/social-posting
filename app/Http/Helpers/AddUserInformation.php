<?php
namespace App\Http\Helpers;

use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Log\Logger;

class AddUserInformation
{
    protected $request;

    public function __construct(Request $request = null)
    {
        $this->request = $request;
    }

    public function __invoke(Logger $logger)
    {
        if ($this->request) {
            foreach ($logger->getHandlers() as $handler) {
                $handler->pushProcessor([$this, 'processLogRecord']);
            }
        }
    }

    public function processLogRecord(array $record): array
    {
        $record['extra'] += [
            'user' => $this->request->user()->username ?? 'guest',
            'ip' => $this->request->getClientIp()
        ];

        return $record;
    }
}
