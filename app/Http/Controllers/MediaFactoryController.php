<?php

namespace App\Http\Controllers;

use DateTimeImmutable;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Configuration;
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
    private $PRINTFORMER_API = 'https://editor3.mgo-mediafactory.de/api-ext';

    /**
     * user_identifier and draftHash
     */
    private $USER_ID = '9nXcqUGz';
    private $DRAFT_HASH = 'fu6sg2gjkgduwsde5kvdjsovgd0es10y';

    public function  generateToken()
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
            ->identifiedBy(bin2hex(random_bytes(16)), true)
            // ->set('redirect', EDITOR_URL . '/' . $draftHash)
            ->expiresAt($now->modify('+100 hour'))
            ->getToken($config->signer(), $config->signingKey());

        return response()->json(['success' => true, 'token' => $jwt->toString()], 200);
    }
}
