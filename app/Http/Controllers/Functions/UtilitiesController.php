<?php

namespace App\Http\Controllers\functions;

use App\Http\Controllers\Controller;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Image;
use Intervention\Image\ImageManager;

class UtilitiesController extends Controller
{
    use RequestsTrait;
    use UserTrait;
    protected $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager();
    }

    /**
     * Validate Post (check if Eg Post without media to instagram Or Video + Images on se same post to facebook page).
     */
    public function postValidator($accountIds, $images, $videos)
    {
        $providersType = [];
        $providersName = [];
        $responseObject = new \stdClass();

        foreach ($accountIds as $singleAccountId) {
            $account = RequestsTrait::findAccountByUid($singleAccountId, 'id', 1);
            if ($account) {
                array_push($providersType, $account->providerType);
                array_push($providersName, $account->provider);
            } else {
                $responseObject->status = false;
                $responseObject->message = 'Can not post with disconnected account';
            }
        }
        $responseObject->status = true;
        $isFacebookPage = (in_array('facebook', $providersName)) && (in_array('page', $providersType));
        $isInstagramAccountPage = in_array('instagram', $providersName);

        if (!$videos && !$images && $isInstagramAccountPage) {
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

    /**
     * Convert Image To Jpeg.
     */
    public function convertToJpeg($image)
    {
        $object = $image->store('temporar'.'s/'.date('Y').'/'.date('m').'/'.date('d'));

        $object = storage_path().'/app/public/'.$object;
        $exploded = explode('/', $object);
        $fileName = $exploded[count($exploded) - 1];
        $newFileName = explode('.', $fileName)[0];
        $newFile = storage_path().'/app/public/temporarStored/'.$newFileName.'.jpeg';
        $this->imageManager->make($object)->encode('jpg', 80)->save($newFile);

        unlink($object);

        return $newFile;
    }

    /**
     * Upload file to FTP.
     */
    public function uploadFileToFtp($image, $type)
    {
        if ($type == 'image') {
            $imageLink = $this->convertToJpeg($image);

            $imageName = explode('/', $imageLink)[count(explode('/', $imageLink)) - 1];

            $image = Storage::disk('public')->get('temporarStored/'.$imageName);
        }

        $ftpFile = Storage::disk('custom-ftp')->put($type == 'image' ? 'images/'.$imageName : 'others', $image);

        if ($type == 'image') {
            unlink($imageLink);

            return envValue('UPLOAD_FTP_SERVER_PUBLIC_SERVER').'images/'.$imageName;
        }

        return envValue('UPLOAD_FTP_SERVER_PUBLIC_SERVER').$ftpFile;
    }

    /**
     * Start Local Image Upload.
     */
    public function uploadLocalImage($file, $type)
    {
        $object = $file->store($type.'s/'.date('Y').'/'.date('m').'/'.date('d'));

        return envValue('APP_URL').'/'.$object;
    }

    /**
     * Check type of file and start upload workflow.
     */
    public function uploadFile($file)
    {
        $fileObject = new \stdClass();
        $fileObject->type = $this->checkTypeOfFile($file);

        if (!$fileObject->type) {
            return RequestsTrait::processResponse(false, ['message' => 'You must upload Image or Video File']);
        }
        if (envValue('APP_ENV') == 'local') {
            $fileObject->url = $this->uploadFileToFtp($file, $fileObject->type);
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
        if (substr($file->getMimeType(), 0, 5) == 'image') {
            return 'image';
        }

        if (substr($file->getMimeType(), 0, 5) == 'video') {
            return 'video';
        }

        return false;
    }

    /**
     * Return Difference between two dates.
     */
    public function differenceBetweenDates($dateTwo, $dateOne = null)
    {
        if (!$dateOne) {
            $dateOne = date('Y-m-d');
        }
        $dateDifference = abs(strtotime($dateOne) - strtotime($dateTwo));
        $years = floor($dateDifference / (365 * 60 * 60 * 24));
        $months = floor(($dateDifference - $years * 365 * 60 * 60 * 24) / (30 * 60 * 60 * 24));
        $days = floor(($dateDifference - $years * 365 * 60 * 60 * 24 - $months * 30 * 60 * 60 * 24) / (60 * 60 * 24));

        return $months.' months and '.$days.' days';
    }

    /**
     * Check if account sent is linked to current connected admin.
     */
    public function checkIfAccountLinkedToCurrentAdmin($accountIds)
    {
        foreach ($accountIds as $accountId) {
            // TODO -> Add check with ProviderToken
            $account = Account::where('id', $accountId)->where('CompanyId', UserTrait::getCompanyId())->first();
            if (!$account) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if user is linked to Actual Company.
     */
    public function checkIfUsersAreLinkedToActualCompany($users)
    {
        foreach ($users as $user) {
            $account = UserTrait::isUserLinkedToActualCompany($user);
            if (!$account) {
                return false;
            }
        }

        return true;
    }

    /**
     * Clean Media Array.
     */
    public function cleanMediaArray($array, $type)
    {
        $newArray = [];

        if ($array) {
            foreach ($array as $element) {
                if ($element) {
                    $newArray[] = $element;
                }
            }
        }

        return $newArray;
    }
}
