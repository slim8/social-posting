<?php

namespace App\Http\Traits;

use App\Http\Mail\NotificationMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

trait MailTrait
{
    public static function index(array $content, string $mailto, string $mailsubject = 'Notification Mail', string $template = 'emails.notificationMail')
    {
        try{
            $sendMail = Mail::send(new NotificationMail($content, $mailto, $mailsubject, $template));
            Log::channel('info')->info('A new Email {'.$mailsubject.'} has been send to '.$mailto);
            return $sendMail;
        }
        catch(\Exception $e){
            Log::channel('exception')->error($e->getMessage());
        }

    }

    public static function sendMail(array $content, string $mailto, string $mailsubject = 'Notification Mail', string $template = 'emails.notificationMail')
    {
        try{
            $sendMail = Mail::send(new NotificationMail($content, $mailto, $mailsubject, $template));
            Log::channel('info')->info('A new Email {'.$mailsubject.'} has been send to '.$mailto);
            return $sendMail;
        }
        catch(\Exception $e){
            Log::channel('exception')->error($e->getMessage());
        }

    }
}
