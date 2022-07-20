<?php

namespace App\Http\Controllers;

use App\Models\TextMediaNews;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class TextMediaNewsController extends Controller
{
    protected $fileController;
    protected $traitController;

    /**
     * Construct.
     */
    public function __construct()
    {
        $this->fileController = new FileController();
        $this->traitController = new TraitController();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'title' => 'required',
            'subtitle' => 'required',
            'description' => 'required',
            'newsId' => 'required',
            'image' => 'required|mimes:png,jpg,jpeg',
        ]);

        if ($validation->fails()) {
            return $this->traitController->processResponse(false, ['error' => $validation->errors()]);
        }

        try {
            $picture = $this->fileController->uploadLocalAndReturnObject($request->file('image'), 'image');
            $newTextMedia = TextMediaNews::create([
                'title' => $request->title,
                'subtitle' => $request->subtitle,
                'description' => $request->description,
                'picture' => json_encode($picture),
                'newsId' => $request->newsId,
            ]);
            Log::channel('info')->info('User : '.$this->traitController->getCurrentId() . ' add new TextMediaNews : '.$newTextMedia->id);
            return $this->traitController->processResponse(true);
        } catch (\Exception $e) {
            Log::channel('exception')->error($e->getMessage());
            return $this->traitController->processResponse(false, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->traitController->processResponse(true , ['textMedia' => TextMediaNews::where('id',$id)->first()]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int                      $id
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validation = Validator::make($request->all(), [
            'title' => 'required',
            'subtitle' => 'required',
            'description' => 'required',
            'newsId' => 'required',
        ]);

        if ($validation->fails()) {
            return $this->traitController->processResponse(false, ['error' => $validation->errors()]);
        }

        try {
            $textMedia = TextMediaNews::where('id', $id)->first();
            if ($request->file('image')) {
                Storage::delete(json_decode($textMedia->picture)->name);
                $picture = $this->fileController->uploadLocalAndReturnObject($request->file('image'), 'image');
                $textMedia->picture = json_encode($picture);
            }
            Log::channel('info')->info('User : '.$this->traitController->getCurrentId() . ' Has Update TextMediaNews : '.$id);
            $textMedia->title = $request->title;
            $textMedia->subtitle = $request->subtitle;
            $textMedia->description = $request->description;
            $textMedia->newsId = $request->newsId;
            $textMedia->save();

            return $this->traitController->processResponse(true);
        } catch (\Exception $e) {
            Log::channel('exception')->error($e->getMessage());
            return $this->traitController->processResponse(false, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $textMedia = TextMediaNews::where('id', $id)->first();
            Storage::delete(json_decode($textMedia->picture)->name);
            $textMedia->delete();
            Log::channel('info')->info('User : '.$this->traitController->getCurrentId() . ' Has delete TextMediaNews : '.$id);
            return $this->traitController->processResponse(true);
        } catch (\Exception $e) {
            Log::channel('exception')->error($e->getMessage());
            return $this->traitController->processResponse(false, ['error' => $e->getMessage()]);
        }
    }
}
