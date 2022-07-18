<?php

namespace App\Http\Traits;

use App\Http\Mail\NotificationMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

trait MailTrait
{
    public static function index(string $content, string $mailto, string $mailsubject = 'Notification Mail', string $template = 'emails.notificationMail')
    {
        try{
            return Mail::send(new NotificationMail($content, $mailto, $mailsubject, $template));
        }
        catch(\Exception $e){
            Log::channel('exception')->error($e->getMessage());
        }

    }
}
