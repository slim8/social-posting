<?php

namespace App\Http\Controllers;

use DateTimeImmutable;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;

class MediaFactoryController extends Controller
{

    // TODO: change this fields in .env if they will be static or make then dynamic from request of database
    /**
     * Client Data
     */
    private $CLIENT_API_KEY = 'eoHnZOcStKp0qsyuhTop0ZuMza399b3A';
    private $CLIENT_IDENTIFIER = 'mfPUk0k0';

    /**
     * The printformer Base - API URL
     */
    private $PRINTFORMER_API = 'https://editor3.mgo-mediafactory.de/api-ext/editor';

    /**
     * user_identifier and draftHash
     */
    private $USER_ID = 'yAwoVERt'; // 9nXcqUGz 7bvIiKT9 yAwoVERt
    private $DRAFT_HASH = '2neacqmsgyyapsfkpflbxbt44puhjdap'; // 'dmddqwg4cxdiypqdjvy3nxhslwn1qrsj';
    private $API_KEY = 'eoHnZOcStKp0qsyuhTop0ZuMza399b3A';

    public function generateToken()
    {
        $config = Configuration::forSymmetricSigner(new Sha256(), InMemory::plainText($this->CLIENT_API_KEY));
        $now = new DateTimeImmutable();
        /**
         * Create a valid JWT
         */
        $jwt = $config->builder()
            ->issuedAt($now)
            ->withClaim('client', $this->CLIENT_IDENTIFIER)
            ->withClaim('user', $this->USER_ID)
            ->withClaim('redirect', $this->PRINTFORMER_API . '/' . $this->DRAFT_HASH)
        //->withClaim('jti', 'ANVS6545F7IBCDEK')
            ->identifiedBy(bin2hex(random_bytes(16)), true)
            ->expiresAt($now->modify('+100 hour'))
            ->getToken($config->signer(), $config->signingKey());

        return response()->json(['success' => true, 'token' => $jwt->toString()], 200);
    }
}
