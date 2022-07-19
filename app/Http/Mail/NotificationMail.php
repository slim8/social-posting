<?php

namespace App\Http\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificationMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public $mailData;
    public $mailto;
    public $template;
    public $mailsubject;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(array $content, string $mailto, string $mailsubject, string $template)
    {
        $this->mailData = $content;

        $this->mailto = $mailto;
        $this->template = $template;
        $this->mailsubject = $mailsubject;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view($this->template , $this->mailData)->from(envValue('MAIL_FROM_ADDRESS'))->to($this->mailto)->subject($this->mailsubject);
    }
}
