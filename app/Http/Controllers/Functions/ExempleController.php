<?php

namespace App\Http\Controllers\functions;

use App\Http\Controllers\Controller;
use App\Http\Traits\MailTrait;
use App\Models\Plan;
use App\Models\User;
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

    public function uploadfile(Request $request)
    {
        $response = $request->file('file') ? $this->utilitiesController->uploadFile($request->file('file')) : false;

        return response()->json(['success' => $response ? true : false,
        'files' => $response, ], 201);
    }
}
