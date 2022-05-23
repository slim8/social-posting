<?php

namespace App\Http\Controllers\functions;

use App\Http\Controllers\Controller;
use App\Http\Traits\MailTrait;
use Illuminate\Http\Request;

class ExempleController extends Controller
{
    use MailTrait;

    protected $utilitiesController;

    public function __construct()
    {
        $this->utilitiesController = new UtilitiesController();
    }

    public function sendmail()
    {
        MailTrait::index('This is an mail exemple', 'zied.maaloul@softtodo.com', 'Subject Exemple');
    }

    public function uploadimage(Request $request)
    {
        $response = [];
        foreach ($request->file('sources') as $image) {
            $response[] = $this->utilitiesController->uploadImage($image);
        }

        return $response;
    }
}
