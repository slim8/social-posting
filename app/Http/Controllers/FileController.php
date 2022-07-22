<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Functions\UtilitiesController;
use App\Http\Traits\RequestsTrait;
use File;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Image;
use Intervention\Image\ImageManager;

class FileController extends Controller
{
    use RequestsTrait;

    protected $utilitiesController;
    protected $traitController;
    protected $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager();
        $this->utilitiesController = new UtilitiesController();
        $this->traitController = new TraitController();
    }

    /**
     * Store a File Link to Disk.
     */
    public function storeFromLinkToDisk($fileName, $link, $folderName = 'pageAssets')
    {
        $curlCh = curl_init();
        curl_setopt($curlCh, CURLOPT_URL, $link);
        curl_setopt($curlCh, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curlCh, CURLOPT_SSLVERSION, 0);
        $curlData = curl_exec($curlCh);
        curl_close($curlCh);
        if (!empty($curlData)) {
            Storage::disk('public')->put($folderName.'/'.$fileName.'.jpg', $curlData);
            $url = Storage::url($folderName.'/'.$fileName.'.jpg');
        }
        Log::channel('info')->info('User : '.$this->traitController->getCurrentId().' Fetch link to '.$link);

        return $url;
    }

    /**
     * Convert Image To Jpeg.
     */
    public function convertToJpeg($folderName, $image, int $isOnDisk = 0, string $filePathName = null)
    {

        if (!$isOnDisk) {
            $object = $image->store('temporar'.'s/'.date('Y').'/'.date('m').'/'.date('d'));
        }

        $object = $isOnDisk ? $filePathName : storage_path().'/app/public/'.$object;
        $exploded = explode('/', $object);
        $fileName = $exploded[count($exploded) - 1];
        $newFileName = explode('.', $fileName)[0];
        $newFile = storage_path().'/app/public/'.$folderName.'/'.$newFileName.'.jpeg';
        $this->imageManager->make($object)->encode('jpg', 80)->save($newFile);

        unlink($object);

        return $newFile;
    }

    /**
     * Upload File Method to Save File on Device.
     */
    public function uploadFile(Request $request)
    {
        $response = $request->file('file') ? $this->uploadSimpleFile($request->file('file')) : false;

        return $this->traitController->processResponse($response ? true : false, ['files' => $response]);
    }

    /**
     * Upload File Method to Base64 on Device.
     */
    public function uploadBase64(Request $request)
    {
        $fileObject = new \stdClass();

        if ($request->file) {
            $type = explode(',', $request->file)[0];
            if (!strpos($type, 'image')) {
                return $this->traitController->processResponse(false, ['message' => 'file must be image']);
            }
            $base64_str = substr($request->file, strpos($request->file, ',') + 1);
            $image = base64_decode($base64_str);
            $imageName = $token = Str::random(20).'.png';
            $newImagePath = Storage::disk('public')->put('temporarStored/'.$imageName, $image);
            if (!$newImagePath) {
                return $this->traitController->processResponse(false);
            }
            $newImagePath = storage_path().'/app/public/temporarStored/'.$imageName;
            $fileObject->type = 'image';

            if (envValue('APP_ENV') == 'local') {
                $fileObject->url = $this->uploadToDistant($newImagePath, 'image', 1, $newImagePath);
            } else {
                $fileObject->url = $this->uploadLocal($newImagePath, 'image' , 1);
            }

            return $this->traitController->processResponse(true, ['files' => $fileObject]);
        } else {
            return $this->traitController->processResponse(false, ['files' => false]);
        }
    }

    /**
     * Check type of file and start upload workflow.
     */
    public function uploadSimpleFile($file)
    {
        $fileObject = new \stdClass();
        $fileObject->type = $this->checkTypeOfFile($file);

        if (!$fileObject->type) {
            return $this->traitController->processResponse(false, ['message' => 'You must upload Image or Video File']);
        }
        if (envValue('APP_ENV') == 'local') {
            $fileObject->url = $this->uploadToDistant($file, $fileObject->type);
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
     * Start Local Upload.
     */
    public function uploadLocal($file, $type , int $isBase64 = 0)
    {
        if ($type == 'image') {
            if($isBase64){
                $imageLink = $this->convertToJpeg('postedImages', $file , $isBase64 , $file);
            } else {
                $imageLink = $this->convertToJpeg('postedImages', $file);
            }
            $imageName = explode('/', $imageLink)[count(explode('/', $imageLink)) - 1];

            return Storage::url('postedImages/'.$imageName);
        } else {
            $object = $file->store($type.'s/'.date('Y').'/'.date('m').'/'.date('d'));

            return Storage::url($object);
        }
    }

    /**
     * Upload Local Image and return Object.
     */
    public function uploadLocalAndReturnObject($file, $type)
    {
        $response = new \stdClass();
        if ($type == 'image') {
            $imageLink = $this->convertToJpeg('images/', $file);
            $imageName = explode('/', $imageLink)[count(explode('/', $imageLink)) - 1];
            $response->url = Storage::url('images/'.$imageName);
            $response->name = 'images/'.$imageName;
        } else {
            $object = $file->store($type.'s/'.date('Y').'/'.date('m').'/'.date('d'));
            $response->url = Storage::url($object);
            $response->name = $object;
        }

        return $response;
    }

    /**
     * Upload file to FTP.
     */
    public function uploadToDistant($image, $type, int $isOnDisk = 0, string $filePathName = null)
    {
        if ($type == 'image') {
            $imageLink = $this->convertToJpeg('temporarStored', $image, $isOnDisk, $filePathName);
            $imageName = explode('/', $imageLink)[count(explode('/', $imageLink)) - 1];
            $image = envValue('UPLOAD_PROVIDER') == 'hoster' ? $imageLink : Storage::disk('public')->get('temporarStored/'.$imageName);
        }

        if (envValue('UPLOAD_PROVIDER') == 'hoster') {
            $client = new Client();

            $response = $client->request('POST', envValue('IMAGE_HOSTER_URL'), [
                'multipart' => [
                    ['name' => 'media', 'contents' => fopen($image, 'rb')],
                    ['name' => 'key', 'contents' => envValue('IMAGE_HOSTER_API')],
                ],
            ]);

            if ($type == 'image') {
                unlink($imageLink);
            }

            if ($response->getStatusCode() == 200) {
                $arrayResponse = json_decode($response->getBody(), true);
                if ($arrayResponse['success']) {
                    return $arrayResponse['data']['media'];
                } else {
                    $this->traitController->processResponse(false, ['message' => 'Upload Failed']);
                }
            } else {
                $this->traitController->processResponse(false, ['message' => 'Upload Failed']);
            }
        } else {
            $ftpFile = Storage::disk('custom-ftp')->put($type == 'image' ? 'images/'.$imageName : 'others', $image);

            if ($type == 'image') {
                unlink($imageLink);

                return envValue('UPLOAD_FTP_SERVER_PUBLIC_SERVER').'images/'.$imageName;
            }

            return envValue('UPLOAD_FTP_SERVER_PUBLIC_SERVER').$ftpFile;
        }
    }
}
