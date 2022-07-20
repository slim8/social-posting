<?php

namespace App\Http\Controllers;

use App\Http\Traits\MailTrait;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;

class TraitController extends Controller
{
    use UserTrait;
    use MailTrait;
    use RequestsTrait;
}
