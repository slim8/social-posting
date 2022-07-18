<?php

namespace App\Http\Controllers;

use App\Http\Traits\RequestsTrait;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Facades\Image;


class NewsController extends Controller
{
    use RequestsTrait;
    protected $fileController;

    /**
     * Construct
     */

     public function __construct()
     {
        $this->fileController = new FileController();
     }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return RequestsTrait::processResponse(true , ['news' => News::with('textMediaNews')->get()]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'title' => 'required',
            'teaser' => 'required',
            'date' => 'required',
            'image' => 'required|mimes:png,jpg,jpeg'
        ]);

        if($validation->fails()){
            return RequestsTrait::processResponse(false , [ "error" => $validation->errors()]);
        }

        try{
            $picture = $this->fileController->uploadLocalAndReturnObject( $request->file('image'), 'image' );
            News::create([
                'title' => $request->title,
                'teaser' => $request->teaser,
                'date' => $request->date,
                'picture' => json_encode($picture),
                'template' => $request->template
            ]);
            return RequestsTrait::processResponse(true);
        }catch(\Exception $e){
            return RequestsTrait::processResponse(false , [ "error" => $e->getMessage() ]);
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
        return RequestsTrait::processResponse(true , ['new' => News::where('id',$id)->with('textMediaNews')->first()]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validation = Validator::make($request->all(), [
            'title' => 'required',
            'teaser' => 'required',
            'date' => 'required',
        ]);

        if($validation->fails()){
            return RequestsTrait::processResponse(false , [ "error" => $validation->errors()]);
        }

        try{
            $post = News::where('id',$id)->first();
            if($request->file('image')){
                Storage::delete(json_decode($post->picture)->name);
                $picture = $this->fileController->uploadLocalAndReturnObject( $request->file('image'), 'image' );
                $post->picture = json_encode($picture);
            }
            $post->title = $request->title;
            $post->teaser = $request->teaser;
            $post->date = $request->date;
            $post->template = $request->template;

            $post->save();
            return RequestsTrait::processResponse(true);
        }catch(\Exception $e){
            return RequestsTrait::processResponse(false , [ "error" => $e->getMessage() ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $post = News::where('id',$id)->first();
            Storage::delete(json_decode($post->picture)->name);
            $post->delete();
            return RequestsTrait::processResponse(true);
        }catch(\Exception $e){
            return RequestsTrait::processResponse(false , [ "error" => $e->getMessage() ]);
        }
    }


    
}
