<?php

namespace App\Http\Controllers\functions;

use App\Http\Controllers\Controller;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
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
