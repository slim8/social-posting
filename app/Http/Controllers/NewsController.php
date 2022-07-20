<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class NewsController extends Controller
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
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->traitController->processResponse(true, ['news' => News::with('textMediaNews')->get()]);
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
            'teaser' => 'required',
            'date' => 'required',
            'image' => 'required|mimes:png,jpg,jpeg',
        ]);

        if ($validation->fails()) {
            return $this->traitController->processResponse(false, ['error' => $validation->errors()]);
        }

        try {
            $picture = $this->fileController->uploadLocalAndReturnObject($request->file('image'), 'image');
            $newsObject = News::create([
                'title' => $request->title,
                'teaser' => $request->teaser,
                'date' => $request->date,
                'picture' => json_encode($picture),
                'template' => $request->template,
            ]);
            Log::channel('info')->info('User : '.$this->traitController->getCurrentId().' add new News Id : '.$newsObject->id);

            return $this->traitController->processResponse(true);
        } catch (\Exception $e) {
            Log::channel('exception')->error($e->getMessage());

            return $this->traitController->processResponse(false, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->traitController->processResponse(true, ['new' => News::where('id', $id)->with('textMediaNews')->first()]);
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
            'teaser' => 'required',
            'date' => 'required',
        ]);

        if ($validation->fails()) {
            return $this->traitController->processResponse(false, ['error' => $validation->errors()]);
        }

        try {
            $post = News::where('id', $id)->first();
            if ($request->file('image')) {
                Storage::delete(json_decode($post->picture)->name);
                $picture = $this->fileController->uploadLocalAndReturnObject($request->file('image'), 'image');
                $post->picture = json_encode($picture);
            }
            Log::channel('info')->info('User : '.$this->traitController->getCurrentId().' update a News Id : '.$id);
            $post->title = $request->title;
            $post->teaser = $request->teaser;
            $post->date = $request->date;
            $post->template = $request->template;

            $post->save();

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
            $post = News::where('id', $id)->first();
            Storage::delete(json_decode($post->picture)->name);
            $post->delete();
            Log::channel('info')->info('User : '.$this->traitController->getCurrentId().' delete a News Id : '.$id);

            return $this->traitController->processResponse(true);
        } catch (\Exception $e) {
            Log::channel('exception')->info($e->getMessage());

            return $this->traitController->processResponse(false, ['error' => $e->getMessage()]);
        }
    }
}
