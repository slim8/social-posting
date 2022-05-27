<?php

namespace App\Http\Controllers\functions;

use App\Http\Controllers\Controller;
use App\Http\Traits\RequestsTrait;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Storage;

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
        $isInstagramAccountPage = in_array('instagram', $providersName);

        if(!$videos && !$images &&  $isInstagramAccountPage){
            $responseObject->status = false;
            $responseObject->message = 'Can not post to Instagram Without Media';
        }
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

    public function uploadFileToFtp($image , $type)
    {
        $ftpFile = Storage::disk('custom-ftp')->put($type == 'image' ? 'images' : 'others' , $image);
        return env('UPLOAD_FTP_SERVER_PUBLIC_SERVER').$ftpFile;
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
            $fileObject->url = $this->uploadFileToFtp($file , $fileObject->type);
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
