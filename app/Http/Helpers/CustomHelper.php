<?php

use App\Http\Helpers\FunctionHelper;

function envValue($key)
{
    return FunctionHelper::getSystemEnv($key);
}
