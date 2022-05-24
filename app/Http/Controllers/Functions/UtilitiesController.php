<?php

namespace App\Http\Controllers\functions;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;

class UtilitiesController extends Controller
{
    public function uploadDistantImage($image)
    {
        $client = new Client();

        $res = $client->request('POST', env('UPLOAD_LOCAL_SERVER_LINK'), [
            'multipart' => [
                [
                    'name' => 'source',
                    'contents' => fopen($image, 'rb'),
                ],
                [
                    'name' => 'key',
                    'contents' => env('UPLOAD_LOCAL_SERVER_KEY'),
                ],
            ],
        ]);

        $response = json_decode($res->getBody());

        return $response->image->file->resource->chain->image;
    }

    public function uploadLocalImage($image)
    {
        $object = $image->store('images/'.date('Y').'/'.date('m').'/'.date('d'));

        return env('APP_URL').'/'.$object;
    }

    public function uploadImage($image)
    {
        if (env('APP_ENV') == 'local') {
            return $this->uploadDistantImage($image);
        } else {
            return $this->uploadLocalImage($image);
        }
    }
}
