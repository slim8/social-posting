<?php

require str_replace('public', '', realpath('.')).'/vendor/autoload.php';

use Dotenv\Dotenv;
use Symfony\Component\VarDumper\VarDumper;

function envValue($key, $default = null)
{
    $dotenv = Dotenv::createImmutable(str_replace('public', '', realpath('.')));
    $dotenv->load();

    if (isset($_ENV[$key])) {
        return $_ENV[$key];
    } else {
        if (!$default) {
            return null;
        }

        return $default;
    }
}

/**
 * Add Debug FUnction Symfony
 */

if (!function_exists('d')) {
    function d(...$vars): void
    {
        if (!in_array(\PHP_SAPI, ['cli', 'phpdbg'], true) && !headers_sent()) {
            header('HTTP/1.1 500 Internal Server Error');
        }

        foreach ($vars as $v) {
            VarDumper::dump($v);
        }
    }
}

/**
 * Debug Only Function.
 */
function debugOnly(...$vars)
{
    if (!in_array(\PHP_SAPI, ['cli', 'phpdbg'], true) && !headers_sent()) {
        header('HTTP/1.1 500 Internal Server Error');
    }

    foreach ($vars as $v) {
        echo '<pre>';
        var_dump($v);
        echo '</pre>';
    }
}

/**
 * Debug Function.
 */
function debug(...$vars): void
{
    debugOnly($vars);
}

/**
 * Debug And Die Function.
 */
function debugAndDie(...$vars): void
{
    debugOnly($vars);
    exit;
}


/**
 * greatest common divisor
 */

function gcd ($a, $b) {
    return $b ? gcd($b, $a % $b) : $a;
}
