<?php

require str_replace('public', '', realpath('.')).'/vendor/autoload.php';

use Dotenv\Dotenv;

function envValue($key , $default = null)
{
    $dotenv = Dotenv::createImmutable(str_replace('public', '', realpath('.')));
    $dotenv->load();

    if (isset($_ENV[$key])) {
        return $_ENV[$key];
    } else {
        if (!$default){
            return null;
        }

        return $default;
    }
}
