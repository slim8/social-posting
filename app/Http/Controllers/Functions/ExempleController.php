<?php

namespace App\Http\Controllers\functions;

use App\Http\Controllers\Controller;
use App\Http\Traits\MailTrait;

class ExempleController extends Controller
{
    use MailTrait;

    public function sendmail()
    {
        MailTrait::index('This is an mail exemple', 'zied.maaloul@softtodo.com', 'Subject Exemple');
    }
}
