<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Functions\UtilitiesController;
use App\Http\Traits\MailTrait;
use App\Http\Traits\RequestsTrait;
use File;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Image;
use Intervention\Image\ImageManager;

class FileController extends Controller
{
    use MailTrait;
    use RequestsTrait;

    protected $utilitiesController;
    protected $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager();
        $this->utilitiesController = new UtilitiesController();
    }

    public function sendmail()
    {
        MailTrait::index('This is an mail exemple', 'zied.maaloul@softtodo.com', 'Subject Exemple');
    }

    /**
     * Convert Image To Jpeg.
     */
    public function convertToJpeg($folderName , $image, int $isOnDisk = 0, string $filePathName = null)
    {
        if (!$isOnDisk) {
            $object = $image->store('temporar' . 's/' . date('Y') . '/' . date('m') . '/' . date('d'));
        }

        $object = $isOnDisk ? $filePathName : storage_path() . '/app/public/' . $object;
        $exploded = explode('/', $object);
        $fileName = $exploded[count($exploded) - 1];
        $newFileName = explode('.', $fileName)[0];
        $newFile = storage_path() . '/app/public/'.$folderName.'/' . $newFileName . '.jpeg';
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

        return RequestsTrait::processResponse($response ? true : false, ['files' => $response]);
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
                return RequestsTrait::processResponse(false, ['message' => 'file must be image']);
            }
            $base64_str = substr($request->file, strpos($request->file, ',') + 1);
            $image = base64_decode($base64_str);
            $imageName = $token = Str::random(20) . '.png';
            $newImagePath = Storage::disk('public')->put('temporarStored/' . $imageName, $image);
            if (!$newImagePath) {
                return RequestsTrait::processResponse(false);
            }
            $newImagePath = storage_path() . '/app/public/temporarStored/' . $imageName;
            $fileObject->type = 'image';

            if (envValue('APP_ENV') == 'local') {
                $fileObject->url = $this->uploadToDistant($newImagePath, 'image', 1, $newImagePath);
            } else {
                $fileObject->url = $this->uploadLocal($newImagePath, 'image');
            }

            return RequestsTrait::processResponse(true, ['files' => $fileObject]);
        } else {
            return RequestsTrait::processResponse(false, ['files' => false]);
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
            return RequestsTrait::processResponse(false, ['message' => 'You must upload Image or Video File']);
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
    public function uploadLocal($file, $type)
    {
        if ($type == 'image') {
            $imageLink = $this->convertToJpeg('postedImages' , $file);
            $imageName = explode('/', $imageLink)[count(explode('/', $imageLink)) - 1];
            return Storage::url('postedImages/'.$imageName);
        } else {
            $object = $file->store($type . 's/' . date('Y') . '/' . date('m') . '/' . date('d'));
            return Storage::url($object);
        }

    }

    /**
     * Upload file to FTP.
     */
    public function uploadToDistant($image, $type, int $isOnDisk = 0, string $filePathName = null)
    {
        if ($type == 'image') {
            $imageLink = $this->convertToJpeg('temporarStored', $image, $isOnDisk, $filePathName);
            $imageName = explode('/', $imageLink)[count(explode('/', $imageLink)) - 1];
            $image = envValue('UPLOAD_PROVIDER') == 'hoster' ? $imageLink : Storage::disk('public')->get('temporarStored/' . $imageName);
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
                    RequestsTrait::processResponse(false, ['message' => 'Upload Failed']);
                }
            } else {
                RequestsTrait::processResponse(false, ['message' => 'Upload Failed']);
            }
        } else {
            $ftpFile = Storage::disk('custom-ftp')->put($type == 'image' ? 'images/' . $imageName : 'others', $image);

            if ($type == 'image') {
                unlink($imageLink);

                return envValue('UPLOAD_FTP_SERVER_PUBLIC_SERVER') . 'images/' . $imageName;
            }

            return envValue('UPLOAD_FTP_SERVER_PUBLIC_SERVER') . $ftpFile;
        }
    }
}
