<?php

namespace App\Http\Controllers\functions;

use App\Http\Controllers\Controller;
use App\Http\Traits\RequestsTrait;
use GuzzleHttp\Client;

class UtilitiesController extends Controller
{
    use RequestsTrait;

    public function postValidator($accountIds, $images, $videos)
    {
        $providersType = [];
        $providersName = [];
        $responseObject = new \stdClass();

        foreach ($accountIds as $singleAccountId) {
            $account = RequestsTrait::findAccountByUid($singleAccountId, 'id');

            array_push($providersType, $account->providerType);
            array_push($providersName, $account->provider);
        }
        $responseObject->status = true;
        $isFacebookPage = (in_array('facebook', $providersName)) && (in_array('page', $providersType));

        if ($videos && count($videos) > 1 && $isFacebookPage) {
            $responseObject->status = false;
            $responseObject->message = 'Can not upload more than one video on Facebook';
        }

        if ($videos && count($videos) > 0 && $images && count($images) && $isFacebookPage) {
            $responseObject->status = false;
            $responseObject->message = 'Can not upload video and images on the same post on Facebook';
        }


        return $responseObject;
    }

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
     * Return the Type Of the Uploaded File.
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
