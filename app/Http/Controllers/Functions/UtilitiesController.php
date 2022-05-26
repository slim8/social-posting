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

    public function uploadLocalImage($file, $type)
    {
        $object = $file->store($type.'s/'.date('Y').'/'.date('m').'/'.date('d'));

        return env('APP_URL').'/'.$object;
    }

    public function uploadFile($file)
    {
        $fileObject = new \stdClass();
        $fileObject->type = $this->checkTypeOfFile($file);
        if (env('APP_ENV') == 'local') {
            if ($fileObject->type == 'image') {
                $fileObject->url = $this->uploadDistantImage($file);
            } else {
              //  dd('could not be uploaded');
                $fileObject->url = false;
            }
        } else {
            $fileObject->url = $this->uploadLocal($file, $fileObject->type);
        }

        return $fileObject;
    }

    /**
     * Return the Type Of the Uploaded File
     */
    public function checkTypeOfFile($file)
    {
        $mimes = 'video/x-ms-asf,video/x-flv,video/mp4,application/x-mpegURL,video/MP2T,video/3gpp,video/quicktime,video/x-msvideo,video/x-ms-wmv,video/avi';
        $mimes = explode(',', $mimes);
        $type = 'image';

        if (in_array($file->getMimeType(), $mimes)) {
            $type = 'video';
        }

        return $type;
    }
}
