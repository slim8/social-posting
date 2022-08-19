<?php

namespace App\Http\Controllers\Functions;

use App\Http\Controllers\Controller;
use App\Http\Controllers\FileController;
use App\Http\Controllers\TraitController;
use App\Models\Account;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use \getID3;

class UtilitiesController extends Controller
{
    protected $imageManager;
    protected $traitController;
    protected $fileController;

    public function __construct()
    {
        $this->imageManager = new ImageManager();
        $this->traitController = new TraitController();
    }

    /**
     * Get aspect ratio from resolution.
     */
    public function getAspectRatio($imageWidth, $imageHeight)
    {
        $object = [];
        $divisor = array_reduce([$imageWidth, $imageHeight], 'gcd');
        $object['x'] = $imageWidth / $divisor;
        $object['y'] = $imageHeight / $divisor;

        return $object;
    }

    /**
     * Validate Instagram Video.
     */
    public function validateVideoForInstagram($link)
    {
        $isLocal = envValue('APP_ENV') == 'local';

        $object = new \stdClass();
        $object->status = true;

        if ($isLocal) {
            $name = explode('/', $link);
            $name = $name[count($name) - 1];
            $extension = explode('.', $name)[1];
            $name = explode('.', $name)[0];
            $file = $this->fileController->storeVideoToDisk($this->traitController->getCurrentId().uniqid().$name, $link, $extension, 'videoControls');
        } else {
            $linkArray = explode('/storage/', $link);
            $file = $linkArray[1];
        }

        $path = Storage::path($file);
        $object->message = '';
        $getID3 = new \getID3();
        $file = $getID3->analyze($path);
        $aspectRatio = $this->getAspectRatio($file['video']['resolution_x'], $file['video']['resolution_y']);

        if (!(strtoupper($file['fileformat']) == 'MP4' || strtoupper($file['fileformat']) == 'MOV')) {
            $object->status = false;
            $object->message = $object->message.' - File format must be MP4 Or MOV , Given :'.strtoupper($file['fileformat']);
        }

        if ($file['video']['resolution_x'] > 1920) {
            $object->status = false;
            $object->message = $object->message.' - Video width must be smaller than 1920px , Given: '.$file['video']['resolution_x'];
        }
        if (!str_contains($file['video']['fourcc_lookup'], 'H.264')) {
            $object->status = false;
            $object->message = $object->message.' - Video codec must be of type H264 , Given: '.$file['video']['fourcc_lookup'];
        }

        if (!($file['video']['frame_rate'] >= 23 && $file['video']['frame_rate'] <= 60)) {
            $object->status = false;
            $object->message = $object->message.' - Video frame rate must be between 23-60 , Given: '.$file['video']['frame_rate'];
        }

        if ($file['bitrate'] >= (5 * 1024 * 1000)) {
            $object->status = false;
            $object->message = $object->message.' - Video bitrate must be lower than 5Mbps , Given: '.$file['bitrate'] / 1024000;
        }

        if (!($aspectRatio['x'] >= 4 && $aspectRatio['x'] <= 16 && $aspectRatio['y'] >= 5 && $aspectRatio['y'] <= 9)) {
            $object->status = false;
            $object->message = $object->message.' - Video aspect ratio must be between 4 / 5 and 16 / 9 , Given: '.$aspectRatio['x'].' /'.$aspectRatio['y'];
        }

        if (!($file['playtime_seconds'] >= 3 && $file['playtime_seconds'] <= 60)) {
            $object->status = false;
            $object->message = $object->message.' - Video duration must be between 3s and 60s , Given: '.$file['playtime_seconds'];
        }

        if (isset($file['audio'])) {
            if (!str_contains(strtoupper($file['audio']['codec']), 'AAC')) {
                $object->status = false;
                $object->message = $object->message.' - Audio codec must be AAC , Given :'.strtoupper($file['audio']['codec']);
            }

            if (!($file['audio']['sample_rate'] / 1000 <= 48)) {
                $object->status = false;
                $object->message = $object->message.' - Audio Simple rate must be lower than 48khz , Given :'.$file['audio']['sample_rate'] / 1000;
            }

            if (!($file['audio']['channels'] >= 1 && $file['audio']['channels'] <= 2)) {
                $object->status = false;
                $object->message = $object->message.' - Audio Channel  must be 1 or 2 , Given :'.$file['audio']['channels'];
            }

            if (!(strtoupper($file['audio']['channelmode']) == 'STEREO' || strtoupper($file['audio']['channelmode']) == 'MONO')) {
                $object->status = false;
                $object->message = $object->message.' - Audio Channel mode must be mono or stereo , Given :'.$file['audio']['channelmode'];
            }
        }

        if ($isLocal) {
            unlink($path);
        }

        return $object;
    }

    /**
     * Validate Post (check if Eg Post without media to instagram Or Video + Images on se same post to facebook page).
     */
    public function postValidator($accountIds, $images, $videos)
    {
        $this->fileController = new FileController();
        $providersType = [];
        $providersName = [];
        $responseObject = new \stdClass();

        foreach ($accountIds as $singleAccountId) {
            $account = $this->traitController->findAccountByUid($singleAccountId, 'id', 1);
            if ($account) {
                array_push($providersType, $account->providerType);
                array_push($providersName, $account->provider);
            } else {
                $responseObject->status = false;
                $responseObject->message = 'Can not post with disconnected account';
            }
        }
        $responseObject->status = true;
        $isFacebookPage = in_array('facebook', $providersName) && in_array('page', $providersType);
        $isInstagramAccountPage = in_array('instagram', $providersName);

        if (!$videos && !$images && ($isInstagramAccountPage || $isFacebookPage)) {
            $responseObject->status = false;
            $responseObject->messageString = 'Can not post Without Media';
            $responseObject->message['medias'][] = $responseObject->messageString;
        }
        if ($videos && count($videos) > 1 && $isFacebookPage) {
            $responseObject->status = false;
            $responseObject->messageString = 'Can not upload more than one video on Facebook';
            $responseObject->message['others'][] = $responseObject->messageString;
        }

        if ($videos && count($videos) > 0 && $images && count($images) && $isFacebookPage) {
            $responseObject->status = false;
            $responseObject->messageString = 'Can not upload video and images on the same post on Facebook';
            $responseObject->message['others'][] = $responseObject->messageString;
        }

        // if ($videos && $isInstagramAccountPage) {
        //     $incVideo = 0;
        //     foreach ($videos as $video) {
        //         ++$incVideo;
        //         $videoLink = json_decode($video, true)['url'];
        //         $object = $this->validateVideoForInstagram($videoLink);

        //         if (!$object->status) {
        //             $responseObject->status = false;
        //             $responseObject->messageString = $object->message;
        //             $responseObject->message['others'][] = 'Video '.$incVideo.' : '.$object->message;
        //         }
        //     }
        // }

        return $responseObject;
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
            $account = Account::where('id', $accountId)->where('CompanyId', $this->traitController->getCompanyId())->first();
            if (!$account) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if admin has right to this user
     */
    public function checkUserRight($accountId)
    {
        $account = User::where('id', $accountId)->where('CompanyId', $this->traitController->getCompanyId())->first();
        if (!$account) {
            return false;
        }

        return true;
    }

    /**
     * Check if user is linked to Actual Company.
     */
    public function checkIfUsersAreLinkedToActualCompany($users)
    {
        foreach ($users as $user) {
            $account = $this->traitController->isUserLinkedToActualCompany($user);
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
