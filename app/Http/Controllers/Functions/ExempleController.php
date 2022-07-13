<?php

namespace App\Http\Controllers\Functions;

use App\Http\Controllers\Controller;
use App\Http\Traits\MailTrait;
use App\Http\Traits\RequestsTrait;

class ExempleController extends Controller
{
    use MailTrait;
    use RequestsTrait;

    protected $utilitiesController;

    public function __construct()
    {
        $this->utilitiesController = new UtilitiesController();
    }

    public function sendmail()
    {
        MailTrait::index('This is an mail exemple', 'zied.maaloul@softtodo.com', 'Subject Exemple');
    }
}
